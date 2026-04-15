import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isBlockedToken,
  saveTokens,
} from "../utils/token";


const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

function resolveApiUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

function isAuthRequest(url?: string): boolean {
  return (
    !!url &&
    (url.includes("/api/auth/login") ||
      url.includes("/api/auth/refresh") ||
      url.includes("/api/auth/logout"))
  );
}

function getLoginUrl(): string {
  const basePath = "/" + window.location.pathname.split("/")[1];
  return basePath + "/login";
}

function redirectToLogin(): void {
  clearTokens();
  if (!window.location.pathname.includes("/login")) {
    window.location.href = getLoginUrl();
  }
}

function isRateLimitBlockedDetail(detail?: string): boolean {
  if (!detail) return false;
  const message = detail.toLowerCase();
  return (
    message.includes("too many requests") ||
    message.includes("account has been blocked")
  );
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (!token) return config;

  if (isBlockedToken(token)) {
    redirectToLogin();
    return Promise.reject(new Error("Blocked account"));
  }

  if (!isAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || isAuthRequest(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(resolveApiUrl("/api/auth/refresh"), {
          refresh_token: refreshToken,
        });

        if (isBlockedToken(res.data.access_token)) {
          redirectToLogin();
          return Promise.reject(error);
        }

        saveTokens(res.data);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return apiClient(originalRequest);
      } catch {
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    // 401 이외의 HTTP 에러 — alert로 표시
    const status = error.response?.status;
    const detail: string | undefined = error.response?.data?.detail;

    if (status === 403) {
      if (isRateLimitBlockedDetail(detail)) {
        alert(detail ?? "차단된 계정입니다.");
        redirectToLogin();
      } else {
        const token = getAccessToken();
        if (token && isBlockedToken(token)) {
          alert("차단된 계정입니다.");
          redirectToLogin();
        } else {
          alert(detail ?? "접근 권한이 없습니다.");
        }
      }
    } else if (status === 404) {
      alert(detail ?? "요청한 리소스를 찾을 수 없습니다.");
    } else if (status === 409) {
      alert(detail ?? "요청이 충돌했습니다. 다시 시도해 주세요.");
    } else if (status && status >= 500) {
      alert(detail ?? "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } else if (!error.response) {
      alert("네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요.");
    }

    return Promise.reject(error);
  },
);

export default apiClient;

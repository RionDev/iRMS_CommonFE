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

/** 토큰 없이 호출하는 엔드포인트 (Authorization 헤더 첨부 스킵) */
function isTokenlessRequest(url?: string): boolean {
  return (
    !!url &&
    (url.includes("/api/auth/login") || url.includes("/api/auth/refresh"))
  );
}

/** 응답 에러 인터셉터의 retry/alert 로직을 스킵할 엔드포인트 (auth 전체) */
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

  if (token && isBlockedToken(token)) {
    redirectToLogin();
    return Promise.reject(new Error("Blocked account"));
  }

  if (token && !isTokenlessRequest(config.url)) {
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

    // 401 이외의 HTTP 에러 — 차단 계정만 리다이렉트, 나머지는 호출부에서 처리
    const status = error.response?.status;
    const detail: string | undefined = error.response?.data?.detail;

    if (status === 403) {
      if (isRateLimitBlockedDetail(detail)) {
        redirectToLogin();
      } else {
        const token = getAccessToken();
        if (token && isBlockedToken(token)) {
          redirectToLogin();
        }
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../utils/token';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const apiBaseUrl = import.meta.env.DEV ? '' : configuredBaseUrl;

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

function resolveApiUrl(path: string): string {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

function isAuthRequest(url?: string): boolean {
  return !!url && (url.includes('/api/auth/login') || url.includes('/api/auth/refresh'));
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !isAuthRequest(config.url)) {
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
        clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          resolveApiUrl('/api/auth/refresh'),
          { refresh_token: refreshToken },
        );
        saveTokens(res.data);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return apiClient(originalRequest);
      } catch {
        clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

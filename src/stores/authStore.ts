import axios from "axios";
import { create } from "zustand";
import { logout as apiLogout } from "../services/authService";
import type { AuthPayload, TokenPair } from "../types/auth";
import {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  isBlockedToken,
  saveTokens,
} from "../utils/token";
import { useAppsStore } from "./appsStore";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

interface AuthState {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (tokens: TokenPair) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (tokens: TokenPair) => {
    const payload = decodeToken(tokens.access_token);
    if (payload.status === 3) {
      clearTokens();
      set({ user: null, isAuthenticated: false });
      return;
    }

    saveTokens(tokens);
    set({ user: payload, isAuthenticated: true });
    useAppsStore.getState().fetchApps();
  },

  logout: async () => {
    // BE에 refresh token 무효화 요청 (await: 요청이 Authorization 헤더 세팅 후 전송되도록)
    // 네트워크 실패해도 로컬 정리는 진행 — UX 우선
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await apiLogout(refreshToken);
      } catch {
        // 로그아웃 실패는 무시 — 로컬은 어차피 정리되므로 사용자 입장에선 로그아웃 완료
      }
    }
    clearTokens();
    useAppsStore.getState().clear();
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const payload = decodeToken(token);
      if (payload.exp * 1000 > Date.now() && !isBlockedToken(token)) {
        set({ user: payload, isAuthenticated: true });
        useAppsStore.getState().fetchApps();
        return;
      }
    } catch {
      // access token 디코딩 실패 — refresh 시도
    }

    // access token 만료 또는 유효하지 않음 — refresh 시도
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return;
    }

    try {
      const url = apiBaseUrl
        ? `${apiBaseUrl}/api/auth/refresh`
        : "/api/auth/refresh";
      const res = await axios.post(url, { refresh_token: refreshToken });

      if (isBlockedToken(res.data.access_token)) {
        clearTokens();
        return;
      }

      saveTokens(res.data);
      const payload = decodeToken(res.data.access_token);
      set({ user: payload, isAuthenticated: true });
      useAppsStore.getState().fetchApps();
    } catch {
      clearTokens();
    }
  },
}));

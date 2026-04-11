import axios from "axios";
import { create } from "zustand";
import type { AuthPayload, TokenPair } from "../types/auth";
import {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  isBlockedToken,
  saveTokens,
} from "../utils/token";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

interface AuthState {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (tokens: TokenPair) => void;
  logout: () => void;
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
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const payload = decodeToken(token);
      if (payload.exp * 1000 > Date.now() && !isBlockedToken(token)) {
        set({ user: payload, isAuthenticated: true });
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
    } catch {
      clearTokens();
    }
  },
}));

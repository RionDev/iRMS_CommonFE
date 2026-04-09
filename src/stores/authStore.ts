import { create } from "zustand";
import type { AuthPayload, TokenPair } from "../types/auth";
import {
  clearTokens,
  decodeToken,
  getAccessToken,
  isBlockedToken,
  saveTokens,
} from "../utils/token";

interface AuthState {
  user: AuthPayload | null;
  isAuthenticated: boolean;
  login: (tokens: TokenPair) => void;
  logout: () => void;
  initialize: () => void;
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

  initialize: () => {
    const token = getAccessToken();
    if (token) {
      try {
        const payload = decodeToken(token);
        if (payload.exp * 1000 > Date.now() && !isBlockedToken(token)) {
          set({ user: payload, isAuthenticated: true });
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }
    }
  },
}));

import type { AuthPayload, TokenPair } from "../types/auth";

const ACCESS_TOKEN_KEY = "irms_access_token";
const REFRESH_TOKEN_KEY = "irms_refresh_token";
const BLOCKED_USER_STATUS = 3;

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveTokens(tokens: TokenPair): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function decodeToken(token: string): AuthPayload {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export function isBlockedToken(token: string): boolean {
  try {
    const payload = decodeToken(token);
    return payload.status === BLOCKED_USER_STATUS;
  } catch {
    return false;
  }
}

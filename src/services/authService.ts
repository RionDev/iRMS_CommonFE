import type { LoginRequest, LoginResponse, TokenPair } from "../types/auth";
import apiClient from "./apiClient";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/api/auth/login", data);
  return res.data;
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  const res = await apiClient.post<TokenPair>("/api/auth/refresh", {
    refresh_token: refreshToken,
  });
  return res.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/api/auth/logout", { refresh_token: refreshToken });
}

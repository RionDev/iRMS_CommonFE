import apiClient from './apiClient';
import type { LoginRequest, LoginResponse, TokenPair } from '../types/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/api/auth/login', data);
  return res.data;
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  const res = await apiClient.post<TokenPair>('/api/auth/refresh', {
    refresh_token: refreshToken,
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout');
}

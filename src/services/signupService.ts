import apiClient from './apiClient';
import type { SignupRequest, SignupResponse } from '../types/signup';

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const res = await apiClient.post<SignupResponse>('/api/user/register', data);
  return res.data;
}

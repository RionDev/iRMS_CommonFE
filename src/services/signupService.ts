import type { SignupRequest, SignupResponse } from "../types/signup";
import apiClient from "./apiClient";

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const res = await apiClient.post<SignupResponse>("/api/user/register", data);
  return res.data;
}

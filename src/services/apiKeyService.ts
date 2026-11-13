import type {
  ApiKeyListResponse,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
} from "../types/apiKey";
import apiClient from "./apiClient";

export async function listApiKeys(): Promise<ApiKeyListResponse> {
  const res = await apiClient.get<ApiKeyListResponse>("/api/auth/api-keys");
  return res.data;
}

export async function createApiKey(
  data: CreateApiKeyRequest,
): Promise<CreateApiKeyResponse> {
  const res = await apiClient.post<CreateApiKeyResponse>("/api/auth/api-keys", data);
  return res.data;
}

/** 키 원문 다시 받기 (복사용) — 남의 키·무효화·보관 안 된 키는 404 */
export async function revealApiKey(idx: number): Promise<string> {
  const res = await apiClient.get<{ key: string }>(`/api/auth/api-keys/${idx}/key`);
  return res.data.key;
}

export async function revokeApiKey(idx: number): Promise<void> {
  await apiClient.delete(`/api/auth/api-keys/${idx}`);
}

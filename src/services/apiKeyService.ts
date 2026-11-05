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

export async function revokeApiKey(idx: number): Promise<void> {
  await apiClient.delete(`/api/auth/api-keys/${idx}`);
}

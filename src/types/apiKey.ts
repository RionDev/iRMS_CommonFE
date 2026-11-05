/** GET /api/auth/api-keys 의 목록 항목. 전문은 없다. */
export interface ApiKeyItem {
  idx: number;
  name: string;
  key_prefix: string;
  expires_at: string | null;
  last_used_at: string | null;
  /** KST 오늘 호출 수 */
  usage_today: number;
  created_at: string;
}

/** 현재 한도 (BE 환경변수 값). 하드코딩하지 말고 이 값을 표시한다. */
export interface ApiKeyLimits {
  per_minute: number;
  per_day: number;
  max_active: number;
}

export interface ApiKeyListResponse {
  limits: ApiKeyLimits;
  api_keys: ApiKeyItem[];
}

export interface CreateApiKeyRequest {
  name: string;
  /** 1~365. 생략/null 이면 무기한 */
  expires_in_days?: number | null;
}

/** 전문(key)은 이 응답에서만 받을 수 있다. */
export interface CreateApiKeyResponse {
  idx: number;
  name: string;
  key: string;
  key_prefix: string;
  expires_at: string | null;
}

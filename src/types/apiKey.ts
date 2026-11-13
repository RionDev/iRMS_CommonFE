/** GET /api/auth/api-keys 의 목록 항목. 전문은 없다. */
export interface ApiKeyItem {
  idx: number;
  name: string;
  key_prefix: string;
  /** 키로 호출할 수 있는 앱 path 목록 */
  scopes: string[];
  expires_at: string | null;
  last_used_at: string | null;
  /** KST 오늘 호출 수 */
  usage_today: number;
  created_at: string;
  /** 원문이 보관돼 있어 다시 복사할 수 있는지 (이 기능 이전에 만든 키는 false) */
  copyable: boolean;
}

/** 현재 한도 (요청자 역할 기준, BE 환경변수 값). 하드코딩하지 말고 이 값을 표시한다. */
export interface ApiKeyLimits {
  per_minute: number;
  per_day: number;
  max_active: number;
  /** 무기한 키 발급 가능 여부 (GUEST 는 false) */
  unlimited_allowed: boolean;
}

/** 키 생성 시 고를 수 있는 앱 (관리자가 API 키 허용을 켠 앱 중 접근 가능한 것) */
export interface ScopeOption {
  path: string;
  name: string;
}

export interface ApiKeyListResponse {
  limits: ApiKeyLimits;
  available_scopes: ScopeOption[];
  api_keys: ApiKeyItem[];
}

export interface CreateApiKeyRequest {
  name: string;
  /** 1~365. 생략/null 이면 무기한 */
  expires_in_days?: number | null;
  /** available_scopes 중 1개 이상 */
  scopes: string[];
}

/** 전문(key)은 이 응답에서만 받을 수 있다. */
export interface CreateApiKeyResponse {
  idx: number;
  name: string;
  key: string;
  key_prefix: string;
  scopes: string[];
  expires_at: string | null;
}

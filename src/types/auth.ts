import type { RoleType, TeamType } from "./constants";

/**
 * 내부 DB 레코드 기반 사용자 (보통 FE 에서 직접 다루지 않음).
 * BE 응답은 대부분 VUser 또는 AuthPayload 를 사용한다.
 */
export interface User {
  idx: number;
  id: string;
  name: string;
  team: TeamType | null;
  role: RoleType;
  status: number;
  last_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * v_users 뷰 기반 사용자 정보.
 * BE 가 roles/teams/statuses 테이블과 JOIN 한 결과이므로 role/team/status 모두 이름 문자열이다.
 * role 은 대문자 영어 (ADMIN/LEAD/MEMBER/GUEST).
 */
export interface VUser {
  idx: number;
  id: string;
  name: string;
  role: RoleType;
  team: string | null;
  status: string;
  last_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  /**
   * 차단 사유. BE는 INACTIVE 상태로 전환 시 저장하며,
   * 다른 상태로 전환되면 자동으로 NULL 로 초기화한다.
   * 포맷: `"{adminName}:{ISO time}:{reason}"`.
   */
  blocked_reason?: string | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

/** JWT 디코딩 결과 */
export interface AuthPayload {
  sub: number;
  id: string;
  name: string;
  role: RoleType;
  team: TeamType | null;
  status: number;
  exp: number;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

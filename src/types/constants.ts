/**
 * 역할(Role) 상수 / 타입 / 라벨
 *
 * BE 와 규약: 전 구간 대문자 영어 string ("ADMIN"|"LEAD"|"MEMBER"|"GUEST") 로
 * 주고받는다. FE 는 숫자↔문자열 변환을 하지 않는다. 사람에게 보여줄 때만
 * ROLE_LABEL 로 한국어 라벨을 조회한다.
 *
 * 참고: DB `users.role` 컬럼만 int idx 로 저장되며 BE 내부에서 변환한다.
 */

export const Role = {
  ADMIN: "ADMIN",
  LEAD: "LEAD",
  MEMBER: "MEMBER",
  GUEST: "GUEST",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

/** 역할 code → 한국어 표시 라벨 */
export const ROLE_LABEL: Record<RoleType, string> = {
  ADMIN: "관리자",
  LEAD: "리드",
  MEMBER: "멤버",
  GUEST: "게스트",
};

/** `<option>` 생성용 — 관리자가 수정하는 UserForm 에서 사용 */
export const ROLE_OPTIONS: ReadonlyArray<{ value: RoleType; label: string }> = [
  { value: Role.ADMIN, label: ROLE_LABEL.ADMIN },
  { value: Role.LEAD, label: ROLE_LABEL.LEAD },
  { value: Role.MEMBER, label: ROLE_LABEL.MEMBER },
  { value: Role.GUEST, label: ROLE_LABEL.GUEST },
];

/** 자가 가입 폼(SignupForm) 에서 사용 — BE 정책상 MEMBER/GUEST 만 허용 */
export const SIGNUP_ROLE_OPTIONS: ReadonlyArray<{
  value: RoleType;
  label: string;
}> = [
  { value: Role.MEMBER, label: ROLE_LABEL.MEMBER },
  { value: Role.GUEST, label: ROLE_LABEL.GUEST },
];

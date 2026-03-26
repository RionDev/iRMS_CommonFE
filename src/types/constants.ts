export const Role = {
  MEMBER: 1,
  LEAD: 2,
  ADMIN: 3,
  GUEST: 4,
} as const;

export const Team = {
  ENGINE: 1,
  ANALYST: 2,
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];
export type TeamType = (typeof Team)[keyof typeof Team];

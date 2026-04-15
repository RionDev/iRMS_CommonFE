import type { RoleType, TeamType } from "./constants";

export interface SignupRequest {
  id: string;
  name: string;
  password: string;
  password_confirm: string;
  role: RoleType;
  team: TeamType | null;
}

export interface SignupResponse {
  message: string;
}

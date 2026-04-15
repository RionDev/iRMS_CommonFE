import type { RoleType } from "./constants";

export interface SignupRequest {
  id: string;
  name: string;
  password: string;
  password_confirm: string;
  role: RoleType;
  team: number | null;
}

export interface SignupResponse {
  message: string;
}

export interface User {
  idx: number;
  id: string;
  name: string;
  team: number;
  role: number;
  status: number;
  last_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VUser {
  idx: number;
  id: string;
  name: string;
  team_name: string;
  role_name: string;
  status_name: string;
  last_at: string | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AuthPayload {
  sub: number;
  id: string;
  name: string;
  role: number;
  team: number;
  exp: number;
}

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: VUser;
}

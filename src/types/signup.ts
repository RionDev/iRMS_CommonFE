export interface SignupRequest {
  id: string;
  name: string;
  password: string;
  password_confirm: string;
  role: number;
  team: number | null;
}

export interface SignupResponse {
  message: string;
}

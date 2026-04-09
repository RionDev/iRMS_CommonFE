// Pages
export { LoginPage } from "./pages/LoginPage";
export { SignupPage } from "./pages/SignupPage";

// Components
export { Button } from "./components/Button";
export { Input } from "./components/Input";
export { Layout } from "./components/Layout";
export { LoginForm } from "./components/LoginForm";
export { Modal } from "./components/Modal";

export { SideNav } from "./components/SideNav";
export type { SideNavItem } from "./components/SideNav";
export { SignupForm } from "./components/SignupForm";
export { theme } from "./styles/theme";

// Hooks
export { useApi } from "./hooks/useApi";
export { useAuth, useRequireRole } from "./hooks/useAuth";

// Services
export { default as apiClient } from "./services/apiClient";
export { login, logout, refresh } from "./services/authService";
export { signup } from "./services/signupService";

// Stores
export { useAuthStore } from "./stores/authStore";


// Types
export type {
  AuthPayload,
  LoginRequest,
  LoginResponse,
  TokenPair,
  User,
  VUser,
} from "./types/auth";
export { Role, Team } from "./types/constants";
export type { RoleType, TeamType } from "./types/constants";
export type { SignupRequest, SignupResponse } from "./types/signup";

// Utils
export {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./utils/token";

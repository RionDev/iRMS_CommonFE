// Pages
export { LoginPage } from "./pages/LoginPage";
export { SignupPage } from "./pages/SignupPage";

// Components
export { AppLayout } from "./components/AppLayout";
export type { SidebarItem } from "./components/AppLayout";
export { Avatar } from "./components/Avatar";
export { Button } from "./components/Button";
export { Input } from "./components/Input";
export { LoginForm } from "./components/LoginForm";
export { Modal } from "./components/Modal";
export { SignupForm } from "./components/SignupForm";
export { theme, lightTheme, darkTheme } from "./styles/theme";
export type { Theme, ThemeColors } from "./styles/theme";

// Hooks
export { useApi } from "./hooks/useApi";
export { useAuth, useAppAccess } from "./hooks/useAuth";

// Services
export { default as apiClient } from "./services/apiClient";
export { login, logout, refresh } from "./services/authService";
export { signup } from "./services/signupService";

// Stores
export { useAppsStore } from "./stores/appsStore";
export type { AppInfo } from "./stores/appsStore";
export { useAuthStore } from "./stores/authStore";
export { useThemeStore } from "./stores/themeStore";


// Types
export type {
  AuthPayload,
  LoginRequest,
  LoginResponse,
  TokenPair,
  User,
  VUser,
} from "./types/auth";
export {
  Role,
  ROLE_LABEL,
  ROLE_OPTIONS,
  SIGNUP_ROLE_OPTIONS,
} from "./types/constants";
export type { RoleType } from "./types/constants";
export type { SignupRequest, SignupResponse } from "./types/signup";

// Utils
export {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./utils/token";

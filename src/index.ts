// Pages
export { LoginPage } from "./pages/LoginPage";
export { SignupPage } from "./pages/SignupPage";

// Components
export { AppLayout, ChangePasswordModal } from "./components/AppLayout";
export type { SidebarItem } from "./components/AppLayout";
export { Avatar } from "./components/Avatar";
export { Button } from "./components/Button";
export { Drawer } from "./components/Drawer";
export type { DrawerProps } from "./components/Drawer";
export { Input } from "./components/Input";
export { LoginForm } from "./components/LoginForm";
export { Modal } from "./components/Modal";
export { Pagination } from "./components/Pagination";
export type { PaginationProps } from "./components/Pagination";
export { SearchBar } from "./components/SearchBar";
export { SearchInput } from "./components/SearchInput";
export { SearchSelect } from "./components/SearchSelect";
export { SignupForm } from "./components/SignupForm";
export { TableBlock } from "./components/TableBlock";
export type { TableBlockProps } from "./components/TableBlock";
export { theme, lightTheme, darkTheme } from "./styles/theme";
export type { Theme, ThemeColors } from "./styles/theme";

// Hooks
export { useApi } from "./hooks/useApi";
export { useAuth, useAppAccess } from "./hooks/useAuth";
export { useFixedPageSize, LAYOUT } from "./hooks/useFixedPageSize";
export type { UseFixedPageSizeOptions } from "./hooks/useFixedPageSize";
export { usePaginated } from "./hooks/usePaginated";
export type { UsePaginatedOptions, UsePaginatedResult } from "./hooks/usePaginated";
export { usePagedNav } from "./hooks/usePagedNav";
export type { UsePagedNavOptions, UsePagedNavResult } from "./hooks/usePagedNav";

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
  Status,
  STATUS_CODE,
  STATUS_LABEL,
  STATUS_OPTIONS,
  Team,
  TEAM_LABEL,
  TEAM_OPTIONS,
} from "./types/constants";
export type { RoleType, StatusType, TeamType } from "./types/constants";
export type { SignupRequest, SignupResponse } from "./types/signup";
export type { Page } from "./types/pagination";

// Utils
export {
  clearTokens,
  decodeToken,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./utils/token";
export { hasAppAccess } from "./utils/appPath";

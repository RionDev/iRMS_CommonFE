// Pages
export { LoginPage } from './pages/LoginPage';
export { SignupPage } from './pages/SignupPage';

// Components
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Modal } from './components/Modal';
export { Layout } from './components/Layout';
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { SideNav } from './components/SideNav';
export type { SideNavItem } from './components/SideNav';
export { theme } from './styles/theme';

// Hooks
export { useAuth, useRequireRole } from './hooks/useAuth';
export { useApi } from './hooks/useApi';

// Services
export { default as apiClient } from './services/apiClient';
export { login, refresh, logout } from './services/authService';
export { signup } from './services/signupService';

// Stores
export { useAuthStore } from './stores/authStore';

// Types
export type { User, VUser, TokenPair, AuthPayload, LoginRequest, LoginResponse } from './types/auth';
export type { SignupRequest, SignupResponse } from './types/signup';
export { Role, Team } from './types/constants';
export type { RoleType, TeamType } from './types/constants';

// Utils
export { getAccessToken, getRefreshToken, saveTokens, clearTokens, decodeToken } from './utils/token';

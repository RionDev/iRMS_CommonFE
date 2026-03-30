import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return { user, isAuthenticated, logout };
}

export function useRequireRole(...allowedRoles: number[]) {
  const { user } = useAuth();

  if (user && !allowedRoles.includes(user.role)) {
    throw new Error("권한이 없습니다");
  }

  return user;
}

import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return { user, isAuthenticated, logout };
}

export function useRequireRole(...allowedRoles: number[]) {
  const { user } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    const unauthorized = !!user && !allowedRoles.includes(user.role);
    if (!unauthorized || handledRef.current) return;

    handledRef.current = true;
    alert("권한이 없습니다.");

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    const basePath = "/" + window.location.pathname.split("/")[1];
    window.location.href = basePath || "/";
  }, [allowedRoles, user]);

  return user;
}

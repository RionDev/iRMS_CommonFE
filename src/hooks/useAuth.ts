import { useEffect, useRef } from "react";
import { useAppsStore } from "../stores/appsStore";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return { user, isAuthenticated, logout };
}

export function useAppAccess(appPath: string) {
  const { user } = useAuth();
  const { apps, loaded } = useAppsStore();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!user || !loaded || handledRef.current) return;

    const hasAccess = apps.some((a) => a.path === appPath);
    if (hasAccess) return;

    handledRef.current = true;
    alert("권한이 없습니다.");
    window.location.href = "/portal";
  }, [user, apps, loaded, appPath]);

  return user;
}

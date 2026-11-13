import { useEffect, useRef } from "react";
import { useAppsStore } from "../stores/appsStore";
import { useAuthStore } from "../stores/authStore";
import { hasAppAccess } from "../utils/appPath";

export function useAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();
  return { user, isAuthenticated, logout };
}

export function useAppAccess(appPath: string) {
  const { user } = useAuth();
  const { apps, loaded, failed } = useAppsStore();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!user || !loaded || handledRef.current) return;

    if (hasAppAccess(apps, appPath)) return;

    handledRef.current = true;
    if (failed) {
      // 서버·네트워크 문제로 앱 목록을 못 받은 것 — 권한 문제가 아니므로 포털로 보내지 않는다
      alert("앱 목록을 불러오지 못했습니다. 잠시 후 새로고침해 주세요.");
      return;
    }
    alert("권한이 없습니다.");
    window.location.href = "/portal";
  }, [user, apps, loaded, failed, appPath]);

  return user;
}

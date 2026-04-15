import type { AppInfo } from "../stores/appsStore";

/** 경로 끝 슬래시 제거. `/`는 그대로 둔다. */
function normalizePath(p: string): string {
  const s = p.trim();
  return s.length > 1 && s.endsWith("/") ? s.slice(0, -1) : s;
}

/**
 * 현재 사용자가 접근 가능한 앱 목록에 targetHref가 포함되는지 판정한다.
 * `/admin/`과 `/admin`을 동일 경로로 본다.
 */
export function hasAppAccess(
  accessibleApps: AppInfo[],
  targetHref: string,
): boolean {
  const target = normalizePath(targetHref);
  return accessibleApps.some((a) => normalizePath(a.path) === target);
}

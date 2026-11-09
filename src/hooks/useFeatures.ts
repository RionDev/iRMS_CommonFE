import { useCallback, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { useFeaturesStore } from "../stores/featuresStore";

const EMPTY: string[] = [];

/**
 * 앱 안의 기능 단위 권한 — 쓸 수 없는 기능의 버튼·메뉴를 숨기는 데 쓴다.
 *
 * 기능 키는 BE 서비스 코드가 정하고(예: sample 의 "search", "export_csv", "download"),
 * 관리자가 admin 앱 앱 상세에서 기능별 최소 등급·허용 팀을 바꾼다.
 * 불러오기 전(loaded=false)과 실패 시에는 can() 이 false — 기본 차단.
 *
 * ```tsx
 * const { can } = useFeatures("/sample");
 * {can("download") && <Button>다운로드</Button>}
 * ```
 */
export function useFeatures(appPath: string) {
  const user = useAuthStore((s) => s.user);
  const entry = useFeaturesStore((s) => s.byPath[appPath]);
  const fetchFeatures = useFeaturesStore((s) => s.fetchFeatures);

  useEffect(() => {
    if (user && !entry) fetchFeatures(appPath);
  }, [user, entry, appPath, fetchFeatures]);

  const keys = entry?.keys ?? EMPTY;
  const can = useCallback((key: string) => keys.includes(key), [keys]);

  return { can, loaded: entry?.loaded ?? false, features: keys };
}

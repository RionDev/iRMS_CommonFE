import axios from "axios";
import { useCallback, useState } from "react";

/**
 * API 호출 래퍼 훅.
 * - HTTP 에러 toast는 apiClient interceptor가 자동 처리한다.
 * - error state는 컴포넌트가 인라인으로 활용할 수 있도록 유지한다.
 */
export function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      // HTTP 에러는 apiClient interceptor가 alert 처리 — 로컬 state에 저장하지 않음
      if (!axios.isAxiosError(e) || !e.response) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류");
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  return { data, loading, error, execute };
}

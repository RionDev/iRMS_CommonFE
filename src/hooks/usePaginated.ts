import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "../types/pagination";

export interface UsePaginatedOptions<T> {
  /**
   * 페이지를 요청하는 함수. cursor가 undefined면 첫 페이지.
   */
  fetcher: (cursor: string | undefined, size: number) => Promise<Page<T>>;
  /**
   * 페이지당 항목 수. 기본 50.
   */
  size?: number;
  /**
   * 의존성 변경 시 자동으로 reset 후 첫 페이지 재요청. 검색/필터 state를 여기에 넣는다.
   */
  deps?: unknown[];
}

export interface UsePaginatedResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

/**
 * cursor 기반 페이지네이션 조회 훅.
 *
 * - 첫 로드/`reset()`/`deps` 변경 시 첫 페이지부터 요청한다.
 * - `loadMore()`는 `has_more`가 false면 아무것도 하지 않는다.
 * - 동일 페이지 중복 요청은 내부 flag로 무시한다.
 *
 * HTTP 에러는 apiClient interceptor가 alert으로 처리하므로 여기서는 error state만 채운다.
 */
export function usePaginated<T>({
  fetcher,
  size = 50,
  deps = [],
}: UsePaginatedOptions<T>): UsePaginatedResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const cursorRef = useRef<string | undefined>(undefined);
  const inFlightRef = useRef(false);
  // 최신 fetcher를 ref에 두어 loadMore identity를 안정화한다.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const loadPage = useCallback(
    async (cursor: string | undefined) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const page = await fetcherRef.current(cursor, size);
        setItems((prev) => (cursor === undefined ? page.items : [...prev, ...page.items]));
        cursorRef.current = page.next_cursor ?? undefined;
        setHasMore(page.has_more);
      } catch (e) {
        if (!axios.isAxiosError(e) || !e.response) {
          setError(e instanceof Error ? e.message : "알 수 없는 오류");
        }
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [size],
  );

  const reset = useCallback(() => {
    setItems([]);
    cursorRef.current = undefined;
    setHasMore(true);
    setError(null);
    void loadPage(undefined);
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    await loadPage(cursorRef.current);
  }, [hasMore, loadPage]);

  // deps 변경 / 최초 마운트 시 첫 페이지 요청
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset();
    // reset은 안정적이지만 deps가 바뀔 때마다 재호출되어야 하므로 의도적으로 deps만 감시
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loading, error, hasMore, loadMore, reset };
}

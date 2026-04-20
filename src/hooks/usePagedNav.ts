import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "../types/pagination";

export interface UsePagedNavOptions<T> {
  /**
   * 페이지를 요청하는 함수.
   * - cursor: undefined면 첫 페이지
   * - snapshotIdx: undefined면 BE가 새로 결정
   */
  fetcher: (
    cursor: string | undefined,
    snapshotIdx: number | undefined,
    size: number,
  ) => Promise<Page<T>>;
  /**
   * 페이지당 항목 수. 기본 50.
   */
  size?: number;
  /**
   * 의존성 변경 시 자동으로 reset 후 첫 페이지 재요청. 검색/필터 state를 여기에 넣는다.
   */
  deps?: unknown[];
}

export interface UsePagedNavResult<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  /** 현재 페이지 번호 (1-base) */
  page: number;
  /** 전체 페이지 수 — ceil(total / size) */
  totalPages: number;
  /** 전체 항목 수 */
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  reset: () => void;
}

/**
 * 이전/다음 + 페이지 번호 페이지네이션 조회 훅.
 *
 * cursor 기반 API에서 이전 이동을 지원하기 위해 cursor 히스토리 스택을 FE가 직접 관리한다.
 * - `history[i]` = 페이지 `i+1`을 요청할 때 사용한 cursor
 * - `next()` 시 응답의 `next_cursor`를 push
 * - `prev()` 시 pop 후 남은 top cursor로 재요청
 * - `snapshot_idx`는 첫 응답에서 받은 값을 세션 내내 echo
 *
 * HTTP 에러는 apiClient interceptor가 alert으로 처리하므로 여기서는 error state만 채운다.
 */
export function usePagedNav<T>({
  fetcher,
  size = 50,
  deps = [],
}: UsePagedNavOptions<T>): UsePagedNavResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  const historyRef = useRef<(string | undefined)[]>([undefined]);
  const nextCursorRef = useRef<string | null>(null);
  const snapshotIdxRef = useRef<number | undefined>(undefined);
  const inFlightRef = useRef(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetchPage = useCallback(
    async (cursor: string | undefined, newPage: number) => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const res = await fetcherRef.current(cursor, snapshotIdxRef.current, size);
        setItems(res.items);
        setTotal(res.total);
        setHasNext(res.has_more);
        nextCursorRef.current = res.next_cursor;
        snapshotIdxRef.current = res.snapshot_idx;
        setPage(newPage);
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
    historyRef.current = [undefined];
    nextCursorRef.current = null;
    snapshotIdxRef.current = undefined;
    setItems([]);
    setTotal(0);
    setHasNext(false);
    setError(null);
    void fetchPage(undefined, 1);
  }, [fetchPage]);

  const next = useCallback(async () => {
    if (!hasNext || nextCursorRef.current === null) return;
    const cursor = nextCursorRef.current;
    historyRef.current.push(cursor);
    await fetchPage(cursor, historyRef.current.length);
  }, [hasNext, fetchPage]);

  const prev = useCallback(async () => {
    if (historyRef.current.length <= 1) return;
    historyRef.current.pop();
    const cursor = historyRef.current[historyRef.current.length - 1];
    await fetchPage(cursor, historyRef.current.length);
  }, [fetchPage]);

  // deps 변경 / size 변경 / 최초 마운트 시 첫 페이지 요청.
  // size는 항상 감지 대상에 포함되어, consumer가 deps에 size를 누락해도 자동으로 리셋된다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, size]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / size);
  const hasPrev = page > 1;

  return {
    items,
    loading,
    error,
    page,
    totalPages,
    total,
    hasPrev,
    hasNext,
    next,
    prev,
    reset,
  };
}

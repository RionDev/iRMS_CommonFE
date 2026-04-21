import { useState } from "react";

export interface UseFixedPageSizeOptions {
  /**
   * 테이블 바디 외 모든 고정 수직 영역 합(px).
   *
   * 일반적으로: header + footer + main padding + searchbar + searchbar margin +
   * tableblock padding + thead + pagination. `LAYOUT` 상수들을 조합해 페이지마다 정의한다.
   */
  overhead: number;
  /** 행의 고정 높이(px). UserTable 등에서 `height: ${rowHeight}px` 와 일치시켜야 한다. */
  rowHeight: number;
  /** 최소 페이지 크기. 기본 5. */
  minSize?: number;
  /**
   * 테이블 바디에 보장되는 최소 가용 높이(px).
   *
   * 사이드에 대시보드처럼 min-content 가 큰 컬럼이 있어서 `alignItems:stretch` 로
   * 테이블 컬럼도 같이 stretch 되는 경우에 사용. 뷰포트 기반 계산이 이 값보다
   * 작으면 이 값을 사용해 더 많은 row 를 렌더한다.
   *
   * 계산법: `사이드 컬럼 min-content 높이 - 테이블 컬럼 내부 overhead`
   * (= searchbar + margin + tableblock padding + thead + pagination)
   */
  minAvailable?: number;
}

/**
 * 레이아웃 고정 높이 상수. DOM 측정 없이 `useFixedPageSize` 의 `overhead` 를 계산하는 데 쓴다.
 *
 * 이 값들이 CSS 에 실제 반영된 고정 높이와 반드시 일치해야 한다:
 *  - `HEADER_H`: AppLayout header `<header height: 64>`
 *  - `FOOTER_H`: AppLayout footer `<footer height: 48>`
 *  - `MAIN_PAD_Y`: AppLayout main 상하 padding 합 (24*2)
 *  - `SEARCHBAR_H`: SearchBar 컴포넌트 고정 높이
 *  - `SEARCHBAR_MARGIN`: SearchBar margin-bottom
 *  - `PAGINATION_H`: Pagination 컴포넌트 고정 높이
 */
export const LAYOUT = {
  HEADER_H: 64,
  FOOTER_H: 48,
  MAIN_PAD_Y: 48,
  SEARCHBAR_H: 72,
  SEARCHBAR_MARGIN: 16,
  PAGINATION_H: 48,
} as const;

/**
 * 창 높이와 고정 overhead 로 한 페이지에 표시할 행 수를 **한 번만** 계산한다.
 *
 * DOM 측정이나 ResizeObserver 를 쓰지 않으므로 폰트 로드 / HMR / cold start
 * 에 무관하게 항상 동일한 결과를 낸다. 마운트 후 창을 리사이즈해도
 * 값이 바뀌지 않아 `usePagedNav` 의 리셋이 일어나지 않는다.
 */
export function useFixedPageSize({
  overhead,
  rowHeight,
  minSize = 5,
  minAvailable = 0,
}: UseFixedPageSizeOptions): number {
  const [size] = useState(() => {
    if (typeof window === "undefined") return minSize;
    const fromViewport = window.innerHeight - overhead;
    const available = Math.max(fromViewport, minAvailable);
    return Math.max(minSize, Math.floor(available / rowHeight));
  });
  return size;
}

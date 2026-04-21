import { type RefObject, useEffect, useState } from "react";

interface UseDynamicPageSizeOptions {
  /** 행 높이의 fallback 추정값(px). 실제 tbody 첫 행을 측정하지 못했을 때만 쓴다. */
  rowHeight: number;
  /**
   * 테이블 바디 외 영역이 차지하는 예상 높이(px) — thead, pagination, padding 합계.
   * 컨테이너 안의 `[data-row-reserved]` 요소들을 측정해 덮어쓸 수도 있다.
   */
  reservedHeight: number;
  /** 최소 페이지 크기. 기본 5. */
  minSize?: number;
  /** 측정 전 초기 페이지 크기. 기본 20. */
  initialSize?: number;
}

/**
 * 컨테이너 높이에 맞춰 한 페이지에 표시할 행 수를 계산한다.
 *
 * 초기 마운트 / tbody 첫 데이터 도착 / 웹 폰트 로드 / 컨테이너 리사이즈 직후
 * 여러 시점에 재측정을 시도한다. 단, 사용자가 페이지 이동 / 검색을 시작한
 * 뒤(= 일정 안정화 시간 이후)에는 관찰을 중단해 리사이즈로 인한
 * `usePagedNav` 리셋이 일어나지 않도록 한다.
 */
export function useDynamicPageSize(
  containerRef: RefObject<HTMLElement | null>,
  {
    rowHeight,
    reservedHeight,
    minSize = 5,
    initialSize = 20,
  }: UseDynamicPageSizeOptions,
): number {
  const [size, setSize] = useState(initialSize);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const cleanups: Array<() => void> = [];

    const compute = () => {
      const style = window.getComputedStyle(el);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      const thead = el.querySelector("thead");
      const theadH = thead?.getBoundingClientRect().height ?? 0;

      const firstRow = el.querySelector("tbody tr");
      const measuredRowH = firstRow?.getBoundingClientRect().height ?? 0;
      const effectiveRowH = measuredRowH > 0 ? measuredRowH : rowHeight;

      // pagination (또는 컨테이너 하단 고정 영역) — 테이블 뒤쪽 형제 합산.
      // <p> 태그는 로딩/빈 상태 표시용 transient 요소라 제외한다 (데이터 로드 후 사라지므로
      // 마운트 시점에 포함해서 재면 reserved 가 과대평가되어 pageSize 가 적게 나옴).
      const tableEl = el.querySelector("table");
      let trailingH = 0;
      if (tableEl) {
        let sib = tableEl.nextElementSibling as HTMLElement | null;
        while (sib) {
          if (sib.tagName !== "P") {
            trailingH += sib.getBoundingClientRect().height;
          }
          sib = sib.nextElementSibling as HTMLElement | null;
        }
      }

      const measuredReserved = paddingY + theadH + trailingH;
      const effectiveReserved =
        measuredReserved > 0 ? measuredReserved : reservedHeight;

      const available = el.clientHeight - effectiveReserved;
      // 측정 오차 누적 방지용 안전 여유 2행.
      //  - Pagination 이 total=0 일 때 null 을 렌더하므로 초기 measure 시점에
      //    trailingH 가 과소 측정되는 케이스 대비
      //  - row/thead/padding/line-height 의 소수점 오차로 마지막 행이 넘쳐
      //    pagination 이 overflow:hidden 에 클리핑되는 문제 방지
      const capacity = Math.floor(available / effectiveRowH) - 2;
      const next = Math.max(minSize, capacity);
      setSize((prev) => (prev === next ? prev : next));
    };

    // 1. 즉시 1회 측정 (초기 fallback 값으로 빠른 size 확정 → 첫 fetch 시작)
    compute();

    // 2. 다음 애니메이션 프레임에 재측정 (브라우저가 초기 레이아웃을 확정한 후)
    const rafId = requestAnimationFrame(() => compute());
    cleanups.push(() => cancelAnimationFrame(rafId));

    // 3. 웹 폰트가 로드되면 row 높이가 변하므로 재측정
    //    (Noto Sans KR 같은 CJK 폰트는 로드 전/후 metrics 차이가 커서 이걸 빼먹으면
    //    fallback 폰트 기준으로 계산된 pageSize 가 1~2 행 과다로 남는다)
    if (typeof document !== "undefined" && document.fonts?.ready) {
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (!cancelled) compute();
      });
      cleanups.push(() => {
        cancelled = true;
      });
    }

    // 4. tbody 가 비어있을 때 첫 행이 들어오면 실제 row 높이로 재측정
    const tbody = el.querySelector("tbody");
    if (tbody && !el.querySelector("tbody tr")) {
      const mo = new MutationObserver(() => {
        if (el.querySelector("tbody tr")) {
          compute();
          mo.disconnect();
        }
      });
      mo.observe(tbody, { childList: true });
      cleanups.push(() => mo.disconnect());
    }

    // 5. 초기 안정화 구간(2초) 동안만 컨테이너 리사이즈 재측정.
    //    이후에는 해제해서 사용자 상호작용 중 리사이즈 이벤트로 인한
    //    pagination 리셋이 일어나지 않게 한다.
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => compute());
      ro.observe(el);
      const roTimer = setTimeout(() => ro.disconnect(), 2000);
      cleanups.push(() => {
        clearTimeout(roTimer);
        ro.disconnect();
      });
    }

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [containerRef, rowHeight, reservedHeight, minSize]);

  return size;
}

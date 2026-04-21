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
 * 마운트 시 1회만 측정한다. 윈도우 리사이즈를 감지해 재계산하면
 * `usePagedNav` 의 `size` dep 가 바뀌어 리스트/검색/페이지가 리셋되기 때문에
 * 의도적으로 관찰을 생략했다. 리사이즈 시 약간의 빈 공간 / 클리핑이 생길 수 있지만
 * 사용자 입장에서 상태가 유지되는 편이 낫다.
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

    compute();

    // tbody가 비어있으면 fallback rowHeight 가 쓰여 부정확할 수 있다.
    // 데이터가 도착해 첫 행이 생기면 한 번 더 재측정한다 (리사이즈 감지 아니므로 이후 리셋 없음).
    if (!el.querySelector("tbody tr")) {
      const tbody = el.querySelector("tbody");
      if (tbody) {
        const mo = new MutationObserver(() => {
          if (el.querySelector("tbody tr")) {
            compute();
            mo.disconnect();
          }
        });
        mo.observe(tbody, { childList: true });
        return () => mo.disconnect();
      }
    }
  }, [containerRef, rowHeight, reservedHeight, minSize]);

  return size;
}

/**
 * 리스트형 조회 API 응답 공통 타입.
 * BE `common.src.pagination.Page` 와 매칭된다.
 *
 * 규약 상세: common/docs/pagination.md
 */
export interface Page<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
  total: number;
  snapshot_idx: number;
}

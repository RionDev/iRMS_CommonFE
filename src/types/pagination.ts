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
  /** 스냅샷 기준 매칭 건수. total_capped 면 집계 상한값 */
  total: number;
  /** 매칭 건수가 집계 상한을 넘어 total 이 잘렸는지 (대용량 테이블만, 기본 false) */
  total_capped?: boolean;
  snapshot_idx: number;
}

# 페이지네이션

iRMS의 모든 **리스트형 조회 API**는 cursor 기반 페이지네이션을 사용한다. offset/page 방식은 사용하지 않는다.

## 왜 cursor인가

- 샘플 도메인은 수천만~1억 건 규모이며, offset 방식은 깊은 페이지에서 DB가 스킵 스캔을 해 성능이 무너진다.
- 스케일 차이에 상관없이 모든 리스트 API를 동일한 규약으로 맞춰 공통 훅/컴포넌트를 하나로 유지한다.
- 임의 페이지 점프 UX(5페이지로 바로 가기)는 지원하지 않는다. 이전/다음 + 페이지 번호 표시까지만.

## 요청 스펙

```text
GET /api/{service}/{resource}?cursor=<opaque>&snapshot_idx=<int>&size=50&<필터...>
```

| 파라미터       | 타입    | 필수 | 설명                                                                |
| -------------- | ------- | ---- | ------------------------------------------------------------------- |
| `cursor`       | string  | N    | 이전 응답의 `next_cursor` 값. 첫 페이지 요청 시 생략                |
| `snapshot_idx` | integer | N    | 이전 응답의 `snapshot_idx` 값. 첫 페이지 요청 시 생략 (BE가 결정)   |
| `size`         | integer | N    | 페이지당 항목 수. 기본 50, 상한 100. 화면별로 다르게 지정 가능      |
| 기타           | —       | —    | 검색/필터 조건은 매 요청에 동일하게 포함                            |

- `cursor` / `snapshot_idx`는 **opaque 값**이다. FE는 해석하지 말고 다음 요청에 그대로 전달한다.
- 필터가 변경되면 `cursor`와 `snapshot_idx` 모두 버리고 첫 페이지부터 다시 요청해야 한다.

## 응답 스펙

```json
{
  "items": [...],
  "next_cursor": "eyJpZHgiOjEyM30",
  "has_more": true,
  "total": 1234,
  "snapshot_idx": 9876543
}
```

| 필드           | 타입              | 설명                                                            |
| -------------- | ----------------- | --------------------------------------------------------------- |
| `items`        | array             | 이번 페이지 항목들                                              |
| `next_cursor`  | string \| null    | 다음 페이지 요청 시 전달할 cursor. 끝이면 `null`                |
| `has_more`     | boolean           | 다음 페이지 존재 여부                                           |
| `total`        | integer           | 스냅샷 기준 전체 매칭 건수. 항상 숫자 (null 없음)               |
| `snapshot_idx` | integer           | 이번 요청의 스냅샷 상한 idx. 이후 요청에 echo                   |

- `next_cursor === null` 또는 `has_more === false`이면 끝이다.
- 빈 결과는 `{ items: [], next_cursor: null, has_more: false, total: 0, snapshot_idx: N }` 로 반환된다.
- `total`은 BE가 COUNT 쿼리를 끝까지 실행한 결과라 항상 숫자다. FE는 `total / size`로 전체 페이지 수를 계산할 수 있다.

## snapshot_idx — 페이지 간 일관성

샘플류 append-only 테이블은 페이지를 넘기는 동안에도 신규 row가 계속 유입된다. `snapshot_idx`는 첫 요청 시점의 "상한 idx"를 고정해 두는 역할이다. BE는 모든 쿼리에 `WHERE idx <= snapshot_idx` 조건을 적용하므로 `total`과 `items`가 같은 스냅샷을 본다.

- 첫 요청: `cursor`, `snapshot_idx` 모두 없이 보냄 → BE가 snapshot_idx를 잡아서 응답에 포함
- 이후 요청: FE가 `cursor`, `snapshot_idx`를 함께 echo
- 필터 변경 / "새로고침": 모두 버리고 첫 페이지 재요청

## 서비스 함수 패턴

```ts
// src/services/sampleService.ts
import apiClient from "@common/services/apiClient";
import type { Page, Sample, SampleQuery } from "../types/sample";

export async function getSamples(
  query: SampleQuery,
  cursor?: string,
  snapshotIdx?: number,
  size: number = 50,
): Promise<Page<Sample>> {
  const res = await apiClient.get<Page<Sample>>("/api/sample/samples", {
    params: { ...query, cursor, snapshot_idx: snapshotIdx, size },
  });
  return res.data;
}
```

공통 Page 타입은 `@common/types`에 둔다.

```ts
export interface Page<T> {
  items: T[];
  next_cursor: string | null;
  has_more: boolean;
  total: number;
  snapshot_idx: number;
}
```

## 공통 훅

두 가지 패턴을 공존시킨다.

### `usePagedNav` — 이전/다음 + 페이지 번호 UI (권장)

```ts
const {
  items, loading, error,
  page, totalPages, total,
  hasPrev, hasNext,
  next, prev, reset,
} = usePagedNav({
  fetcher: (cursor, snapshotIdx, size) => getSamples(query, cursor, snapshotIdx, size),
  size: 50,
  deps: [query],  // 필터 변경 시 자동 reset. size는 훅이 자동 감지하므로 포함 불필요.
});
```

| 반환값       | 설명                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `items`      | 현재 페이지 항목 (누적 아님, 페이지마다 교체)                               |
| `loading`    | 요청 진행 중                                                                |
| `error`      | 에러                                                                        |
| `page`       | 현재 페이지 번호 (1-base)                                                   |
| `totalPages` | 전체 페이지 수 = `ceil(total / size)`                                       |
| `total`      | 전체 항목 수                                                                |
| `hasPrev`    | 이전 페이지 존재 여부 (페이지 ≥ 2일 때 true)                                |
| `hasNext`    | 다음 페이지 존재 여부 (응답의 `has_more`)                                   |
| `next`       | 다음 페이지 요청                                                            |
| `prev`       | 이전 페이지로 이동 (FE가 기억한 cursor 히스토리 사용)                       |
| `reset`      | 상태 초기화 후 첫 페이지 재요청                                             |

내부 동작:

- cursor 히스토리 스택을 FE가 직접 관리 (BE는 prev_cursor 제공 안 함)
- `next()`는 응답의 `next_cursor`를 스택에 push
- `prev()`는 스택에서 pop 후 이전 cursor로 재요청
- `snapshot_idx`는 첫 응답에서 받은 값을 세션 내내 유지
- `size` 변경 시 자동으로 1페이지 리셋 (히스토리 초기화 후 재요청)

### `usePaginated` — 누적형 (무한 스크롤 / "더보기")

```ts
const { items, loading, error, hasMore, loadMore, reset } = usePaginated({
  fetcher: (cursor, size) => getSamples(query, cursor, size),
  size: 50,
  deps: [query],
});
```

기존 훅 유지. 대용량 로그/메트릭 타임라인처럼 "계속 쌓아 보기"가 자연스러운 화면에 쓴다.

## UI 패턴

- **페이지 번호 네비게이션** — 기본. `< 이전 | 3 / 25 | 다음 >` 형태. `usePagedNav` 사용.
- **무한 스크롤** — IntersectionObserver로 하단 감지 시 `loadMore` 호출. `usePaginated` 사용.
- 페이지당 건수(`size`)는 화면별로 결정한다. 기본 50, 간단한 목록은 20, 밀도 높은 화면은 100 등. 드롭다운으로 사용자 변경 지원 가능.

## 페이지당 건수 가이드

| 도메인 규모   | 권장 size | 비고                                   |
| ------------- | --------- | -------------------------------------- |
| 수백 건 이하  | 20~50     | 회원/앱/서버 등. 스크롤 부담 낮게      |
| 수천~수만 건  | 50        | 기본값                                 |
| 수백만~1억 건 | 50~100    | 검색/필터 필수. size 100 정도까지 허용 |

## FE 체크리스트

- [ ] 서비스 함수 시그니처: `(query, cursor?, snapshotIdx?, size?) => Promise<Page<T>>`
- [ ] 페이지 컴포넌트에서 `usePagedNav` 사용 (누적 필요 시 `usePaginated`)
- [ ] 검색/필터 state는 훅의 `deps`에 포함 — 필터 변경 시 자동 reset
- [ ] `cursor` / `snapshot_idx`는 opaque로 취급. 파싱/조작 금지
- [ ] 첫 페이지 요청 시 `cursor`, `snapshot_idx` 파라미터 생략 (빈 값 금지)

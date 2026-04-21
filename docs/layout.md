# 레이아웃 영역 및 중앙 메시지 정책

모든 앱은 `AppLayout` 으로 감싸지며 다음 4개 영역으로 구성된다.

## 영역 정의

```text
┌────────┬──────────────────────────────────┐
│        │ Header (64px, 고정)              │
│  Side  ├──────────────────────────────────┤
│  Nav   │                                  │
│        │  Main (= "앱 영역")              │
│        │  - flex: 1 (가변 높이)           │
│        │  - padding: 24px                 │
│        │  - overflow: auto                │
│        │                                  │
│        ├──────────────────────────────────┤
│        │ Footer (48px, 고정)              │
└────────┴──────────────────────────────────┘
```

| 영역 | 구현 요소 | 비고 |
| --- | --- | --- |
| Side Nav | `AppLayout` 내부 sidebar | 고정 폭 (220px). `LAYOUT.SIDEBAR_W` 추후 필요 시 상수화. |
| Header | `AppLayout` 내부 `<header>` | 고정 높이 64px. `LAYOUT.HEADER_H`. |
| **앱 영역** | `AppLayout` 내부 `<main>` | **가변 영역**. 각 페이지의 모든 콘텐츠(검색창, 테이블, 대시보드 등)가 이 안에 들어간다. |
| Footer | `AppLayout` 내부 `<footer>` | 고정 높이 48px. `LAYOUT.FOOTER_H`. |

"앱 영역" = `<main>` — 사이드 네비 / 헤더 / 푸터를 제외한 영역이며, 이 프로젝트 공통 용어로 쓴다.

## 중앙 메시지 정책

짧은 안내 텍스트(로딩 / 빈 상태 / 준비중 등)는 **중앙 정렬**이 기본이다. 어느 영역의 중앙인지는 메시지의 성격에 따라 고른다.

### 1. 테이블 중앙 — `<TableEmptyState>`

**테이블과 직접 연관된 메시지**는 `TableBlock` 바디(thead 와 pagination 사이) 정중앙에 표시한다.

- 로딩 중... / 계정이 없습니다 / 검색 결과가 없습니다

```tsx
<TableBlock>
  <UserTable users={items} onSelect={setSelected} />
  {loading && <TableEmptyState>로딩 중...</TableEmptyState>}
  {!loading && items.length === 0 && (
    <TableEmptyState>계정이 없습니다.</TableEmptyState>
  )}
  <div style={{ marginTop: "auto" }}>
    <Pagination ... />
  </div>
</TableBlock>
```

### 2. 앱 영역 중앙 — `<AppCenterMessage>`

**페이지 전체가 placeholder** 이거나 콘텐츠가 아예 없을 때는 앱 영역 전체 중앙에 메시지를 표시한다.

- 아직 서비스 하지 않습니다 / 준비 중인 화면입니다 / 권한이 없습니다

```tsx
<AppLayout appName="통계" sidebarItems={[]}>
  <AppCenterMessage>아직 서비스 하지 않습니다.</AppCenterMessage>
</AppLayout>
```

### 판단 기준

- 화면에 테이블이 존재하고 그 테이블의 상태(데이터 없음 / 로딩)에 대한 메시지 → **`TableEmptyState`**
- 페이지 전체가 비어 있거나 아직 구현되지 않은 placeholder → **`AppCenterMessage`**
- 테이블 바깥(예: 페이지 우측 대시보드 카드 안) 의 빈 상태 → 일반적으로 `<div>` 로 직접 구현. 필요해지면 별도 컴포넌트 도입.

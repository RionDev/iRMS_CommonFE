# 테마 팔레트 / 디자인 가이드

iRMS FE 전 앱이 공유하는 색상/스타일 규칙. 새 UI를 만들거나 기존 UI를 수정할 때 이 문서의 토큰을 사용한다.

- **소스 오브 트루스**: `common/src/styles/theme.ts` (라이트/다크 테마 객체)
- **구독 방식**: 컴포넌트는 `useThemeStore().theme`로 테마 구독 (다크모드 전환 자동 반영)
- **금지**: 앱 코드에 hex 색상 리터럴 직접 작성 금지 — `theme.colors.*` 토큰 사용

## 전반 원칙

- 톤: **clean B2B SaaS admin UI** — slate 중립 + blue primary
- 사이드바는 어두운 네이비(slate-900), 메인 콘텐츠는 밝고 여백 있게
- hover/selected 상태에 blue 계열 soft 강조
- 과도한 채도는 primary action에만 허용
- 데이터 테이블 가독성 우선 (헤더와 본문 명확히 구분)

## 라이트 테마 팔레트

### 라이트 색상 토큰 (Tailwind 매핑)

| 역할                | Tailwind           | Hex       | theme 토큰 (theme.colors.*)           |
| ------------------- | ------------------ | --------- | ------------------------------------- |
| App Background      | `bg-slate-50`      | `#f8fafc` | `pageBackground`                      |
| Surface             | `bg-white`         | `#ffffff` | `surface`                             |
| Surface Secondary   | `bg-slate-100`     | `#f1f5f9` | `surfaceMuted` — 테이블 헤더/보조카드 |
| Border Default      | `border-slate-200` | `#e2e8f0` | `border`                              |
| Border Strong       | `border-slate-300` | `#cbd5e1` | `borderStrong`                        |
| Text Primary        | `text-slate-900`   | `#0f172a` | `text`                                |
| Text Muted          | `text-slate-400`   | `#94a3b8` | `textMuted`                           |
| Primary             | `bg-blue-600`      | `#2563eb` | `primary`                             |
| Primary Hover       | `bg-blue-700`      | `#1d4ed8` | `primaryHover`                        |
| Primary Text        | `text-white`       | `#ffffff` | `primaryText`                         |
| Success             | `bg-emerald-600`   | `#059669` | `success`                             |
| Warning             | `bg-amber-500`     | `#f59e0b` | `warning`                             |
| Danger              | `bg-red-600`       | `#dc2626` | `danger`                              |
| Sidebar Background  | `bg-slate-900`     | `#0f172a` | `sidebarBackground`                   |
| Sidebar Text        | `text-slate-200`   | `#e2e8f0` | `sidebarText`                         |
| Sidebar Muted       | `text-slate-400`   | `#94a3b8` | `sidebarTextMuted`                    |
| Sidebar Hover       | `bg-slate-800`     | `#1e293b` | `sidebarHover`                        |
| Sidebar Active      | `bg-blue-600`      | `#2563eb` | `sidebarActive`                       |
| Sidebar Active Text | `text-white`       | `#ffffff` | `sidebarActiveText`                   |

### 디자인 토큰이 아직 없는 값 (필요 시 컴포넌트 내부에서 참조)

아래 값들은 현재 `ThemeColors`에 토큰이 없다. 사용 빈도가 높아지면 토큰화한다.

| 역할            | Tailwind           | Hex       | 용도                          |
| --------------- | ------------------ | --------- | ----------------------------- |
| Primary Soft    | `bg-blue-50`       | `#eff6ff` | 테이블 row hover, 선택 강조   |
| Primary Border  | `border-blue-200`  | `#bfdbfe` | primary 연관 카드 테두리      |
| Primary Tint    | `text-blue-700`    | `#1d4ed8` | primary 계열 본문 강조 텍스트 |
| Accent          | `bg-indigo-600`    | `#4f46e5` | 보조 accent                   |
| Accent Hover    | `bg-indigo-700`    | `#4338ca` | 보조 accent hover             |
| Focus Ring      | `ring-blue-500`    | `#3b82f6` | 입력 포커스 링                |
| Info            | `bg-sky-500`       | `#0ea5e9` | 정보성 알림                   |
| Text Secondary  | `text-slate-700`   | `#334155` | 본문 보조 텍스트              |

## 컴포넌트 가이드라인

- **페이지 배경**: `theme.colors.pageBackground`
- **카드/패널**: `theme.colors.surface` + `border: 1px solid theme.colors.border` + `theme.shadow.card`
- **입력 필드**: `theme.colors.surface` 배경, `theme.colors.borderStrong` 테두리, 포커스 시 blue-500 링 (값 `#3b82f6`, 폭 2px)
- **Primary 버튼**: `theme.colors.primary` + hover `theme.colors.primaryHover` + `theme.colors.primaryText`
- **Secondary 버튼**: `theme.colors.surface` + `theme.colors.borderStrong` + `theme.colors.text`, hover 시 `theme.colors.surfaceMuted`
- **테이블 헤더**: `theme.colors.surfaceMuted` 배경 + `theme.colors.text` (slate-700 가이드지만 현재 토큰 없음 → text로 대체)
- **테이블 row**: `theme.colors.surface` 기본, hover `#eff6ff` (blue-50; 토큰 추가 전까지 리터럴)
- **활성 네비/탭**: `theme.colors.primary` 배경 + `theme.colors.primaryText`
- **사이드바**: `sidebarBackground`, hover `sidebarHover`, active `sidebarActive`
- **카드 그림자**: `theme.shadow.card` (Tailwind shadow-sm 수준 — 강한 그림자 사용 금지)

## 금지 사항

- hex/rgb 리터럴을 컴포넌트에 직접 쓰지 않는다(토큰 경유). 예외는 위 "토큰이 없는 값" 한정.
- 라이트 테마 팔레트 외 색상(특히 saturated 빨강/초록/노랑)은 Success/Warning/Danger 이외 용도로 쓰지 않는다.
- 사이드바와 메인 콘텐츠 대비가 뚜렷해야 한다(사이드바를 밝게 만들지 않는다).

## 다크 테마

톤: **modern B2B SaaS admin dark** — layered slate surfaces(완전 black 지양) + blue primary.
앱 셸과 콘텐츠/카드/사이드바를 서로 다른 slate 단계로 분리해 시각적 레이어를 만든다.

### 다크 색상 토큰 (Tailwind 매핑)

| 역할                | Tailwind           | Hex       | theme 토큰 (theme.colors.*) |
| ------------------- | ------------------ | --------- | --------------------------- |
| App Background      | `bg-slate-950`     | `#020617` | `pageBackground`            |
| Surface             | `bg-slate-900`     | `#0f172a` | `surface`                   |
| Surface Elevated    | `bg-slate-800`     | `#1e293b` | `surfaceMuted`              |
| Border Default      | `border-slate-800` | `#1e293b` | `border`                    |
| Border Strong       | `border-slate-700` | `#334155` | `borderStrong`              |
| Text Primary        | `text-slate-50`    | `#f8fafc` | `text`                      |
| Text Muted          | `text-slate-400`   | `#94a3b8` | `textMuted`                 |
| Primary             | `bg-blue-600`      | `#2563eb` | `primary`                   |
| Primary Hover       | `bg-blue-500`      | `#3b82f6` | `primaryHover`              |
| Primary Text        | `text-white`       | `#ffffff` | `primaryText`               |
| Success             | `bg-emerald-600`   | `#059669` | `success`                   |
| Warning             | `bg-amber-500`     | `#f59e0b` | `warning`                   |
| Danger              | `bg-red-600`       | `#dc2626` | `danger`                    |
| Sidebar Background  | `bg-slate-950`     | `#020617` | `sidebarBackground`         |
| Sidebar Text        | `text-slate-200`   | `#e2e8f0` | `sidebarText`               |
| Sidebar Muted       | `text-slate-500`   | `#64748b` | `sidebarTextMuted`          |
| Sidebar Hover       | `bg-slate-800`     | `#1e293b` | `sidebarHover`              |
| Sidebar Active      | `bg-blue-600`      | `#2563eb` | `sidebarActive`             |
| Sidebar Active Text | `text-white`       | `#ffffff` | `sidebarActiveText`         |

메모: `surface`는 카드/콘텐츠 기본 면. `surfaceMuted`는 드롭다운/테이블 hover 같은 elevated 표면. 다크 `primaryHover`는 라이트와 반대로 **밝아지는 방향**(blue-500).

### 다크에서 자주 참조하는 값 (토큰 미존재)

| 역할              | Tailwind                | Hex       | 용도                               |
| ----------------- | ----------------------- | --------- | ---------------------------------- |
| Primary Soft      | `bg-blue-950`           | `#172554` | 테이블 row 선택, primary 연관 강조 |
| Primary Border    | `border-blue-800`       | `#1e40af` | primary 연관 카드 테두리           |
| Primary Text/Link | `text-blue-300`         | `#93c5fd` | 링크/강조 텍스트                   |
| Primary Active    | `bg-blue-700`           | `#1d4ed8` | 버튼 active 상태                   |
| Accent            | `bg-indigo-600`         | `#4f46e5` | 보조 accent                        |
| Accent Hover      | `bg-indigo-500`         | `#6366f1` | 보조 accent hover                  |
| Focus Ring        | `ring-blue-500`         | `#3b82f6` | 입력 포커스 링                     |
| Text Secondary    | `text-slate-300`        | `#cbd5e1` | 본문 보조 텍스트                   |
| Text Disabled     | `text-slate-500`        | `#64748b` | 비활성 텍스트                      |
| Input Placeholder | `placeholder-slate-500` | `#64748b` | 입력 placeholder                   |
| Info              | `bg-sky-500`            | `#0ea5e9` | 정보성 알림                        |

### 다크 전용 컴포넌트 가이드라인

- **앱 셸(최외곽)**: `pageBackground` (`#020617`)
- **메인 콘텐츠/카드**: `surface` (`#0f172a`) + `border` (`#1e293b`) + `theme.shadow.card` (거의 안 보임)
- **Elevated 표면(드롭다운, 모달, 테이블 hover)**: `surfaceMuted` (`#1e293b`)
- **입력**: `surface` 배경, `borderStrong` (`#334155`) 테두리, placeholder `#64748b`, focus blue-500 ring
- **Primary 버튼**: `primary` → hover `primaryHover`(blue-500, 밝아짐) → active `#1d4ed8`(blue-700)
- **Secondary 버튼**: `surfaceMuted` + `borderStrong` + `text`, hover `#334155`(slate-700)
- **테이블**: header `surface`(`#0f172a`) + text `#cbd5e1`, row `surface`, row hover `surfaceMuted`, row 선택 `#172554`(blue-950)
- **사이드바**: `sidebarBackground`(slate-950) — 메인 콘텐츠(slate-900)보다 더 어두워서 레이어 분리
- **링크/강조**: `#93c5fd`(blue-300)
- **금지**: 순수 `#000000` 사용, 라이트↔다크 공통 hex 리터럴(양쪽 모두 theme token으로)

# @irms/common — 모듈 상세

공통 모듈의 export 목록과 규칙. 앱 구현 시 이 파일을 먼저 확인한다.

## Export 목록 (`src/index.ts`)

### Pages

| export       | 파일                   | 역할                                                        |
| ------------ | ---------------------- | ----------------------------------------------------------- |
| `LoginPage`  | `pages/LoginPage.tsx`  | 로그인 폼 렌더링, 인증 처리, 로그인 후 원래 경로로 redirect |
| `SignupPage` | `pages/SignupPage.tsx` | 회원가입 폼 렌더링, 가입 처리                               |

### Components

| export          | 파일                          | Props / 설명                                                                          |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------- |
| `AppLayout`     | `components/AppLayout.tsx`    | 사이드바 + 헤더 + 메인 + 푸터 통합 레이아웃 (앱 공통 템플릿)                          |
| `Avatar`        | `components/Avatar.tsx`       | 이름 기반 이니셜 원형 아바타 (해시 색상)                                              |
| `Button`        | `components/Button.tsx`       | `variant?: 'primary'\|'secondary'` + 기본 button 속성                                 |
| `Input`         | `components/Input.tsx`        | `label?: string`, `error?: string` + 기본 input 속성                                  |
| `Modal`         | `components/Modal.tsx`        | `isOpen`, `onClose`, `title`, `children`                                              |
| `Pagination`    | `components/Pagination.tsx`   | 이전/다음 + 페이지 번호 네비게이션. `usePagedNav` 반환값 연결용                       |
| `SearchBar`     | `components/SearchBar.tsx`    | 검색 블록(카드+form+검색/초기화 버튼). `onSearch`, `onReset?`, children으로 필터 필드 |
| `SearchSelect`  | `components/SearchSelect.tsx` | 검색 블록용 compact `<select>` 스타일 래퍼                                            |
| `SearchInput`   | `components/SearchInput.tsx`  | 검색 블록용 compact `<input>` 스타일 래퍼                                             |
| `LoginForm`     | `components/LoginForm.tsx`    | `onSubmit`, `loading?`, `error?` — LoginPage 내부용                                   |
| `SignupForm`    | `components/SignupForm.tsx`   | `onSubmit`, `loading?`, `error?` — SignupPage 내부용                                  |
| `lightTheme`    | `styles/theme.ts`             | Light 테마 객체                                                                       |
| `darkTheme`     | `styles/theme.ts`             | Dark 테마 객체                                                                        |
| `theme`         | `styles/theme.ts`             | `lightTheme` alias (정적; 런타임 다크모드 반영 안 됨)                                 |

### Hooks

| export         | 파일                    | 반환값                                                                                             |
| -------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `useAuth`      | `hooks/useAuth.ts`      | `{ user, isAuthenticated, logout }` — 미인증 시 `/login`으로 redirect                              |
| `useAppAccess` | `hooks/useAuth.ts`      | `user` — `appsStore`에서 앱 경로 접근 권한 확인, 미허용 시 포털로 redirect                         |
| `useApi`       | `hooks/useApi.ts`       | `{ data, loading, error, execute }` — fetcher 함수 래핑                                            |
| `usePaginated` | `hooks/usePaginated.ts` | 누적형 페이지네이션 (무한 스크롤/더보기). `{ items, loading, error, hasMore, loadMore, reset }`    |
| `usePagedNav`  | `hooks/usePagedNav.ts`  | 이전/다음 + 페이지 번호. `{ items, page, totalPages, total, hasPrev, hasNext, next, prev, reset }` |

### Services

| export                | 파일                        | 함수                                            |
| --------------------- | --------------------------- | ----------------------------------------------- |
| `apiClient` (default) | `services/apiClient.ts`     | Axios 인스턴스 (토큰 자동 첨부, 401 시 refresh) |
| `login`               | `services/authService.ts`   | `POST /api/auth/login`                          |
| `refresh`             | `services/authService.ts`   | `POST /api/auth/refresh`                        |
| `logout`              | `services/authService.ts`   | `POST /api/auth/logout`                         |
| `signup`              | `services/signupService.ts` | `POST /api/user/register`                       |

### Stores

| export          | 파일                   | 상태/액션                                                              |
| --------------- | ---------------------- | ---------------------------------------------------------------------- |
| `useAppsStore`  | `stores/appsStore.ts`  | `apps`, `loaded`, `fetchApps()`, `clear()` — 접근 가능 앱 목록         |
| `useAuthStore`  | `stores/authStore.ts`  | `user`, `isAuthenticated`, `login(tokens)`, `logout()`, `initialize()` |
| `useThemeStore` | `stores/themeStore.ts` | `isDarkMode`, `theme`, `toggleDarkMode()`, `setDarkMode()` — 다크모드  |

### Types

| export           | 파일                       | 설명                                                         |
| ---------------- | -------------------------- | ------------------------------------------------------------ |
| `User`           | `types/auth.ts`            | DB 유저 전체 필드                                            |
| `VUser`          | `types/auth.ts`            | 뷰용 유저 (v_users 기반; role/team/status 모두 name 문자열)  |
| `TokenPair`      | `types/auth.ts`            | `access_token`, `refresh_token`                              |
| `AuthPayload`    | `types/auth.ts`            | JWT 디코딩 결과 (`sub`, `id`, `name`, `role`, `team`, `exp`) |
| `LoginRequest`   | `types/auth.ts`            | `id`, `password`                                             |
| `LoginResponse`  | `types/auth.ts`            | `access_token`, `refresh_token` (현재 `TokenPair` 와 동일)   |
| `AppInfo`        | `stores/appsStore.ts`      | `{ idx, path, name }` — 앱 정보 타입                         |
| `SignupRequest`  | `types/signup.ts`          | 회원가입 요청 타입                                           |
| `SignupResponse` | `types/signup.ts`          | 회원가입 응답 타입                                           |
| `SidebarItem`    | `components/AppLayout.tsx` | `SidebarLeaf` 또는 `SidebarGroup` 유니온 — 사이드바 메뉴     |
| `SidebarLeaf`    | `components/AppLayout.tsx` | `{ label, to, icon? }` — 개별 메뉴                           |
| `SidebarGroup`   | `components/AppLayout.tsx` | `{ label, icon?, children: SidebarLeaf[] }` — 2레벨 그룹     |
| `RoleType`       | `types/constants.ts`       | `"ADMIN" \| "LEAD" \| "MEMBER" \| "GUEST"` 유니온 타입       |
| `TeamType`       | `types/constants.ts`       | `"ENGINE" \| "ANALYST"` 유니온 타입                          |
| `Theme`          | `styles/theme.ts`          | 테마 객체 타입 (`fontFamily`, `colors`, `radius` 등)         |
| `ThemeColors`    | `styles/theme.ts`          | 테마 색상 토큰 타입                                          |

### Constants

| export                | 파일                 | 설명                                                      |
| --------------------- | -------------------- | --------------------------------------------------------- |
| `Role`                | `types/constants.ts` | `{ ADMIN, LEAD, MEMBER, GUEST }` — 값은 대문자 string     |
| `ROLE_LABEL`          | `types/constants.ts` | `RoleType` → 한국어 표시 라벨 (예: `ADMIN` → `관리자`)    |
| `ROLE_OPTIONS`        | `types/constants.ts` | 관리자 편집 폼용 전체 option 배열                         |
| `SIGNUP_ROLE_OPTIONS` | `types/constants.ts` | 자가 가입 폼용 option (MEMBER/GUEST 만)                   |
| `Team`                | `types/constants.ts` | `{ ENGINE, ANALYST }` — 값은 대문자 string                |
| `TEAM_LABEL`          | `types/constants.ts` | `TeamType` → 한국어 표시 라벨                             |
| `TEAM_OPTIONS`        | `types/constants.ts` | `<option>` 생성용 전체 option 배열                        |

### Utils

| export            | 파일               | 설명                                                          |
| ----------------- | ------------------ | ------------------------------------------------------------- |
| `getAccessToken`  | `utils/token.ts`   | localStorage에서 access token 읽기                            |
| `getRefreshToken` | `utils/token.ts`   | localStorage에서 refresh token 읽기                           |
| `saveTokens`      | `utils/token.ts`   | access/refresh token localStorage 저장                        |
| `clearTokens`     | `utils/token.ts`   | access/refresh token localStorage 삭제                        |
| `decodeToken`     | `utils/token.ts`   | JWT payload 디코딩 → `AuthPayload`                            |
| `hasAppAccess`    | `utils/appPath.ts` | 접근 가능 앱 목록에 특정 경로가 포함되는지 판정 (경로 정규화) |

## 규칙

- 앱에서 Axios 인스턴스를 직접 생성하지 않는다 — `apiClient` 사용
- 앱에서 인증 상태를 별도 store로 관리하지 않는다 — `useAuthStore` 사용
- 앱에서 로그인 페이지를 별도 구현하지 않는다 — `LoginPage` 사용
- 앱에서 `useAuth`, `useAppAccess`를 재구현하지 않는다
- 앱 접근 권한은 `useAppAccess(path)`로 검사한다 — DB `apps` 테이블 기반
- `AppLayout`은 `useAuthStore`, `useAppsStore`, `useThemeStore`를 직접 참조하므로 앱에서 store를 props로 전달하지 않아도 된다
- 앱 내부 페이지/컴포넌트는 `theme`를 정적 import 하지 않고 `useThemeStore().theme`로 구독해 다크모드 전환에 반응한다
- 페이지 이름은 `AppLayout`의 `title` prop으로만 표시한다 — body 최상단에 같은 제목(`<h2>`)을 다시 출력하지 않는다 (헤더에 `{appName} | {title}`로 이미 노출됨)
- **Role은 대문자 영어 문자열**(`"ADMIN" | "LEAD" | "MEMBER" | "GUEST"`)로 주고받는다 — BE/JWT/FE 공통 규약. 숫자 변환 금지. 사용자 표시 문구는 `ROLE_LABEL` 로 조회한다.
- **Team도 대문자 영어 문자열**(`"ENGINE" | "ANALYST"`)로 주고받는다 — BE/JWT/FE 공통 규약. 숫자 변환 금지. 사용자 표시 문구는 `TEAM_LABEL` 로 조회한다.
- `initialize()`는 앱 진입점(`main.tsx` 또는 `App.tsx`)에서 최초 1회 호출한다

## 정책 문서

상세 사용법은 `docs/` 참조:

- [docs/components.md](docs/components.md)
- [docs/theme.md](docs/theme.md) — 라이트/다크 팔레트 및 디자인 가이드
- [docs/auth.md](docs/auth.md)
- [docs/api-client.md](docs/api-client.md)
- [docs/pagination.md](docs/pagination.md)
- [docs/stores.md](docs/stores.md)

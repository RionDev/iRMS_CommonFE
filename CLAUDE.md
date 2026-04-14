# @irms/common — 모듈 상세

공통 모듈의 export 목록과 규칙. 앱 구현 시 이 파일을 먼저 확인한다.

## Export 목록 (`src/index.ts`)

### Pages

| export       | 파일                   | 역할                                                        |
| ------------ | ---------------------- | ----------------------------------------------------------- |
| `LoginPage`  | `pages/LoginPage.tsx`  | 로그인 폼 렌더링, 인증 처리, 로그인 후 원래 경로로 redirect |
| `SignupPage` | `pages/SignupPage.tsx` | 회원가입 폼 렌더링, 가입 처리                               |

### Components

| export       | 파일                        | Props                                                         |
| ------------ | --------------------------- | ------------------------------------------------------------- |
| `Button`     | `components/Button.tsx`     | `variant?: 'primary'\|'secondary'` + 기본 button 속성         |
| `Input`      | `components/Input.tsx`      | `label?: string`, `error?: string` + 기본 input 속성          |
| `Modal`      | `components/Modal.tsx`      | `isOpen`, `onClose`, `title`, `children`                      |
| `Layout`     | `components/Layout.tsx`     | `title: string`, `children` — 헤더(로그아웃 포함) + 본문 래퍼 |
| `LoginForm`  | `components/LoginForm.tsx`  | `onSubmit`, `loading?`, `error?` — LoginPage 내부용           |
| `SideNav`    | `components/SideNav.tsx`    | `items: SideNavItem[]` — 앱별 사이드 메뉴 렌더링              |
| `SignupForm` | `components/SignupForm.tsx` | `onSubmit`, `loading?`, `error?` — SignupPage 내부용          |
| `theme`      | `styles/theme.ts`           | 색상, spacing, radius, shadow 등 공통 디자인 토큰             |

### Hooks

| export         | 파일               | 반환값                                                                     |
| -------------- | ------------------ | -------------------------------------------------------------------------- |
| `useAuth`      | `hooks/useAuth.ts` | `{ user, isAuthenticated, logout }` — 미인증 시 `/login`으로 redirect      |
| `useAppAccess` | `hooks/useAuth.ts` | `user` — `appsStore`에서 앱 경로 접근 권한 확인, 미허용 시 포털로 redirect |
| `useApi`       | `hooks/useApi.ts`  | `{ data, loading, error, execute }` — fetcher 함수 래핑                    |

### Services

| export                | 파일                        | 함수                                            |
| --------------------- | --------------------------- | ----------------------------------------------- |
| `apiClient` (default) | `services/apiClient.ts`     | Axios 인스턴스 (토큰 자동 첨부, 401 시 refresh) |
| `login`               | `services/authService.ts`   | `POST /api/auth/login`                          |
| `refresh`             | `services/authService.ts`   | `POST /api/auth/refresh`                        |
| `logout`              | `services/authService.ts`   | `POST /api/auth/logout`                         |
| `signup`              | `services/signupService.ts` | `POST /api/auth/signup`                         |

### Stores

| export         | 파일                  | 상태/액션                                                              |
| -------------- | --------------------- | ---------------------------------------------------------------------- |
| `useAppsStore` | `stores/appsStore.ts` | `apps`, `loaded`, `fetchApps()`, `clear()` — 접근 가능 앱 목록         |
| `useAuthStore` | `stores/authStore.ts` | `user`, `isAuthenticated`, `login(tokens)`, `logout()`, `initialize()` |

### Types

| export           | 파일                  | 설명                                                         |
| ---------------- | --------------------- | ------------------------------------------------------------ |
| `User`           | `types/auth.ts`       | DB 유저 전체 필드                                            |
| `VUser`          | `types/auth.ts`       | 뷰용 유저 (team_name, role_name 등 문자열)                   |
| `TokenPair`      | `types/auth.ts`       | `access_token`, `refresh_token`                              |
| `AuthPayload`    | `types/auth.ts`       | JWT 디코딩 결과 (`sub`, `id`, `name`, `role`, `team`, `exp`) |
| `LoginRequest`   | `types/auth.ts`       | `id`, `password`                                             |
| `LoginResponse`  | `types/auth.ts`       | `TokenPair` + `user: VUser`                                  |
| `AppInfo`        | `stores/appsStore.ts` | `{ idx, path, name }` — 앱 정보 타입                         |
| `SignupRequest`  | `types/signup.ts`     | 회원가입 요청 타입                                           |
| `SignupResponse` | `types/signup.ts`     | 회원가입 응답 타입                                           |

### Utils

| export            | 파일             | 설명                                   |
| ----------------- | ---------------- | -------------------------------------- |
| `getAccessToken`  | `utils/token.ts` | localStorage에서 access token 읽기     |
| `getRefreshToken` | `utils/token.ts` | localStorage에서 refresh token 읽기    |
| `saveTokens`      | `utils/token.ts` | access/refresh token localStorage 저장 |
| `clearTokens`     | `utils/token.ts` | access/refresh token localStorage 삭제 |
| `decodeToken`     | `utils/token.ts` | JWT payload 디코딩 → `AuthPayload`     |

## 규칙

- 앱에서 Axios 인스턴스를 직접 생성하지 않는다 — `apiClient` 사용
- 앱에서 인증 상태를 별도 store로 관리하지 않는다 — `useAuthStore` 사용
- 앱에서 로그인 페이지를 별도 구현하지 않는다 — `LoginPage` 사용
- 앱에서 `useAuth`, `useAppAccess`를 재구현하지 않는다
- 앱 접근 권한은 `useAppAccess(path)`로 검사한다 — DB `apps` 테이블 기반
- `Layout`은 `useAuthStore`, `useAppsStore`를 직접 참조하므로 앱에서 store를 props로 전달하지 않아도 된다
- `initialize()`는 앱 진입점(`main.tsx` 또는 `App.tsx`)에서 최초 1회 호출한다

## 정책 문서

상세 사용법은 `docs/` 참조:

- [docs/components.md](docs/components.md)
- [docs/auth.md](docs/auth.md)
- [docs/api-client.md](docs/api-client.md)
- [docs/stores.md](docs/stores.md)

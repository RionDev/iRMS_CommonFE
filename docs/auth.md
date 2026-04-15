# 인증 정책

토큰 관리, 인증 훅, LoginPage 사용법.

## 공통 코드 구조(중요)

현재 `@common`은 루트 `common/src`를 가리키지 않고, **각 앱 내부의 `apps/<app>/common/src`** 를 가리킨다.

- admin 앱: `@common -> apps/admin/common/src`
- portal 앱: `@common -> apps/portal/common/src`

따라서 인증 로직(`utils/token.ts`, `services/apiClient.ts`, `stores/authStore.ts` 등)을 수정할 때는 다음 원칙을 따른다.

- 한 앱만 수정하면 다른 앱에는 반영되지 않는다.
- 공통 정책 변경은 `admin/portal`의 동일 파일에 **동일하게 반영**해야 한다.
- 루트 `common/src` 변경만으로는 각 앱 동작이 자동으로 바뀌지 않는다(현재 alias 구조 기준).

## 토큰 저장 방식

| 항목          | 키                   | 저장소       |
| ------------- | -------------------- | ------------ |
| Access Token  | `irms_access_token`  | localStorage |
| Refresh Token | `irms_refresh_token` | localStorage |

토큰 관련 유틸 함수는 `utils/token.ts`에 있다. 앱에서 직접 localStorage를 조작하지 말고 아래 함수를 사용한다.

```ts
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  decodeToken,
} from "@common/utils/token";
```

## 앱 진입점 초기화

앱이 로드될 때 `authStore.initialize()`를 반드시 호출해야 한다. 페이지 새로고침 후 로그인 상태를 복원한다.

```tsx
// main.tsx 또는 App.tsx
import { useAuthStore } from "@common/stores/authStore";

const { initialize } = useAuthStore.getState();
initialize();
```

`initialize()`는 localStorage의 access token을 읽어 만료 여부를 확인한 뒤 store 상태를 설정한다. 만료된 경우 토큰을 삭제한다.

## LoginPage

로그인은 앱마다 구현하지 않고 공통 `LoginPage`를 사용한다.

```tsx
// App.tsx 라우터 설정
import { LoginPage } from "@common/pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- 로그인 성공 시 `redirect` 쿼리 또는 이전 경로(`location.state.from`)로 이동
- 이전 경로가 없으면 앱 기본 경로로 이동

## 앱 진입 규칙

각 앱은 자체 `/login` 라우트를 가지며, 미인증 시 자기 앱 범위 내에서 로그인 페이지로 이동한다.

- portal: 미인증 → `/login?redirect=...`
- admin: 미인증 → `/admin/login?redirect=...`

앱 간 로그인 리다이렉트는 없다. 각 앱이 공통 `LoginPage`를 독립적으로 사용한다.
이미 로그인된 상태에서 `LoginPage`에 들어오면 `redirect` 목적지로 즉시 이동한다.

## useAuth — 인증 보호 훅

인증이 필요한 페이지에서 사용한다. 미인증 상태면 자동으로 `/login`으로 redirect한다.

```tsx
import { useAuth } from "@common/hooks/useAuth";

function MyPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return <div>{user?.name} 님 환영합니다.</div>;
}
```

### 반환값

| 값                | 타입                  | 설명                                |
| ----------------- | --------------------- | ----------------------------------- |
| `user`            | `AuthPayload \| null` | 현재 로그인 사용자 정보             |
| `isAuthenticated` | `boolean`             | 인증 여부                           |
| `logout`          | `() => void`          | 로그아웃 (토큰 삭제 + store 초기화) |

`react-router-dom`의 `useNavigate`, `useLocation`을 사용하므로 `BrowserRouter` 내부에서만 호출 가능하다.

## useRequireRole — 역할 기반 접근 제어

특정 역할만 접근 가능한 페이지/컴포넌트에서 사용한다.

```tsx
import { useRequireRole } from "@common/hooks/useAuth";
import { Role } from "@common/types/constants";

function AdminPage() {
  const user = useRequireRole(Role.ADMIN);
  // role이 ADMIN이 아니면 Error('권한이 없습니다') throw
  return <div>관리자 페이지</div>;
}
```

`useAuth()`를 내부 호출하므로 미인증 시 `/login` redirect도 함께 동작한다.

### Role 상수

BE 와 합의된 규약: 전 구간 **대문자 영어 string** (`"ADMIN" | "LEAD" | "MEMBER" | "GUEST"`) 으로 주고받는다. FE 는 숫자↔문자열 변환을 하지 않는다.

```ts
import { Role, ROLE_LABEL, type RoleType } from "@common/types/constants";

Role.ADMIN; // "ADMIN"
Role.LEAD; // "LEAD"
Role.MEMBER; // "MEMBER"
Role.GUEST; // "GUEST"

// 사용자에게 보여줄 한국어 라벨
ROLE_LABEL["ADMIN"]; // "관리자"

// 타입
const role: RoleType = Role.ADMIN;
```

폼 `<option>` 생성은 `ROLE_OPTIONS` / `SIGNUP_ROLE_OPTIONS` 를 사용한다.

## AuthPayload 타입

JWT access token을 디코딩하면 얻을 수 있는 payload 구조.

```ts
interface AuthPayload {
  sub: number; // 유저 idx
  id: string; // 로그인 ID
  name: string; // 이름
  role: RoleType; // 대문자 영어 문자열 ("ADMIN" | "LEAD" | "MEMBER" | "GUEST")
  team: number | null; // Team idx (Guest 는 null)
  exp: number; // 만료 시각 (Unix timestamp, 초 단위)
}
```

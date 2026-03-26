# 인증 정책

토큰 관리, 인증 훅, LoginPage 사용법.

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
} from "@irms/common";
```

## 앱 진입점 초기화

앱이 로드될 때 `authStore.initialize()`를 반드시 호출해야 한다. 페이지 새로고침 후 로그인 상태를 복원한다.

```tsx
// main.tsx 또는 App.tsx
import { useAuthStore } from "@irms/common";

const { initialize } = useAuthStore.getState();
initialize();
```

`initialize()`는 localStorage의 access token을 읽어 만료 여부를 확인한 뒤 store 상태를 설정한다. 만료된 경우 토큰을 삭제한다.

## LoginPage

로그인은 앱마다 구현하지 않고 공통 `LoginPage`를 사용한다.

```tsx
// App.tsx 라우터 설정
import { LoginPage } from "@irms/common";
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

- 로그인 성공 시 이전에 접근하려던 경로로 redirect (`location.state.from` 활용)
- 이전 경로가 없으면 `/`로 이동

## useAuth — 인증 보호 훅

인증이 필요한 페이지에서 사용한다. 미인증 상태면 자동으로 `/login`으로 redirect한다.

```tsx
import { useAuth } from "@irms/common";

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
import { useRequireRole, Role } from "@irms/common";

function AdminPage() {
    const user = useRequireRole(Role.ADMIN);
    // role이 ADMIN이 아니면 Error('권한이 없습니다') throw
    return <div>관리자 페이지</div>;
}
```

`useAuth()`를 내부 호출하므로 미인증 시 `/login` redirect도 함께 동작한다.

### Role 상수

```ts
import { Role } from "@irms/common";

Role.MEMBER; // 1
Role.LEAD; // 2
Role.ADMIN; // 3
Role.GUEST; // 4
```

## AuthPayload 타입

JWT access token을 디코딩하면 얻을 수 있는 payload 구조.

```ts
interface AuthPayload {
    sub: number; // 유저 idx
    id: string; // 로그인 ID
    name: string; // 이름
    role: number; // Role 상수 값
    team: number; // Team 상수 값
    exp: number; // 만료 시각 (Unix timestamp, 초 단위)
}
```

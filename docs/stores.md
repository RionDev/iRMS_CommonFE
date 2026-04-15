# 상태 관리 (Zustand)

## 1. authStore

인증 상태를 관리하는 유일한 전역 store. 앱마다 별도로 정의하지 않는다.

```ts
import { useAuthStore } from "@common";
```

### 1.1. 상태

| 상태              | 타입                  | 설명                                  |
| ----------------- | --------------------- | ------------------------------------- |
| `user`            | `AuthPayload \| null` | 현재 로그인 사용자 정보 (JWT payload) |
| `isAuthenticated` | `boolean`             | 로그인 여부                           |

### 1.2. 액션

| 액션         | 시그니처                      | 설명                    |
| ------------ | ----------------------------- | ----------------------- |
| `login`      | `(tokens: TokenPair) => void` | 토큰 저장 + user 설정   |
| `logout`     | `() => void`                  | 토큰 삭제 + user 초기화 |
| `initialize` | `() => void`                  | 앱 시작 시 토큰 복원    |

### 1.2. 사용 패턴

#### 1.2.1. 컴포넌트에서 상태 읽기

```tsx
// 필요한 상태만 선택적으로 구독
const user = useAuthStore((s) => s.user);
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
```

#### 1.2.2. 훅에서 사용 (권장)

인증이 필요한 페이지는 store를 직접 사용하지 않고 `useAuth` 훅을 사용한다.

```tsx
import { useAuth } from "@common";

const { user, isAuthenticated, logout } = useAuth();
```

#### 1.2.3. 앱 초기화 (main.tsx)

```tsx
import { useAuthStore } from "@common";

// React 렌더링 전에 동기적으로 호출
useAuthStore.getState().initialize();
```

#### 1.2.4. 로그인 처리 (LoginPage 내부에서 이미 처리됨)

직접 호출이 필요한 경우:

```ts
import { useAuthStore } from "@common";

const { login } = useAuthStore();
login({ access_token: "...", refresh_token: "..." });
```

### 1.3. initialize() 동작

1. localStorage에서 access token 읽기
2. JWT 디코딩하여 `exp` 확인
3. 만료되지 않았으면 `user`, `isAuthenticated` 설정
4. 만료됐거나 디코딩 실패 시 토큰 삭제 (상태는 초기값 유지)

## 2. themeStore

다크모드(light/dark 테마) 전역 store. 모든 앱에서 공유되며 `AppLayout` 헤더의 토글 버튼으로 전환한다.

```ts
import { useThemeStore } from "@common";
```

### 2.1. 상태

| 상태         | 타입      | 설명                                           |
| ------------ | --------- | ---------------------------------------------- |
| `isDarkMode` | `boolean` | 현재 다크모드 여부                             |
| `theme`      | `Theme`   | 현재 활성 테마 객체 (`lightTheme`/`darkTheme`) |

### 2.2. 액션

| 액션             | 시그니처                    | 설명                                  |
| ---------------- | --------------------------- | ------------------------------------- |
| `toggleDarkMode` | `() => void`                | light ↔ dark 전환 + localStorage 저장 |
| `setDarkMode`    | `(isDark: boolean) => void` | 명시적 설정                           |

### 2.3. 사용 패턴

UI 컴포넌트는 `theme`를 `useThemeStore`로 구독해야 다크모드 전환에 반응한다.

```tsx
import { useThemeStore } from "@common";

function MyCard() {
  const { theme } = useThemeStore();
  return (
    <div style={{ backgroundColor: theme.colors.surface, color: theme.colors.text }}>
      ...
    </div>
  );
}
```

### 2.4. 초기값 결정 규칙

1. `localStorage["IRMS_THEME_MODE"]` 이 있으면 그 값 사용 (`"dark"` / `"light"`)
2. 없으면 시스템 설정 `prefers-color-scheme: dark` 감지
3. `toggle`/`set` 호출 시마다 localStorage에 기록

> **주의:** 정적 import (`import { theme } from "@common"`)는 `lightTheme` alias이므로 다크모드 전환에 반응하지 않는다. 일반 UI 코드에서는 반드시 `useThemeStore().theme`를 사용한다.

## 3. appsStore

로그인 사용자가 접근 가능한 앱 목록을 관리한다.

```ts
import { useAppsStore } from "@common";
```

### 3.1. 상태 / 액션

| 이름         | 타입                       | 설명                                    |
| ------------ | -------------------------- | --------------------------------------- |
| `apps`       | `AppInfo[]`                | 접근 가능 앱 목록 (`{idx, path, name}`) |
| `loaded`     | `boolean`                  | 최초 로드 완료 여부                     |
| `fetchApps`  | `() => Promise<void>`      | BE에서 앱 목록 조회                     |
| `clear`      | `() => void`               | 로그아웃 시 초기화                      |

`AppLayout`의 헤더 AppLauncher와 `useAppAccess` 훅에서 내부적으로 사용한다.

## 4. 앱별 store 추가 규칙

공통 인증 상태 외에 앱 고유의 상태가 필요하면 해당 앱 내에 별도 store를 만든다.

- 위치: 앱 repo의 `src/stores/*.ts`
- 인증 상태는 절대 중복 정의하지 않는다
- store는 Zustand `create`로 정의하며 hooks는 `use` 접두어를 붙인다

```ts
// 앱 고유 store 예시
import { create } from "zustand";

interface SomeState {
  items: Item[];
  setItems: (items: Item[]) => void;
}

export const useSomeStore = create<SomeState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
```

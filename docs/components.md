# 공통 UI 컴포넌트

`@common`에서 제공하는 UI 컴포넌트 사용법.

모든 컴포넌트는 인라인 스타일 기반이며 Tailwind/CSS 모듈 의존성이 없다.
공용 디자인 토큰(색상, 폰트, radius 등)은 `src/styles/theme.ts`에서 관리하며
런타임에는 `useThemeStore().theme`으로 구독해 다크모드 전환에 반응한다.

## 1. AppLayout

모든 앱(포털, 어드민 등)이 공유하는 표준 템플릿. 사이드바 + 헤더 + 메인 + 푸터 구조.

사이드바는 항상 렌더링되며 (상단 IRMS 브랜드 + 메뉴 + 하단 로그아웃),
헤더에는 햄버거(사이드바 접기/펼치기), `{appName} | {title}` 브레드크럼, 프로필 메뉴, 다크모드 토글, 앱 런처가 있다.
콘텐츠 영역은 좌측 정렬 최대 너비(기본 960px)이며, 앱 전체 최소 너비(기본 1180px) 이하에서는 페이지에 가로 스크롤이 생긴다.

```tsx
import { AppLayout } from "@common";

function UserListPage() {
  return (
    <AppLayout
      title="회원 목록"
      appName="ADMIN"
      sidebarItems={adminNavItems}
      version={__APP_VERSION__}
    >
      <h2>회원 목록</h2>
      <UserTable ... />
    </AppLayout>
  );
}
```

### 1.1. Props

| prop              | 타입            | 기본값     | 설명                                                               |
| ----------------- | --------------- | ---------- | ------------------------------------------------------------------ |
| `title`           | `string`        | —          | 헤더에 `{appName} \| {title}` 형태로 표시되는 현재 페이지 이름     |
| `appName`         | `string`        | —          | 헤더 좌측 앱 이름 (예: `"ADMIN"`, `"PORTAL"`)                      |
| `sidebarItems`    | `SidebarItem[]` | `[]`       | 사이드바 메뉴 항목. 빈 배열이면 브랜드 + 로그아웃만 표시           |
| `version`         | `string`        | —          | 푸터 "Version X.X.X" 표시 (`__APP_VERSION__` 주입값)               |
| `contentMaxWidth` | `string`        | `"960px"`  | 메인 영역 최대 너비. FHD 절반 브라우저에서 꽉 차는 크기            |
| `appMinWidth`     | `string`        | `"1180px"` | 앱 최소 너비. 이보다 작으면 페이지 가로 스크롤 발생                |
| `children`        | `ReactNode`     | —          | 메인 영역 콘텐츠                                                   |

### 1.2. SidebarItem

| 필드    | 타입        | 설명                                      |
| ------- | ----------- | ----------------------------------------- |
| `label` | `string`    | 메뉴 표시 이름                            |
| `to`    | `string`    | 앱 basename 기준 이동 경로 (react-router) |
| `icon`  | `ReactNode` | (선택) SVG 등 아이콘 노드                 |

사이드바 접힘 상태는 `IRMS_SIDEBAR_COLLAPSED` localStorage 키로 유지된다 (페이지 이동/새로고침 후에도 유지).

`AppLayout`은 `useAuthStore`, `useAppsStore`, `useThemeStore`를 직접 참조하므로
앱에서 store를 props로 전달하지 않는다.

---

## 2. Avatar

사용자 이름을 기반으로 결정론적으로 생성되는 원형 아바타.
외부 이미지 없이 이니셜 + 배경색으로 그린다.

- 이니셜: 한글은 앞 2글자(1글자 이름은 그대로), 영문은 공백 분리 단어의 첫글자 최대 2개(대문자)
- 배경색: 이름 해시 → 10색 고정 팔레트에서 선택. 같은 이름은 항상 같은 색
- 다크모드 대응: light/dark 팔레트 2세트 (themeStore 구독)
- 빈 이름 fallback: `"?"` + 회색 배경

```tsx
import { Avatar } from "@common";

// 헤더 프로필 (기본 32px)
<Avatar name={user.name} />

// 상세 페이지
<Avatar name={user.name} size={80} />

// 툴팁 커스터마이즈
<Avatar name={user.name} size={32} title={`${user.name} 님`} />
```

### 2.1. Props

| prop    | 타입            | 기본값       | 설명                                                    |
| ------- | --------------- | ------------ | ------------------------------------------------------- |
| `name`  | `string`        | —            | 이니셜 및 색상 산출 기준. 빈 문자열이면 `?` + 회색 배경 |
| `size`  | `number`        | `32`         | 지름(px). 폰트는 `size * 0.4`                           |
| `title` | `string`        | `name`       | hover 툴팁. 기본은 `name`                               |
| `style` | `CSSProperties` | —            | 추가 스타일 (기본 스타일에 병합)                        |

---

## 3. Button

```tsx
import { Button } from "@common";

// primary (기본) — 파란색 배경
<Button onClick={handleClick}>저장</Button>

// secondary — 회색 배경
<Button variant="secondary" onClick={handleCancel}>취소</Button>

// 비활성화
<Button disabled>처리 중...</Button>

// style 오버라이드
<Button style={{ width: '100%' }}>전체 너비</Button>
```

### 2.1. Props

| prop      | 타입                       | 기본값      | 설명                                              |
| --------- | -------------------------- | ----------- | ------------------------------------------------- |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | 버튼 스타일                                       |
| `style`   | `CSSProperties`            | —           | 추가 스타일 (기본 스타일에 병합)                  |
| 기타      | `ButtonHTMLAttributes`     | —           | `onClick`, `type`, `disabled` 등 모든 button 속성 |

---

## 4. Input

```tsx
import { Input } from "@common";

// 기본
<Input
  label="이름"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// 에러 상태
<Input
  label="이메일"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="올바른 이메일 형식이 아닙니다"
/>
```

### 4.1. Props

| prop    | 타입                  | 기본값 | 설명                                          |
| ------- | --------------------- | ------ | --------------------------------------------- |
| `label` | `string`              | —      | 입력 필드 위 라벨                             |
| `error` | `string`              | —      | 에러 메시지 (빨간색 테두리 + 메시지 표시)     |
| 기타    | `InputHTMLAttributes` | —      | `type`, `value`, `onChange`, `placeholder` 등 |

---

## 5. Modal

```tsx
import { Modal } from "@common";

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="확인">
  <p>삭제하시겠습니까?</p>
  <Button onClick={() => setIsOpen(false)}>닫기</Button>
</Modal>;
```

### 5.1. Props

| prop       | 타입         | 설명                        |
| ---------- | ------------ | --------------------------- |
| `isOpen`   | `boolean`    | `false`이면 렌더링하지 않음 |
| `onClose`  | `() => void` | 배경 클릭 시 호출           |
| `title`    | `string`     | 모달 상단 제목              |
| `children` | `ReactNode`  | 모달 본문                   |

배경 클릭 시 `onClose` 호출. 모달 내부 클릭은 이벤트 전파가 막힌다.

---

## 6. Theme

디자인 토큰은 `src/styles/theme.ts`에서 관리한다.
런타임에는 `useThemeStore`를 통해 light/dark 테마를 선택한다.

```tsx
import { useThemeStore } from "@common";

function MyCard() {
  const { theme } = useThemeStore();
  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.card,
      }}
    >
      ...
    </div>
  );
}
```

### 6.1. 테마 구조

- `theme.fontFamily`
- `theme.colors` — `pageBackground`, `surface`, `primary`, `text`, `danger`, `sidebarBackground` 등
- `theme.radius` — `sm`, `md`, `lg`
- `theme.shadow.card`
- `theme.layout` — `contentMaxWidth`, `sideNavWidth`

### 6.2. 정적 참조 (특수 케이스만)

모듈 레벨 상수에서 색상이 필요하고 다크모드 반영이 불필요한 경우에만 `theme`(= `lightTheme` alias)를 정적 import할 수 있다. 일반 UI 코드는 `useThemeStore().theme`을 사용한다.

```tsx
import { lightTheme, darkTheme, theme } from "@common";
```

자세한 다크모드 상태 관리는 [stores.md](stores.md)의 themeStore 섹션 참조.

---

## 7. LoginForm / SignupForm

각각 `LoginPage`, `SignupPage` 내부에서 사용하는 폼 컴포넌트. 직접 사용할 일은 거의 없다.

```tsx
import { LoginForm } from "@common";

<LoginForm
  onSubmit={(id, password) => handleLogin(id, password)}
  loading={isLoading}
  error={errorMessage}
/>;
```

### 7.1. Props

| prop       | 타입                                     | 설명                                           |
| ---------- | ---------------------------------------- | ---------------------------------------------- |
| `onSubmit` | `(id: string, password: string) => void` | 폼 submit 시 호출 (LoginForm)                  |
| `loading`  | `boolean`                                | `true`이면 버튼 비활성화 + "로그인 중..." 표시 |
| `error`    | `string \| null`                         | 에러 메시지 표시                               |

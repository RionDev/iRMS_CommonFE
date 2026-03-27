# 공통 UI 컴포넌트

`@irms/common`에서 제공하는 UI 컴포넌트 사용법.

모든 컴포넌트는 인라인 스타일 기반이며 Tailwind/CSS 모듈 의존성이 없다.
공용 배경색, 폰트, 주요 색상은 `src/styles/theme.ts`의 `theme`에서 관리한다.

## 1. Button

```tsx
import { Button } from '@irms/common';

// primary (기본) — 파란색 배경
<Button onClick={handleClick}>저장</Button>

// secondary — 회색 배경
<Button variant="secondary" onClick={handleCancel}>취소</Button>

// 비활성화
<Button disabled>처리 중...</Button>

// style 오버라이드
<Button style={{ width: '100%' }}>전체 너비</Button>
```

### 1.1. Props

| prop      | 타입                       | 기본값      | 설명                                              |
| --------- | -------------------------- | ----------- | ------------------------------------------------- |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | 버튼 스타일                                       |
| `style`   | `CSSProperties`            | —           | 추가 스타일 (기본 스타일에 병합)                  |
| 기타      | `ButtonHTMLAttributes`     | —           | `onClick`, `type`, `disabled` 등 모든 button 속성 |

---

## 2. Input

```tsx
import { Input } from '@irms/common';

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

### 2.1. Props

| prop    | 타입                  | 기본값 | 설명                                          |
| ------- | --------------------- | ------ | --------------------------------------------- |
| `label` | `string`              | —      | 입력 필드 위 라벨                             |
| `error` | `string`              | —      | 에러 메시지 (빨간색 테두리 + 메시지 표시)     |
| 기타    | `InputHTMLAttributes` | —      | `type`, `value`, `onChange`, `placeholder` 등 |

---

## 3. Modal

```tsx
import { Modal } from "@irms/common";

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="확인">
    <p>삭제하시겠습니까?</p>
    <Button onClick={() => setIsOpen(false)}>닫기</Button>
</Modal>;
```

### 3.1. Props

| prop       | 타입         | 설명                        |
| ---------- | ------------ | --------------------------- |
| `isOpen`   | `boolean`    | `false`이면 렌더링하지 않음 |
| `onClose`  | `() => void` | 배경 클릭 시 호출           |
| `title`    | `string`     | 모달 상단 제목              |
| `children` | `ReactNode`  | 모달 본문                   |

배경 클릭 시 `onClose` 호출. 모달 내부 클릭은 이벤트 전파가 막힌다.

---

## 4. Layout

앱 전체를 감싸는 공통 레이아웃. 헤더에 앱 제목과 로그인 사용자 이름/로그아웃 버튼을 표시하고,
필요하면 공통 사이드 메뉴를 렌더링한다.

```tsx
import { Layout } from "@irms/common";

function App() {
    return (
        <Layout title="관리자" sideNavItems={[{ label: "회원 목록", to: "/users" }]}>
            <SomePage />
        </Layout>
    );
}
```

### 4.1. Props

| prop       | 타입        | 설명                                |
| ---------- | ----------- | ----------------------------------- |
| `title`    | `string`    | 헤더에 `iRMS — {title}` 형태로 표시 |
| `children` | `ReactNode` | 본문 컨텐츠                         |
| `sideNavItems` | `SideNavItem[]` | 앱별 사이드 메뉴 항목 목록 |

`useAuthStore`를 내부에서 직접 참조한다. 인증된 상태이면 헤더에 사용자 이름과 로그아웃 버튼이 표시된다.

---

## 5. SideNav

공통 사이드 메뉴 UI. 메뉴 항목 자체는 각 앱이 데이터로 정의한다.

```tsx
import { SideNav } from "@irms/common";

<SideNav
  items={[
    { label: "회원 목록", to: "/users" },
    { label: "가입 승인", to: "/approval" },
  ]}
/>;
```

### 5.1. SideNavItem

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `label` | `string` | 메뉴 표시 이름 |
| `to` | `string` | 앱 basename 기준 이동 경로 |

---

## 6. Theme

공용 디자인 토큰은 `src/styles/theme.ts`의 `theme`에서 관리한다.

- `theme.fontFamily`
- `theme.colors`
- `theme.radius`
- `theme.shadow`
- `theme.layout`

배경, 폰트, 주요 색상은 앱에서 직접 하드코딩하지 않고 이 값을 우선 사용한다.

---

## 7. LoginForm

`LoginPage` 내부에서 사용하는 폼 컴포넌트. 직접 사용할 일은 거의 없다.

```tsx
import { LoginForm } from "@irms/common";

<LoginForm
    onSubmit={(id, password) => handleLogin(id, password)}
    loading={isLoading}
    error={errorMessage}
/>;
```

### 5.1. Props

| prop       | 타입                                     | 설명                                           |
| ---------- | ---------------------------------------- | ---------------------------------------------- |
| `onSubmit` | `(id: string, password: string) => void` | 폼 submit 시 호출                              |
| `loading`  | `boolean`                                | `true`이면 버튼 비활성화 + "로그인 중..." 표시 |
| `error`    | `string \| null`                         | 에러 메시지 표시                               |

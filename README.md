# @irms/common

iRMS FE 공통 모듈. 모든 앱에서 공유하는 인증, API 클라이언트, UI 컴포넌트, 전역 상태를 제공한다.

각 앱에 git submodule로 포함되어 사용된다 (`RionDev/iRMS_CommonFE`).

## 패키지 구조

```text
common/
├── src/
│   ├── components/     # 공통 UI 컴포넌트
│   ├── hooks/          # 공통 훅 (인증, API)
│   ├── pages/          # 공통 페이지 (LoginPage)
│   ├── services/       # API 클라이언트, 인증 서비스
│   ├── styles/         # 공통 theme 토큰
│   ├── stores/         # Zustand 전역 상태
│   ├── types/          # 공통 타입, 상수
│   ├── utils/          # 유틸 함수 (토큰)
│   └── index.ts        # 전체 export
└── docs/
    ├── components.md   # 컴포넌트 사용법
    ├── auth.md         # 인증/토큰 사용법
    ├── api-client.md   # API 클라이언트 사용법
    └── stores.md       # Zustand store 사용법
```

## 앱에서 사용하는 방법

앱의 `vite.config.ts`와 `tsconfig.json`에서 `@common`을 alias로 등록한 뒤 import한다.

```ts
import { useAuth } from "@common/hooks/useAuth";
import apiClient from "@common/services/apiClient";
import { Layout } from "@common/components/Layout";
import { Role } from "@common/types/constants";
```

상세 사용법은 각 정책 문서 참조:

| 문서                                     | 내용                                                    |
| ---------------------------------------- | ------------------------------------------------------- |
| [docs/components.md](docs/components.md) | Button, Input, Modal, Layout, SideNav, LoginForm, theme |
| [docs/auth.md](docs/auth.md)             | 인증 훅, 토큰 관리, LoginPage                           |
| [docs/api-client.md](docs/api-client.md) | Axios 인스턴스, 인터셉터, 환경변수                      |
| [docs/stores.md](docs/stores.md)         | authStore 사용법, 초기화                                |

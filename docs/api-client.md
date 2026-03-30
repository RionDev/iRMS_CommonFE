# API 클라이언트

`apiClient`는 공통 Axios 인스턴스다. 앱마다 Axios 인스턴스를 생성하지 않고 이 인스턴스를 사용한다.

## 기본 사용법

```ts
import apiClient from "@irms/common";

// GET
const res = await apiClient.get<MyResponse>("/api/some/endpoint");

// POST
const res = await apiClient.post<MyResponse>("/api/some/endpoint", requestBody);

// PUT, DELETE 동일
```

서비스 함수에서만 사용하며, 컴포넌트나 훅에서 직접 호출하지 않는다.

## 환경변수

`apiClient`는 `VITE_API_BASE_URL` 환경변수를 baseURL로 사용한다.

```text
# .env.development
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://api.irms.example.com
```

각 앱의 `.env` 파일에 설정한다.

## Request 인터셉터 — 토큰 자동 첨부

모든 요청에 localStorage의 access token을 `Authorization: Bearer {token}` 헤더로 자동 첨부한다.

토큰이 없으면 헤더를 추가하지 않는다 (로그인 요청 등에서 정상 동작).

## Response 인터셉터 — 401 자동 갱신

응답이 `401 Unauthorized`이면:

1. localStorage의 refresh token으로 `POST /api/auth/refresh` 호출
2. 성공 시 새 토큰을 저장하고 원래 요청을 재시도
3. refresh 실패 또는 refresh token 없음 → 토큰 삭제 후 `/login`으로 이동

동일 요청의 무한 재시도를 막기 위해 `_retry` 플래그를 사용한다.

## 타임아웃

기본 타임아웃은 **10초**. 별도 설정 없이 사용한다.

## 서비스 함수 작성 패턴

```ts
// src/services/someService.ts
import apiClient from "@irms/common";
import type { SomeRequest, SomeResponse } from "../types/some";

export async function getSomeList(): Promise<SomeResponse[]> {
  const res = await apiClient.get<SomeResponse[]>("/api/some");
  return res.data;
}

export async function createSome(data: SomeRequest): Promise<SomeResponse> {
  const res = await apiClient.post<SomeResponse>("/api/some", data);
  return res.data;
}
```

BE API 엔드포인트와 서비스 함수는 1:1 대응으로 작성한다.

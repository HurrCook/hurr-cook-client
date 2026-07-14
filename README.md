# 🍳 Hurr Cook (Client)

> 냉장고 속 재료로 만들 수 있는 요리를 AI 챗봇이 추천해 주는 모바일 웹 앱

집에 있는 재료를 등록해 두면, AI 챗봇이 그 재료로 만들 수 있는 레시피를 추천해 주고 저장까지 할 수 있는 서비스입니다. 재료는 직접 입력하거나 **사진 / 영수증 촬영**으로 간편하게 추가할 수 있습니다. 모바일 우선(mobile-first)으로 설계된 **PWA**로, 홈 화면에 설치해 앱처럼 사용할 수 있습니다.

🔗 **배포 주소:** https://hurr-cook-client.vercel.app
🎨 **디자인:** [Figma – Hurr Cook](https://www.figma.com/design/WP9HnJJx1nY06pX6dYl7Zj/Hurr-Cook?node-id=15-22)

---

## ✨ 주요 기능

- **카카오 소셜 로그인** — OAuth 인가 코드 방식으로 로그인하고, 최초 로그인 시 온보딩(사용자 정보 입력) 플로우로 이동
- **냉장고 재료 관리** — 보유 재료를 카드 형태로 등록·수정·삭제
- **사진 / 영수증으로 재료 추가** — 카메라·이미지 업로드로 재료를 인식해 자동 등록
- **AI 레시피 챗봇** — 채팅으로 원하는 요리를 물어보면 보유 재료 기반 레시피를 추천, 사용한 재료 안내 배너 표시
- **레시피 저장 & 관리** — 추천받은 레시피를 저장하고 상세 조회·수정·삭제(CRUD)
- **PWA 지원** — 서비스워커 기반 오프라인 캐싱 및 홈 화면 설치, 자동 업데이트

---

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| **언어** | TypeScript |
| **프레임워크** | React 19 |
| **빌드 도구** | Vite 7 |
| **라우팅** | React Router DOM 7 |
| **서버 상태** | TanStack Query (React Query) 5 |
| **클라이언트 상태** | Zustand 5 |
| **HTTP 통신** | Axios |
| **스타일링** | Tailwind CSS 4 |
| **애니메이션** | Framer Motion |
| **폰트** | Pretendard |
| **PWA** | vite-plugin-pwa (Workbox) |
| **코드 품질** | ESLint · Prettier · Husky |
| **배포** | Vercel |

---

## 🎨 디자인 토큰

Tailwind 테마와 CSS 변수로 정의된 브랜드 색상입니다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--color-main` | `#FF8800` | 메인 (주황) |
| `--color-text-light` | `#484848` | 밝은 텍스트 |
| `--color-text-dark` | `#212121` | 어두운 텍스트 |
| `--color-card-border-light` | `#DDDDDD` | 카드 테두리 |
| `--color-card-dark` | `#F0F0F0` | 카드 배경 |
| `--color-logout` | `#FF3300` | 로그아웃 강조 |

---

## 📁 프로젝트 구조

```
src/
├─ apis/            # API 요청 함수 (recipeApi, upload)
│  └─ axiosInstance.ts   # 공용 Axios 인스턴스 + 토큰 재발급 인터셉터
├─ assets/          # 아이콘·이미지 (SVG/PNG)
├─ components/
│  ├─ chat/         # 챗봇 UI (메시지, 레시피 카드, 배너 등)
│  ├─ common/       # 공용 컴포넌트 (버튼, 재료 카드/리스트, 모달)
│  ├─ header/       # 헤더·사이드바·설정/카메라 모달
│  ├─ layout/       # AppLayout, 온보딩 SettingLayout
│  └─ modal/        # 이미지 옵션 모달
├─ lib/             # axios(VITE_API_URL 사용), auth 유틸
├─ pages/
│  ├─ splash/       # 스플래시 화면
│  ├─ login/        # 로그인 · 카카오 콜백
│  ├─ userinfo/     # 온보딩 사용자 정보 입력 (1~4)
│  ├─ refrigerator/ # 냉장고, 재료 추가(직접/사진)
│  ├─ chat/         # AI 챗봇
│  ├─ recipe/       # 레시피 목록·상세·수정
│  ├─ loading/      # 로딩 / 영수증 로딩 화면
│  └─ fail/         # 실패 화면
├─ routes/          # RequireAuth (인증 가드)
├─ App.tsx          # 라우팅 정의
└─ main.tsx         # 진입점
```

---

## 🚀 시작하기

### 요구 사항
- Node.js 18 이상 권장
- npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/HurrCook/hurr-cook-client.git
cd hurr-cook-client

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포매팅 |

---

## 🔑 환경 변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_KAKAO_REST_KEY=발급받은_카카오_REST_API_키
VITE_API_URL=백엔드_API_주소   # lib/axios.ts에서 사용
```

> 카카오 로그인 리다이렉트 URI는 카카오 개발자 콘솔에 등록한 값과 일치해야 합니다.

---

## 🌐 API 연동

- 공용 API는 `axiosInstance`를 통해 `/api` 경로로 호출하며, **Vercel rewrites 프록시**로 백엔드에 전달됩니다 (`vercel.json` 참고).
- 요청 시 `localStorage`/`sessionStorage`의 `accessToken`을 `Authorization: Bearer` 헤더로 자동 첨부합니다.
- `401` 응답 시 `refreshToken`으로 토큰을 재발급(`/api/auth/reissuance`)하고 원 요청을 재시도하며, 실패하면 로그인 페이지로 이동합니다.

주요 엔드포인트: `/auth/kakao/callback`, `/auth/reissuance`, `/recipes`(CRUD), `/chats`, `/ingredients/upload`

---

## 🧭 라우팅 개요

| 경로 | 화면 | 접근 |
| --- | --- | --- |
| `/` | 스플래시 | 공개 |
| `/login`, `/login/callback` | 로그인 · 카카오 콜백 | 공개 |
| `/userinfopage1` ~ `4` | 온보딩(사용자 정보) | 인증 필요 |
| `/refrigerator` | 냉장고(재료 관리) | 인증 필요 |
| `/refrigerator/add`, `/photo-add` | 재료 추가(직접/사진) | 인증 필요 |
| `/chat` | AI 챗봇 | 인증 필요 |
| `/recipe` | 레시피 | 인증 필요 |
| `/loading`, `/receipt-loading`, `/fail` | 로딩·실패 | 인증 필요 |
| `*` | `/`로 리다이렉트 | — |

인증이 필요한 라우트는 `RequireAuth`가 토큰 존재 여부를 확인하고, 없으면 `/login`으로 리다이렉트합니다.

---

## 📦 배포

Vercel로 배포되며, SPA 라우팅과 백엔드 API 프록시는 `vercel.json`에서 관리됩니다.

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "http://<backend-host>:8080/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

_이 README는 저장소 코드 분석을 기반으로 작성되었습니다._

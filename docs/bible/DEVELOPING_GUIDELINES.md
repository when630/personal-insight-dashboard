# 📖 P.I.D 개발 지침서 (Developer Bible)

본 문서는 **Personal Insight Dashboard (P.I.D)** 프로젝트의 원활하고 일관된 구현을 위해, 나와 같은 AI 어시스턴트(또는 개발자)가 코딩 및 아키텍처 설계 시 **반드시 지켜야 할 원칙들**을 정리한 바이블입니다.

이 지침은 `docs/plan/PROJECT_PLAN_PID_v1.3.md` 문서에 기반합니다.

---

## 1. ⚙️ 코어 규칙 (Core Rules)

1. **지정된 기술 스택 고수:**
   - 프론트엔드: **Next.js 14+ (App Router)** + **Tailwind CSS** + **TanStack Query**
   - 백엔드 / DB / 인증: **Supabase**
   - AI 연동: **OpenAI API / Vercel AI SDK**

2. **모든 언어 및 주석, 문서는 한국어(Korean)로 작성:**
   - 특별한 코드 컨벤션(영어 네이밍)을 제외한 모든 문서, PR 제목, 주석, AI 응답은 한국어를 기본으로 합니다.

3. **기획의 2대 가치 준수:**
   - **Glanceability (한눈에 파악):** 메인 화면(`/`)은 항상 Bento Grid 기반으로 요약된 정보를 스크롤 없이 보여주도록 디자인합니다.
   - **Expandability (확장성):** 상세 정보를 볼 때는 반드시 사이드바 라우팅을 통해 독립된 전체 화면 페이지(Full-screen view)로 제공합니다.

---

## 2. 📁 폴더 구조 및 아키텍처 규칙

Next.js의 라우트 그룹 기능을 활용하여 일관된 레이아웃을 제공합니다.

1. **사이드바 유무에 따른 분리:**
   - `(main)`: `<Sidebar />`가 포함되는 메인 콘텐츠 레이아웃입니다. (대시보드 `/`, 캘린더 상세 `/calendar`, 뉴스 상세 `/news`, 챗봇 상세 `/chat` 등)
   - `(auth)`: 로그인 페이지(`/login`) 등 사이드바가 보이지 않는 화면입니다.

2. **서버 사이드 API (BFF 패턴):**
   - 써드파티 통신(Google Calendar API, 날씨 API 등)이나 AI 라우트 핸들러 통신은 클라이언트(브라우저)에서 직접 호출하지 않고, **Next.js의 `/api` 폴더 내에 API Routes를 두어 프록시 역할**을 하게 합니다.

3. **역할별 디렉토리 분리:**
   - 레이아웃 및 뷰 단위 UI: `/components` 내부에 관리 (`/layout`, `/dashboard`, `/ui` 분리)
   - 데이터 Fetching 훅: `/hooks` (예: `useCalendar.ts`, `useAuth.ts`)
   - 공통 함수/연결: `/lib` (예: `supabase.ts`, `utils.ts`)
   - 타입 파일 관리: 도메인별 타입은 반드시 `/types` 디렉토리 내에 명시합니다.

---

## 3. 🔐 인증 및 보안 (Auth & Security) 규칙

가장 중요하고 실수하기 쉬운 핵심 파트입니다. 해당 내용을 구현할 때 철저하게 점검해야 합니다.

1. **Google OAuth & Scope 요청:**
   - 로그인 수단은 Supabase의 Google 소셜 로그인을 사용합니다.
   - 로그인 요청 시, 반드시 **Google Calendar 읽기 권한(Scope)**을 함께 요청해야 합니다. 
     - *요청 Scope: `https://www.googleapis.com/auth/calendar.readonly`*

2. **Google Access Token (`provider_token`) 관리:**
   - 서버사이드 API 통신을 위해 유저 로그인 성공 및 세션 유지 시 반환되는 `provider_token`을 안전하게 관리하고 확보해야 합니다.
   - 캘린더 일정을 조회할 때는 이 토큰을 헤더에 담아 통신합니다.

3. **Row Level Security (RLS) 정책 필수 적용:**
   - Supabase의 DB 테이블(예: 할 일 `todos` 테이블, 챗봇 대화 기록 테이블)에는 반드시 RLS 정책을 설정하여 타인의 데이터에 접근하지 못하도록 합니다.
   - *정책 원칙: `auth.uid() = user_id`*

---

## 4. 🚀 도메인별 특화 가이드

- **🤖 AI 챗봇 (`/chat` & 위젯):**  
  대시보드 메인의 챗봇 위젯과 챗봇 상세 페이지를 분리하여 구현하되, 두 개는 연결된 컨텍스트를 가질 수 있게 설계합니다. Vercel AI SDK의 `useChat` 훅을 활용하여 스트리밍 처리를 구현합니다.
- **📅 캘린더 (`/calendar`):**  
  `react-big-calendar` 등의 라이브러리를 활용하되 풀스크린 UI를 갖춰야 합니다.
- **✅ 할 일 (To-Do):**  
  낙관적 업데이트(Optimistic Updates)를 적용하고, 상호작용 성공 시 토스트 알림 라이브러리(Sonner 등)를 통해 피드백을 주어야 합니다.

이 지침(Bible)은 프로젝트가 진행됨에 따라 수정 또는 보완될 수 있으며, 새로운 기능 개발에 앞서 언제든 참고해야 하는 진실의 원천(Source of Truth)입니다.

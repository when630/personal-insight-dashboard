# 📋 PROJECT PLAN: Personal Insight Dashboard (P.I.D)

**작성일:** 2026. 02. 17  
**버전:** v1.3 (금융 기능 제거 및 AI 챗봇 추가)  
**작성자:** Project Owner (Senior Planner)  
**프로젝트 목표:** 흩어진 일상 정보(날씨, 일정, 뉴스, AI 어시스턴트)를 한눈에 파악하고, 필요시 깊이 있게 탐색할 수 있는 개인화 대시보드 구축

---

## 1. 개요 (Overview)

### 1.1 기획 의도
현대인은 하루 시작과 동시에 수많은 정보를 확인해야 합니다. 
본 프로젝트는 핵심 정보를 **'메인 대시보드(Bento Grid)'**에서 1초 만에 파악하고, 더 자세한 정보가 필요할 때는 **'좌측 사이드바'**를 통해 상세 페이지로 진입하여 깊이 있는 작업(Deep Dive)을 수행할 수 있도록 돕습니다.

### 1.2 핵심 가치 (Core Values)
1. **Glanceability (한눈에 파악):** 메인 화면에서는 스크롤 없이 핵심 요약 정보만 제공.
2. **Expandability (확장성):** 사이드바 라우팅을 통해 각 모듈(캘린더, AI 챗봇 등)의 상세 뷰 제공.
3. **Seamless Integration (매끄러운 연동):** 구글 캘린더 등 외부 서비스와의 완벽한 권한 동기화.

---

## 2. 기술 스택 (Tech Stack)

### 2.1 Frontend & Backend (Next.js + Supabase)
| 구분 | 기술 (Technology) | 비고 |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | SSR, API Routes, Route Groups 활용 |
| **Styling** | **Tailwind CSS** | Grid 레이아웃 및 다크모드 대응 |
| **Data Fetching** | **TanStack Query** | 서버 상태 캐싱 및 리패칭 |
| **BaaS & Auth** | **Supabase** | DB, Auth(Google OAuth), RLS |
| **AI Integration** | **OpenAI API / Vercel AI SDK** | 대화형 AI 챗봇 어시스턴트 기능 구현 용도 |

---

## 3. UI/UX 디자인 가이드

### 3.1 레이아웃 컨셉: Sidebar + Bento Grid
화면을 크게 **네비게이션 영역**과 **콘텐츠 영역**으로 분리합니다.

* **좌측 사이드바 (Navigation Rail):** * 접기/펴기(Collapsible)가 가능한 미니멀한 세로형 메뉴바.
  * 메뉴 구성: 홈(대시보드), 캘린더 상세, AI 챗봇, 뉴스 상세, 할 일 목록, 설정.
* **우측 메인 콘텐츠:**
  * **홈 (`/`):** 3~4개 컬럼의 벤토 그리드(Bento Grid) 형태. (요약 정보 및 AI 퀵 챗)
  * **상세 페이지 (`/calendar`, `/chat` 등):** 단일 주제에 집중한 풀스크린 뷰.

---

## 4. 기능 명세 (Functional Requirements)

### 4.1 👤 인증 및 권한 (Auth & Scopes) - 💡 핵심 사항
* **기능:** Supabase를 통한 Google 소셜 로그인.
* **데이터 접근 권한 (Scope):** * 로그인 시 반드시 **Google Calendar 읽기 권한**을 요청해야 함.
  * 요청 Scope: `https://www.googleapis.com/auth/calendar.readonly`
* **토큰 관리:** * 로그인 성공 시 발급되는 `provider_token`을 세션에 저장하여, 이후 캘린더 API 호출 시 활용.

### 4.2 📅 캘린더 & 일정 (Calendar)
* **메인 대시보드 (위젯):** 오늘 하루의 타임라인 및 다가오는 일정 요약.
* **상세 페이지 (`/calendar`):** * 전체 화면 월간/주간 캘린더 (react-big-calendar 등 활용).
  * 드래그 앤 드롭 일정 확인 및 구글 캘린더 데이터 동기화.

### 4.3 🤖 AI 챗봇 (AI Assistant)
* **메인 대시보드 (위젯):** 간단한 질문 및 답변이 가능한 미니 챗봇 입력창.
* **상세 페이지 (`/chat`):** * 전체 화면 대화형 AI 채팅 인터페이스.
  * 이전 대화 내역(History) 저장 및 불러오기 (Supabase 연동).
  * 캘린더나 날씨 등 대시보드 데이터와 연계된 컨텍스트 질문 가능.

### 4.4 📰 뉴스 및 ☀ 날씨
* **날씨 (메인 전용):** 현재 위치 기반 기온, 날씨 아이콘, 습도. (상세 페이지 없음)
* **뉴스 메인 (위젯):** 설정한 키워드의 헤드라인 롤링.
* **뉴스 상세 (`/news`):** 분야별(IT, 경제 등) 전체 기사 리스트 및 스크랩 기능.

### 4.5 ✅ 할 일 (To-Do)
* **기능:** Supabase `todos` 테이블과 직접 통신 (RLS 정책 적용 필수: `auth.uid() = user_id`).
* **동작:** 간단한 CRUD 및 완료 처리 시 토스트 알림(Sonner) 발생.

---

## 5. 디렉토리 구조 (Directory Structure)

Route Group(`(main)`)을 활용하여 사이드바가 표시되는 영역과 표시되지 않는 영역(로그인 등)을 구분합니다.

```text
/
├── middleware.ts                  # Auth 세션 및 보호 라우트 관리
├── .env.local.example             # 환경 변수 템플릿
│
├── /app
│   ├── layout.tsx                 # 루트 레이아웃 (Providers 적용)
│   │
│   ├── (main)                     # 🌟 사이드바가 포함되는 메인 라우트 그룹
│   │   ├── layout.tsx             # <Sidebar /> 컴포넌트 포함
│   │   ├── page.tsx               # 홈 (대시보드 벤토 그리드)
│   │   ├── calendar/page.tsx      # 캘린더 상세 페이지
│   │   ├── chat/page.tsx          # AI 챗봇 상세 페이지
│   │   ├── news/page.tsx          # 뉴스 상세 페이지
│   │   └── settings/page.tsx      # 사용자 설정 페이지
│   │
│   ├── (auth)                     # 사이드바가 없는 라우트 그룹
│   │   └── login/page.tsx         # 구글 로그인 페이지
│   │
│   ├── /api                       # 서버 사이드 API Routes (BFF)
│   │   ├── /calendar/route.ts     # 구글 캘린더 프록시 (provider_token 사용)
│   │   ├── /weather/route.ts
│   │   └── /chat/route.ts         # AI 챗봇 스트리밍 등 API 핸들러
│   │
│   ├── /components
│   │   ├── /layout                # Sidebar, Header, PageContainer
│   │   ├── /dashboard             # 메인 화면 전용 위젯 (WeatherCard 등)
│   │   └── /ui                    # 공통 UI (Button, Input 등)
│   │
│   ├── /lib                       # supabase.ts, utils.ts
│   ├── /hooks                     # useAuth.ts, useCalendar.ts 등
│   └── /types                     # 도메인별 타입 정의
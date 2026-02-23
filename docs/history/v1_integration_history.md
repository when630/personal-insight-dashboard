# Personal Insight Dashboard (P.I.D) - v1.0 기능 구현 및 연동 히스토리

본 문서는 P.I.D 대시보드의 초기 핵심 기능(AI 챗봇, 캘린더, 날씨, 뉴스) 구현 및 외부 API 실시간 연동 작업의 내역을 요약한 기록입니다.

## 1. AI 어시스턴트 (Gemini 기반) 및 채팅 기록 영속화
- **API 연동**: Vercel AI SDK 및 `@ai-sdk/google` (`gemini-2.5-flash` 모델) 연동 파이프라인(`app/api/chat/route.ts`) 구축.
- **DB 연동**: Supabase에 `chat_messages` 테이블을 생성하여, RLS 정책 기반 하에 각 유저별 AI 대화 기록을 안전하게 저장.
- **프론트엔드 UI**:
  - `/chat` 상세 페이지: 전체 화면 채팅을 통해 AI 비서와 깊이 있는 대화 지원.
  - `AIAssistantWidget`: 대시보드 내 삽입된 미니 챗봇 폼으로 실시간 요약 및 응답 표출.
- **해결한 이슈**: Vercel AI 버전 충돌 및 스트림 응답(`toDataStreamResponse`) 렌더링 에러 해결.

## 2. Google Calendar 실시간 연동
- **Auth 연동**: 사용자 소셜 로그인(Google OAuth) 과정에서 `calendar.readonly` scope 권한을 요청하고, 발급받은 `provider_token`을 HttpOnly 쿠키에 저장하도록 콜백(`app/auth/callback/route.ts`) 개선.
- **API 연동**: 해당 쿠키 토큰을 이용해 구글 서버에서 다가올 30일 치 일정을 파싱해오는 `app/api/calendar/route.ts` 구현.
- **프론트엔드 UI**:
  - `CalendarWidget`: 대시보드에서 최근 일정 4개 즉시 열람 및 권한 안내(에러) 상태 대응.
  - `/calendar`: `react-day-picker` 기반의 전체 달력 달력과, 우측에 선택 일자의 스케줄 타임라인을 제공하는 확장 페이지 구성.

## 3. 실시간 날씨 연동 (Open-Meteo API)
- **API 연동**: 별도의 API 키 발급이 필요 없도록 무료 공개된 Open-Meteo의 날씨 API를 연동하는 서버 라우터(`app/api/weather/route.ts`) 구축.
- **프론트엔드 UI (`WeatherWidget`)**:
  - 서버에서 받은 위경도 기반 현재 기온, 습도, 풍속, 체감 온도 표시.
  - Open-Meteo의 고유 `weather_code`를 분석해 맑음, 비, 안개, 번개 등 상황에 맞는 Lucide React 아이콘 지원.

## 4. 실시간 주요 뉴스 연동 (Google News RSS)
- **API 연동**: `rss-parser` 패키지를 도입해 한국 구글 뉴스의 XML RSS 피드(`https://news.google.com/rss`)를 JSON 배열로 가공하는 서버 라우트(`app/api/news/route.ts`) 구축.
- **프론트엔드 UI**:
  - `NewsWidget`: 대시보드에 최신 헤드라인 트렌드 5개 출력.
  - `/news`: 총 15개의 기사 목록을 카드 배열 뷰로 보여주는 실시간 뉴스 탐색 페이지 구성. 기사 게재 시간과 매체명 표시.

## 5. UI/UX 및 반응형(Responsive) 레이아웃 최적화
- 대시보드의 Bento Grid 시스템 (`app/(main)/page.tsx`) 내 위젯 간 불필요한 빈 공간이 발생하지 않도록 Col/Row Span 값 및 `h-full`, `min-h` 속성 일괄 정비.
- 서브 페이지들 간의 강제 `100vh` 높이 지정으로 인해 발생하던 하단 스크롤 겹침 현상을 `flex-1` 기반 높이 확보 구조로 전면 수정하여 모바일 환경 대응.

---
**마지막 업데이트**: 2026-02-23

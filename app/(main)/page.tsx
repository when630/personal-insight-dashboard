import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // 서버 컴포넌트에서 쿠키 속성으로 Supabase 클라이언트 획득
  const supabase = await createClient();

  // 사용자 인증 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen p-8 bg-background">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대시보드 (Bento Grid)</h1>
          <p className="text-muted-foreground mt-1">
            환영합니다, {user.email}님!
          </p>
        </div>
        <form action="/auth/signout" method="post">
          {/* 로그아웃 액션 연동 준비 */}
          <Button variant="secondary">로그아웃</Button>
        </form>
      </header>

      <main className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* 추후 위젯들(캘린더, 날씨, 챗봇 등)이 위치할 기본 그리드입니다 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 col-span-2 row-span-2">
          <h2 className="font-semibold mb-2">오늘의 일정 요약</h2>
          <p className="text-sm text-muted-foreground">캘린더 데이터 연동 필요</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="font-semibold mb-2">날씨</h2>
          <p className="text-sm text-muted-foreground">날씨 API 연동 필요</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="font-semibold mb-2">AI 챗봇</h2>
          <p className="text-sm text-muted-foreground">빠른 질문하기</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <h2 className="font-semibold mb-2">주요 뉴스</h2>
          <p className="text-sm text-muted-foreground">최신 헤드라인 제공 예정</p>
        </div>
      </main>
    </div>
  );
}

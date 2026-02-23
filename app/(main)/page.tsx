import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { AIAssistantWidget } from "@/components/dashboard/AIAssistantWidget";
import { NewsWidget } from "@/components/dashboard/NewsWidget";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 사용자 인증 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 이메일에서 이름 부분만 추출 (예: test@a.com -> test)
  const username = user.email?.split('@')[0] || "사용자";

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 bg-background">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            환영합니다, <span className="font-semibold text-foreground">{username}</span>님! 오늘도 생산적인 하루 되세요.
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">로그아웃</span>
          </Button>
        </form>
      </header>

      {/* Bento Grid 메인 컨테이너 */}
      <main className="grid flex-1 gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-max">
        {/*
          1. 캘린더 위젯: 기본 2칸 너비, 2칸 높이 유지
          2. 날씨 위젯: 1칸
          3. 주요 뉴스 위젯: 기본 1칸 (모바일에선 2칸)
          4. AI 챗봇 위젯: 넓게 2칸
        */}
        <CalendarWidget />
        <WeatherWidget />
        <NewsWidget />
        <AIAssistantWidget />
      </main>
    </div>
  );
}

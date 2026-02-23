import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-row h-screen overflow-hidden">
        {/* 사이드바 영역: 모바일은 일단 숨기고 PC에서 좌측 고정 플렉스 */}
        <Sidebar />

        {/* 메인 콘텐츠(대시보드 등) 영역 */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

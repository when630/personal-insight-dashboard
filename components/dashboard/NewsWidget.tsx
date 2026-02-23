import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export function NewsWidget() {
  const mockNews = [
    { id: 1, title: "Next.js 15 출시, 서버 컴포넌트 성능의 진화", time: "1시간 전", category: "IT" },
    { id: 2, title: "금리 인하 기대감 확산... 코스피 2700선 돌파", time: "3시간 전", category: "경제" },
    { id: 3, title: "주말 나들이객 몰려 주요 고속도로 정체 극심", time: "4시간 전", category: "사회" }
  ];

  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-indigo-500" />
          실시간 주요 뉴스
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 mt-2">
          {mockNews.map((news) => (
            <li key={news.id} className="flex flex-col gap-1 border-b last:border-0 pb-3 last:pb-0 group cursor-pointer">
              <span className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {news.title}
              </span>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-semibold text-indigo-500">{news.category}</span>
                <span>{news.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

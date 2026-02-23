import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

export function CalendarWidget() {
  const mockEvents = [
    { id: 1, title: "주간 프론트엔드 미팅", time: "10:00 AM", type: "업무" },
    { id: 2, title: "치과 예약", time: "02:30 PM", type: "개인" },
    { id: 3, title: "기획안 마감", time: "06:00 PM", type: "중요" },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          오늘의 일정
        </CardTitle>
        <span className="text-xs text-muted-foreground font-medium">3개 예정</span>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4 mt-2">
          {mockEvents.map((event) => (
            <div key={event.id} className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{event.title}</p>
                <div className="flex items-center text-xs text-muted-foreground pt-1">
                  <Clock className="mr-1 h-3 w-3" />
                  {event.time}
                </div>
              </div>
              <Badge variant={event.type === '중요' ? 'destructive' : 'secondary'} className="text-[10px]">
                {event.type}
              </Badge>
            </div>
          ))}
          {/* 빈 상태 대비 가이드 */}
          {mockEvents.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              오늘 예정된 일정이 없습니다.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

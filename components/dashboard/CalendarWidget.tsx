"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  endTime?: string;
  type: string;
  link?: string;
}

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/calendar');
        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            setError('권한필요');
          } else {
            setError('서버에러');
          }
          return;
        }

        const data = await res.json();
        // 오늘 해당하는 일정만 필터링하거나 최대 4개까지만 표시 (여기선 상온 4개 자름)
        // 구글 캘린더 API에서 최신 순 정리되어 내려온다고 가정
        setEvents((data.events || []).slice(0, 4));
      } catch (err) {
        setError('에러발생');
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

  // 표시용 시간 포맷 함수
  const formatEventTime = (timeString: string) => {
    if (!timeString) return "시간 미정";
    // T가 포함되지 않은 날짜 형태(YYYY-MM-DD)는 종일 일정
    if (!timeString.includes('T')) return "종일";

    try {
      const date = new Date(timeString);
      return format(date, 'a h:mm', { locale: ko });
    } catch {
      return "시간 오류";
    }
  };

  const getEventDateText = (timeString: string) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      if (isToday(date)) return "오늘";
      return format(date, 'M.d(E)', { locale: ko });
    } catch {
      return "";
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-2 row-span-2 flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          다가오는 일정
        </CardTitle>
        {!loading && !error && (
          <span className="text-xs text-muted-foreground font-medium">{events.length}개 예정</span>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4 mt-2">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">구글 캘린더 일정을 불러오는 중...</p>
            </div>
          )}

          {error === '권한필요' && !loading && (
            <div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground gap-3">
              <AlertCircle className="h-8 w-8 text-destructive/50" />
              <p className="text-sm font-medium">구글 캘린더 권한이 필요합니다.</p>
              <p className="text-[11px] max-w-xs break-keep">로그아웃 후 재생성 화면에서 권한을 수락해주세요.</p>
              <form action="/auth/signout" method="post" className="w-full mt-1 px-4">
                <Button variant="outline" size="sm" className="w-full text-xs" type="submit">
                  다시 로그인하기
                </Button>
              </form>
            </div>
          )}

          {error && error !== '권한필요' && !loading && (
            <div className="text-center text-sm text-destructive py-8">
              일정을 불러오지 못했습니다. 다시 시도해 주세요.
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-10 flex flex-col items-center justify-center gap-2">
              <CalendarDays className="h-8 w-8 text-muted/50" />
              최근 예정된 일정이 없습니다.
            </div>
          )}

          {!loading && !error && events.map((event) => (
            <div key={event.id} className="flex items-start justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors group">
              <div className="space-y-1 overflow-hidden pr-2">
                <p className="text-sm font-medium leading-none truncate" title={event.title}>
                  {event.title}
                </p>
                <div className="flex items-center text-xs text-muted-foreground pt-1 gap-2">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="font-semibold text-primary/80 mr-1.5">
                      {getEventDateText(event.time)}
                    </span>
                    {formatEventTime(event.time)}
                  </span>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-indigo-500 hover:underline">
                      <ExternalLink className="h-3 w-3 mr-0.5" />보기
                    </a>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0 whitespace-nowrap">
                {event.type}
              </Badge>
            </div>
          ))}

          {!loading && !error && events.length > 0 && (
            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary mt-2" asChild>
              <Link href="/calendar">모든 일정 보기</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

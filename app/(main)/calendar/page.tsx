"use client";

import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarDays, ExternalLink, Loader2, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  endTime?: string;
  location?: string;
  description?: string;
  type: string;
  link?: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
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
        setEvents(data.events || []);
      } catch (err) {
        setError('에러발생');
      } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, []);

  // 선택된 날짜의 일정 필터링
  const selectedDateEvents = events.filter((event) => {
    if (!date || !event.time) return false;
    const eventDate = new Date(event.time);
    return isSameDay(eventDate, date);
  });

  const formatEventTime = (timeString: string) => {
    if (!timeString.includes('T')) return "종일";
    return format(new Date(timeString), 'a h:mm', { locale: ko });
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 bg-background">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">캘린더</h1>
        <p className="text-muted-foreground mt-1">Google Calendar와 동기화된 일정을 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0 w-full flex justify-center"
              locale={ko}
              modifiers={{
                hasEvent: (testDate) =>
                  events.some(e => isSameDay(new Date(e.time), testDate))
              }}
              modifiersStyles={{
                hasEvent: { fontWeight: 'bold', color: 'hsl(var(--primary))', textDecoration: 'underline' }
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {date ? format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko }) : '날짜 선택됨'}
              </span>
              <Badge variant="secondary">{selectedDateEvents.length}개 일정</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-4 md:p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>일정 동기화 중...</p>
              </div>
            )}

            {error === '권한필요' && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4">
                <AlertCircle className="h-10 w-10 text-destructive/50" />
                <div>
                  <p className="font-medium text-foreground text-lg mb-1">권한이 필요합니다</p>
                  <p className="text-sm max-w-sm">
                    구글 캘린더 일정을 가져오기 위해서는 앱에 권한을 부여해야 합니다.<br />
                    로그아웃 후 권한 동의와 함께 다시 로그인해 주세요.
                  </p>
                </div>
                <form action="/auth/signout" method="post">
                  <Button type="submit">로그아웃 및 재인증</Button>
                </form>
              </div>
            )}

            {error && error !== '권한필요' && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-destructive gap-2">
                <AlertCircle className="h-8 w-8" />
                <p>일정을 가져오는 중 오류가 발생했습니다.</p>
              </div>
            )}

            {!loading && !error && selectedDateEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <CalendarDays className="h-12 w-12 text-muted/30" />
                <p className="text-lg font-medium text-foreground">일정 없음</p>
                <p className="text-sm">선택하신 날짜에 등록된 일정이 없습니다.</p>
              </div>
            )}

            {!loading && !error && selectedDateEvents.length > 0 && (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h3 className="font-semibold text-lg leading-tight">{event.title}</h3>
                      {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="shrink-0 group">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            구글 캘린더 <ExternalLink className="ml-1.5 h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                          </Button>
                        </a>
                      )}
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground mt-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-primary/70" />
                        <span className="font-medium text-foreground">
                          {formatEventTime(event.time)}
                          {event.endTime && event.endTime !== event.time && ` ~ ${formatEventTime(event.endTime)}`}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{event.location}</span>
                        </div>
                      )}

                      {event.description && (
                        <div className="mt-2 text-xs bg-muted/40 p-3 rounded-md line-clamp-3 leading-relaxed">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

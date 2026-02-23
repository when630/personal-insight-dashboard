"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  publisher: string;
}

export function NewsWidget() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        // 대시보드 위젯에서는 간략히 5~6개만 표시
        setNewsList((data.news || []).slice(0, 5));
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // RSS 날짜 텍스트를 상대 시간으로 바꾸는 유틸리티
  const getRelativeTime = (dateString: string) => {
    try {
      const pubDate = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - pubDate.getTime()) / 1000 / 60);

      if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    } catch {
      return "";
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-1 flex flex-col h-[400px]">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-indigo-500" />
          실시간 주요 뉴스
        </CardTitle>
        {!loading && !error && newsList.length > 0 && (
          <Link href="/news">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
              더보기
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto px-6 pb-5">
        <ul className="space-y-4 mt-2 h-full">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2 h-full">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-sm">뉴스를 불러오는 중...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground gap-2 h-full">
              <AlertCircle className="h-8 w-8 text-destructive/50" />
              <p className="text-sm">뉴스를 불러오지 못했습니다.</p>
            </div>
          )}

          {!loading && !error && newsList.map((news) => (
            <li key={news.id} className="flex flex-col gap-1.5 border-b last:border-0 pb-3 last:pb-0 group cursor-pointer">
              <a href={news.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                <span className="text-sm font-medium leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2">
                  {news.title}
                </span>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1.5">
                  <span className="font-semibold text-indigo-500/80">{news.publisher}</span>
                  <span>{getRelativeTime(news.pubDate)}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Loader2, AlertCircle, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  publisher: string;
  contentSnippet?: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 bg-background">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
            최신 뉴스
          </h1>
          <p className="text-muted-foreground mt-2">
            Google News 기반의 실시간 주요 헤드라인 기사들을 모아봅니다.
          </p>
        </div>
        {!loading && !error && (
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
            전체 {news.length}건
          </Badge>
        )}
      </header>

      <main className="flex-1 w-full max-w-5xl">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-medium">실시간 뉴스를 불러오는 중...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground gap-4">
            <AlertCircle className="h-12 w-12 text-destructive/50" />
            <div>
              <p className="text-lg font-medium text-foreground mb-1">뉴스를 불러오지 못했습니다.</p>
              <p className="text-sm">잠시 후 다시 시도해 주세요.</p>
            </div>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center gap-3">
            <Newspaper className="h-12 w-12 text-muted/30" />
            <p className="text-lg font-medium">최신 뉴스가 없습니다.</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full border-primary/10">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="font-semibold text-primary/80">
                      {item.publisher}
                    </Badge>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {getRelativeTime(item.pubDate)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>

                  {item.contentSnippet && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {item.contentSnippet}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground/70" title={formatDate(item.pubDate)}>
                      {formatDate(item.pubDate)}
                    </span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs w-full sm:w-auto mt-2 sm:mt-0 shadow-sm border-primary/20 hover:bg-primary/5">
                        기사 원문 읽기 <ExternalLink className="ml-1.5 h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

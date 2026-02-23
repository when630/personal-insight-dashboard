"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Sparkles, Bot, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AIAssistantWidget() {
  const { messages, setMessages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // 최초 로드시 최근 메시지 불러오기
  useEffect(() => {
    async function fetchMessages() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10); // 위젯에서는 최근 10개의 대화만 표시

      if (data && data.length > 0) {
        setMessages(data.reverse().map((msg: any) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        })));
      }
    }
    fetchMessages();
  }, [setMessages, supabase]);

  // 새로운 메시지가 추가될 때마다 스크롤 아래로 고정
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col h-full min-h-[400px] lg:min-h-0 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
      <CardHeader className="pb-2 pt-5 px-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 어시스턴트
        </CardTitle>
        <Link href="/chat">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
            전체 화면 <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 overflow-hidden p-0 px-6 pb-5 gap-3 mt-1">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollRef}>
          <div className="flex flex-col gap-3 pb-2 pt-1">
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground flex flex-col items-center justify-center h-full min-h-[180px] text-center gap-2">
                <Bot className="h-8 w-8 text-primary/40 mb-1" />
                <span>무엇이든 물어보세요!<br />일정 확인이나 정보 탐색이 가능합니다.</span>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`px-3 py-2 text-sm rounded-xl max-w-[85%] break-words whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'
                    }`}>
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {/* 로딩 애니메이션 */}
            {isLoading && (
              <div className="flex gap-2 justify-start items-center text-muted-foreground">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="flex space-x-1 px-3 py-2 bg-muted rounded-xl rounded-tl-sm">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form className="flex w-full items-center space-x-2 pt-3 border-t shrink-0" onSubmit={handleSubmit}>
          <Input
            value={input || ""}
            onChange={handleInputChange}
            placeholder="예: 오늘 중요한 일정이 뭐야?"
            className="flex-1 h-10 text-sm focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={isLoading || !(input || "").trim()}>
            <MessageSquareText className="h-4 w-4" />
            <span className="sr-only">전송</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

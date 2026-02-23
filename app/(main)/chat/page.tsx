"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-8 bg-background">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI 비서</h1>
          <p className="text-muted-foreground mt-1">
            Gemini 기술이 탑재된 P.I.D 어시스턴트와 대화해보세요.
          </p>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
        <Card className="flex-1 flex flex-col shadow-sm overflow-hidden border-primary/20">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              대화창
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4 pb-4">
                {/* 웰컴 메시지 */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center p-8 text-muted-foreground h-full min-h-[200px] gap-3">
                    <Bot className="h-12 w-12 text-primary/40 mb-2" />
                    <p className="font-medium text-foreground">안녕하세요! 무엇을 도와드릴까요?</p>
                    <p className="text-sm">"오늘의 주요 일정을 요약해줘", "최신 IT 뉴스 알려줘" 등 질문을 입력해보세요.</p>
                  </div>
                )}

                {/* 채팅 메시지 목록 */}
                {messages.map((m: { id: string, role: string, content: string }) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role !== 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}

                    <div
                      className={`px-4 py-3 rounded-2xl max-w-[80%] break-words whitespace-pre-wrap ${m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                        }`}
                    >
                      {m.content}
                    </div>

                    {m.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start items-center text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div className="flex space-x-1 px-4 py-3 bg-muted rounded-2xl rounded-tl-sm">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* 채팅 입력창 */}
            <div className="p-4 border-t bg-background">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <Input
                  value={input || ""}
                  onChange={handleInputChange}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 focus-visible:ring-primary h-12 rounded-full px-5"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !(input || "").trim()}
                  className="h-12 w-12 shrink-0 rounded-full"
                >
                  <Send className="h-5 w-5 ml-1" />
                  <span className="sr-only">전송</span>
                </Button>
              </form>
              <div className="text-center mt-2 text-[10px] text-muted-foreground">
                AI는 간혹 부정확한 정보를 제공할 수 있으니 중요한 정보는 늘 교차 검증하시기 바랍니다.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

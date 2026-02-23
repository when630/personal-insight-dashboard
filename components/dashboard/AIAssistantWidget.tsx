"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AIAssistantWidget() {
  return (
    <Card className="col-span-1 md:col-span-2 xl:col-span-2 flex flex-col bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI 어시스턴트
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-end gap-3 mt-2">
        <div className="text-sm text-muted-foreground mb-1">
          무엇이든 물어보세요! 일정 확인이나 날씨 분석도 가능합니다.
        </div>
        <form className="flex w-full items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
          <Input type="text" placeholder="예: 오늘 중요한 일정이 뭐야?" className="flex-1" />
          <Button type="submit" size="icon">
            <MessageSquareText className="h-4 w-4" />
            <span className="sr-only">전송</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // 기획서의 지침에 따라 구글 캘린더 읽기 권한(scope)을 필수로 요청합니다.
        scopes: "https://www.googleapis.com/auth/calendar.readonly",
        queryParams: {
          access_type: "offline", // refresh 토큰 확보
          prompt: "consent",
        }
      },
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">P.I.D 시작하기</CardTitle>
          <CardDescription className="mt-2">
            Personal Insight Dashboard에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full h-11 text-base font-medium"
            onClick={handleGoogleLogin}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Google 계정으로 로그인
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            로그인 시, 일정 정보를 불러오기 위해 캘린더 접근 권한을 허용해 주셔야 합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

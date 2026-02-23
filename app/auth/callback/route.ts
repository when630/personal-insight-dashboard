import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 구글 로그인 성공 후 발급받은 캘린더 접근용 토큰(provider_token) 저장
      if (data.session?.provider_token) {
        const cookieStore = await cookies();
        cookieStore.set('provider_token', data.session.provider_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3500, // 보통 구글 토큰 수명은 1시간(3600초)
          path: '/',
        });
      }
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Auth Callback Error:", error.message)
    }
  }

  // 오류 발생 시 로그인 페이지로 돌아가며 에러 파라미터 전달
  return NextResponse.redirect(`${origin}/login?error=true`)
}

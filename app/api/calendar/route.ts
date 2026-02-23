import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    // 1. 로그인 인증 확인
    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 쿠키에서 provider_token 추출
    const cookieStore = await cookies();
    const providerToken = cookieStore.get('provider_token')?.value;

    if (!providerToken) {
      return NextResponse.json(
        { error: 'Calendar access token not found. Please log out and sign in with Google again to grant calendar permissions.' },
        { status: 403 }
      );
    }

    // 3. 구글 캘린더 API 기준 날짜 생성 (현재부터 +30일 데이터)
    const timeMin = new Date().toISOString();
    const timeMaxDate = new Date();
    timeMaxDate.setDate(timeMaxDate.getDate() + 30);
    const timeMax = timeMaxDate.toISOString();

    // 4. 구글 캘린더 API 호출
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true&maxResults=20`,
      {
        headers: {
          Authorization: `Bearer ${providerToken}`,
        },
        // 캐시 비활성화 (새로운 일정을 즉각 반영하기 위함)
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API fetch error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch calendar events from Google. The token might be expired.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 5. 프론트엔드가 사용하기 쉬운 형태로 정제
    const events = (data.items || []).map((item: any) => {
      // 종일 일정(date)과 시간 지정 일정(dateTime) 모두 지원
      const start = item.start?.dateTime || item.start?.date;
      const end = item.end?.dateTime || item.end?.date;

      // 제목이 없는 일정 대비
      const title = item.summary || '(제목 없음)';

      return {
        id: item.id,
        title,
        time: start,
        endTime: end,
        location: item.location || null,
        description: item.description || null,
        link: item.htmlLink,
        // 단순 분류 (추후 색상 기반이나 태그 기반 확장 가능)
        type: '기본'
      };
    });

    return NextResponse.json({ events });
  } catch (err: any) {
    console.error('Calendar Route Handler Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

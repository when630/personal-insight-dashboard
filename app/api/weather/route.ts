import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // 기본값: 서울 중심부의 위경도
    const lat = searchParams.get('lat') || '37.5665';
    const lon = searchParams.get('lon') || '126.9780';
    const locationName = searchParams.get('name') || '서울';

    // Open-Meteo API 호출 (현재 날씨, 온도, 체감온도, 습도, 풍속, 풍향 등)
    // hourly 데이터가 아닌 current 데이터만 사용하여 응답 최소화
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FSeoul`;

    const res = await fetch(url, { next: { revalidate: 1800 } }); // 30분 단위 캐싱

    if (!res.ok) {
      throw new Error(`Open-Meteo API Error: ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;

    /**
     * WMO Weather interpretation codes (WMO 날씨 코드)
     * 0: 맑음
     * 1, 2, 3: 대체로 맑음, 구름조금, 흐림
     * 45, 48: 안개
     * 51, 53, 55: 이슬비
     * 61, 63, 65: 비
     * 71, 73, 75: 눈
     * 95, 96, 99: 뇌우
     */
    let weatherCondition = '맑음';
    const code = current.weather_code;

    if (code >= 1 && code <= 3) weatherCondition = '구름 낌';
    if (code >= 45 && code <= 48) weatherCondition = '안개';
    if (code >= 51 && code <= 67) weatherCondition = '비';
    if (code >= 71 && code <= 77) weatherCondition = '눈';
    if (code >= 80 && code <= 82) weatherCondition = '소나기';
    if (code >= 95 && code <= 99) weatherCondition = '뇌우';

    return NextResponse.json({
      location: locationName,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m, // m/s 로 내려옴 (옵션에 따라 km/h일 수 있으나 기본은 km/h, 하지만 파라미터가 없으면 km/h로 옴.)
      condition: weatherCondition,
      weatherCode: code,
      isDay: current.is_day !== 0 // 현재 시간 기준 낮/밤
    });
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Droplets, Wind, CloudSun, CloudRain, Sun, CloudFog, CloudLightning, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather'); // 서버 프록시 라우트
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();

    // 30분 마다 자동 갱신
    const interval = setInterval(fetchWeather, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);

  // 날씨 상태 코드(Open-Meteo)에 따라 알맞은 Lucide 아이콘 반환
  const getWeatherIcon = (code: number, isDay: boolean, className: string = "") => {
    // 대체로 맑음/해
    if (code === 0) return isDay ? <Sun className={`text-orange-500 ${className}`} /> : <CloudSun className={`text-slate-400 ${className}`} />;
    if (code >= 1 && code <= 3) return <CloudSun className={`text-sky-400 ${className}`} />;
    // 안개/흐림
    if (code >= 45 && code <= 48) return <CloudFog className={`text-slate-400 ${className}`} />;
    // 비/이슬비
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain className={`text-blue-500 ${className}`} />;
    // 눈
    if (code >= 71 && code <= 77 || code === 85 || code === 86) return <Snowflake className={`text-blue-300 ${className}`} />;
    // 뇌우
    if (code >= 95 && code <= 99) return <CloudLightning className={`text-purple-500 ${className}`} />;

    // 기본 아이콘
    return <CloudSun className={`text-slate-400 ${className}`} />;
  };

  return (
    <Card className="col-span-1 border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 overflow-hidden relative">
      <CardHeader className="pb-1 pt-5 px-6">
        <CardTitle className="text-lg font-semibold flex items-center justify-between z-10 relative">
          <span>{weather ? weather.location : '날씨'}</span>
          {!loading && weather && getWeatherIcon(weather.weatherCode, weather.isDay, "h-6 w-6")}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-0">
        {loading && (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-xs text-muted-foreground">날씨 정보 수집 중...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-8 text-sm text-destructive">
            불러오기 실패
          </div>
        )}

        {!loading && !error && weather && (
          <>
            <div className="flex flex-col py-2">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold tracking-tighter tabular-nums">{weather.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{weather.condition}</span>
                <span className="text-xs text-muted-foreground">체감 {weather.feelsLike}°C</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground bg-background/60 backdrop-blur-sm p-3 rounded-lg border border-primary/10">
              <div className="flex items-center gap-1.5" title="습도">
                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                <span className="font-medium">{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5" title="풍속">
                <Wind className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-medium">{weather.windSpeed}m/s</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

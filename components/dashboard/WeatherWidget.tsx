import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplets, Wind } from "lucide-react";

export function WeatherWidget() {
  return (
    <Card className="col-span-1 border-blue-100 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>서울 날씨</span>
          <CloudSun className="h-6 w-6 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-2">
          <span className="text-4xl font-bold tracking-tighter">18°C</span>
          <span className="text-sm font-medium text-muted-foreground mt-1">대체로 맑음</span>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground bg-background/50 p-2 rounded-md">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3 text-blue-500" />
            <span>45%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3 text-gray-500" />
            <span>3m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

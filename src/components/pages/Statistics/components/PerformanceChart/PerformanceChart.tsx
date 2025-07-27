import { useMemo } from "react";
import { useStatisticsStore } from "../../../../../store/statisticsStore";
import { Card } from "@/components/ui/Card";

export function PerformanceChart() {
  const { solveHistory, getTopPerformanceDays } = useStatisticsStore();

  const chartData = useMemo(() => {
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSolves = solveHistory.filter(
      (solve) => new Date(solve.solvedAt) >= thirtyDaysAgo
    );

    // Group by date
    const dailyData = new Map<
      string,
      { count: number; totalAttempts: number }
    >();

    recentSolves.forEach((solve) => {
      const date = new Date(solve.solvedAt).toISOString().split("T")[0];
      const existing = dailyData.get(date) || { count: 0, totalAttempts: 0 };
      dailyData.set(date, {
        count: existing.count + 1,
        totalAttempts: existing.totalAttempts + solve.attempts,
      });
    });

    // Create array of last 30 days
    const chartPoints = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const data = dailyData.get(dateKey) || { count: 0, totalAttempts: 0 };

      chartPoints.push({
        date: dateKey,
        count: data.count,
        avgAttempts: data.count > 0 ? data.totalAttempts / data.count : 0,
        displayDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    return chartPoints;
  }, [solveHistory]);

  const topDays = useMemo(
    () => getTopPerformanceDays().slice(0, 5),
    [getTopPerformanceDays]
  );

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const maxAttempts = Math.max(...chartData.map((d) => d.avgAttempts), 1);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        30-Day Performance
      </h3>

      {/* Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between h-32 mb-2">
          {chartData.map((point) => (
            <div
              key={point.date}
              className="flex flex-col items-center flex-1 max-w-[20px]"
            >
              {/* Solves bar */}
              <div
                className="w-2 bg-blue-500 rounded-t mb-1 min-h-[2px]"
                style={{
                  height: `${(point.count / maxCount) * 60}px`,
                }}
                title={`${point.displayDate}: ${point.count} solves`}
              />
              {/* Avg attempts bar */}
              <div
                className="w-2 bg-orange-400 rounded-b min-h-[2px]"
                style={{
                  height: `${point.avgAttempts > 0 ? (point.avgAttempts / maxAttempts) * 40 : 2}px`,
                }}
                title={`${point.displayDate}: ${point.avgAttempts.toFixed(1)} avg attempts`}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{chartData[0]?.displayDate}</span>
          <span>{chartData[chartData.length - 1]?.displayDate}</span>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-blue-500 rounded"></div>
            <span className="text-muted-foreground">Solves</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-2 bg-orange-400 rounded"></div>
            <span className="text-muted-foreground">Avg Attempts</span>
          </div>
        </div>
      </div>

      {/* Top Performance Days */}
      {topDays.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3">
            Best Performance Days
          </h4>
          <div className="space-y-2">
            {topDays.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <span>{day.solveCount} solves</span>
                  <span>{day.averageAttempts.toFixed(1)} avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

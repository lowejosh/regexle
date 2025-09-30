import { useStatisticsStore } from "@/store/statisticsStore";
import { Card } from "@/components/ui/Card";

export function StatsOverview() {
  const solvedPuzzleIds = useStatisticsStore((state) => state.solvedPuzzleIds);
  const currentStreak = useStatisticsStore((state) => state.currentStreak);
  const averageAttempts = useStatisticsStore((state) => state.averageAttempts);
  const longestStreak = useStatisticsStore((state) => state.longestStreak);

  const totalCompleted = solvedPuzzleIds.size;

  const stats = [
    {
      label: "Puzzles Completed",
      value: totalCompleted,
    },
    {
      label: "Avg Attempts",
      value: averageAttempts > 0 ? averageAttempts.toFixed(1) : "0",
    },
    {
      label: "Current Streak",
      value: currentStreak,
    },
    {
      label: "Best Streak",
      value: longestStreak,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

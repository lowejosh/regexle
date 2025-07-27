import { useStatisticsStore } from "../../../../../store/statisticsStore";
import { Card } from "@/components/ui/Card";

export function StatsOverview() {
  const {
    totalPuzzlesSolved,
    averageAttempts,
    currentStreak,
    longestStreak,
    getDifficultyStats,
  } = useStatisticsStore();

  const allStats = getDifficultyStats();
  const successRate =
    allStats.totalSolved > 0
      ? ((allStats.solvedWithoutSolution / allStats.totalSolved) * 100).toFixed(
          1
        )
      : "0";

  const overviewStats = [
    {
      label: "Puzzles Solved",
      value: totalPuzzlesSolved.toString(),
      icon: "🧩",
      description: "Total completed puzzles",
    },
    {
      label: "Avg. Attempts",
      value: averageAttempts.toFixed(1),
      icon: "🎯",
      description: "Average attempts per solve",
    },
    {
      label: "Current Streak",
      value: currentStreak.toString(),
      icon: "🔥",
      description: "Consecutive days solved",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      icon: "✅",
      description: "Solved without revealing solution",
    },
    {
      label: "Best Streak",
      value: longestStreak.toString(),
      icon: "🏆",
      description: "Longest streak achieved",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {overviewStats.map((stat) => (
        <Card key={stat.label} className="p-4 text-center">
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {stat.value}
          </div>
          <div className="font-medium text-sm text-foreground mb-1">
            {stat.label}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.description}
          </div>
        </Card>
      ))}
    </div>
  );
}

import { useStatisticsStore } from "@/store/statisticsStore";
import { Card } from "@/components/ui/Card";
import { Trophy, Zap, TrendingUp, Award } from "lucide-react";

export function StatsOverview() {
  const solvedPuzzleIds = useStatisticsStore((state) => state.solvedPuzzleIds);
  const currentStreak = useStatisticsStore((state) => state.currentStreak);
  const averageAttempts = useStatisticsStore((state) => state.averageAttempts);
  const longestStreak = useStatisticsStore((state) => state.longestStreak);

  const totalCompleted = solvedPuzzleIds.size;

  const stats = [
    {
      icon: Trophy,
      label: "Puzzles Completed",
      value: totalCompleted,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Zap,
      label: "Avg Attempts",
      value: averageAttempts > 0 ? averageAttempts.toFixed(1) : "0",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      label: "Current Streak",
      value: currentStreak,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Award,
      label: "Best Streak",
      value: longestStreak,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

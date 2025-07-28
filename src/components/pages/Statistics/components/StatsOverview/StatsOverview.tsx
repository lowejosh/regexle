import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/Card";
import { Trophy, Target, TrendingUp } from "lucide-react";

export function StatsOverview() {
  const completedPuzzles = useGameStore((state) => state.completedPuzzles);
  const getCompletionStreak = useGameStore(
    (state) => state.getCompletionStreak
  );

  const totalCompleted = completedPuzzles.size;
  const currentStreak = getCompletionStreak();

  const stats = [
    {
      icon: Trophy,
      label: "Puzzles Completed",
      value: totalCompleted,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Target,
      label: "Different Puzzles",
      value: totalCompleted,
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
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
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

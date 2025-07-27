import { useStatisticsStore } from "../../../../../store/statisticsStore";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Puzzle } from "../../../../../types/game";

const DIFFICULTY_CONFIG: Record<
  Puzzle["difficulty"],
  { color: string; icon: string; name: string }
> = {
  easy: { color: "bg-green-500", icon: "🟢", name: "Easy" },
  medium: { color: "bg-yellow-500", icon: "🟡", name: "Medium" },
  hard: { color: "bg-orange-500", icon: "🟠", name: "Hard" },
  expert: { color: "bg-red-500", icon: "🔴", name: "Expert" },
  nightmare: { color: "bg-purple-500", icon: "🟣", name: "Nightmare" },
};

export function DifficultyBreakdown() {
  const { getDifficultyStats } = useStatisticsStore();

  const difficulties: Puzzle["difficulty"][] = [
    "easy",
    "medium",
    "hard",
    "expert",
    "nightmare",
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Difficulty Breakdown
      </h3>

      <div className="space-y-4">
        {difficulties.map((difficulty) => {
          const stats = getDifficultyStats(difficulty);
          const config = DIFFICULTY_CONFIG[difficulty];
          const successRate =
            stats.totalSolved > 0
              ? (
                  (stats.solvedWithoutSolution / stats.totalSolved) *
                  100
                ).toFixed(0)
              : "0";

          return (
            <div
              key={difficulty}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{config.icon}</span>
                <div>
                  <div className="font-medium text-foreground">
                    {config.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.totalSolved} solved
                    {stats.totalSolved > 0 && (
                      <span>
                        {" "}
                        • {stats.averageAttempts.toFixed(1)} avg attempts
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant={stats.totalSolved > 0 ? "correct" : "secondary"}
                  className="text-xs"
                >
                  {successRate}% clean
                </Badge>
                {stats.totalSolved > 0 && (
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color} transition-all duration-500`}
                      style={{
                        width: `${Math.min(100, (stats.totalSolved / 10) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          "Clean" means solved without revealing the solution. Progress bars
          show completion relative to 10 puzzles per difficulty.
        </p>
      </div>
    </Card>
  );
}

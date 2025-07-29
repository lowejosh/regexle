import { useStatisticsStore } from "@/store/statisticsStore";
import { Card } from "@/components/ui/Card";
import { Clock, CheckCircle } from "lucide-react";
import { formatRelativeTime } from "@/lib/timeUtils";

export function RecentActivity() {
  const getRecentCompletions = useStatisticsStore(
    (state) => state.getRecentCompletions
  );
  const recentPuzzles = getRecentCompletions(5);

  const getDifficultyFromId = (id: string): keyof typeof difficultyColors => {
    const difficulties: Array<keyof typeof difficultyColors> = [
      "easy",
      "medium",
      "hard",
      "expert",
      "nightmare",
    ];
    for (const diff of difficulties) {
      if (id.startsWith(`${diff}-`)) return diff;
    }
    return "unknown";
  };

  const difficultyColors = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-orange-500",
    expert: "text-red-500",
    nightmare: "text-purple-500",
    unknown: "text-gray-500",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>

      {recentPuzzles.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No puzzles completed yet. Start solving to see your progress!
        </p>
      ) : (
        <div className="space-y-3">
          {recentPuzzles.map((puzzle) => {
            const difficulty = getDifficultyFromId(puzzle.puzzleId);
            return (
              <div
                key={puzzle.puzzleId}
                className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {puzzle.puzzleId
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  <p
                    className={`text-xs ${difficultyColors[difficulty]} capitalize`}
                  >
                    {difficulty} difficulty
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(puzzle.solvedAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

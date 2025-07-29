import { useStatisticsStore } from "@/store/statisticsStore";
import { Card } from "@/components/ui/Card";
import {
  Award,
  Star,
  Zap,
  Target,
  Trophy,
  Crown,
  Flame,
  Shield,
  Brain,
} from "lucide-react";

export function AchievementHighlights() {
  const solvedPuzzleIds = useStatisticsStore((state) => state.solvedPuzzleIds);
  const solveHistory = useStatisticsStore((state) => state.solveHistory);

  const totalCompleted = solvedPuzzleIds.size;

  // Get completion data for analysis
  const completionData = solveHistory;
  const perfectSolves = completionData.filter(
    (data) => data.attempts === 1
  ).length;
  const recentActivity = completionData.filter(
    (data) => Date.now() - data.solvedAt < 24 * 60 * 60 * 1000 // Last 24 hours
  ).length;

  const oneAttemptSolves = perfectSolves;
  const recentCompletions = recentActivity;

  const achievements = [
    {
      icon: Star,
      title: "First Steps",
      description: "Complete your first puzzle",
      unlocked: totalCompleted >= 1,
      progress: Math.min(100, totalCompleted * 100),
    },
    {
      icon: Zap,
      title: "Quick Learner",
      description: "Complete 10 puzzles",
      unlocked: totalCompleted >= 10,
      progress: Math.min(100, (totalCompleted / 10) * 100),
    },
    {
      icon: Target,
      title: "Expert Explorer",
      description: "Complete an expert puzzle",
      unlocked: Array.from(solvedPuzzleIds).some((id) =>
        id.startsWith("expert-")
      ),
      progress: Array.from(solvedPuzzleIds).some((id) =>
        id.startsWith("expert-")
      )
        ? 100
        : 0,
    },
    {
      icon: Award,
      title: "Nightmare Conqueror",
      description: "Complete a nightmare puzzle",
      unlocked: Array.from(solvedPuzzleIds).some((id) =>
        id.startsWith("nightmare-")
      ),
      progress: Array.from(solvedPuzzleIds).some((id) =>
        id.startsWith("nightmare-")
      )
        ? 100
        : 0,
    },
    {
      icon: Trophy,
      title: "Pattern Master",
      description: "Complete 25 puzzles",
      unlocked: totalCompleted >= 25,
      progress: Math.min(100, (totalCompleted / 25) * 100),
    },
    {
      icon: Crown,
      title: "Regex Royalty",
      description: "Complete 50 puzzles",
      unlocked: totalCompleted >= 50,
      progress: Math.min(100, (totalCompleted / 50) * 100),
    },
    {
      icon: Flame,
      title: "Perfect Solver",
      description: "Solve 5 puzzles on first try",
      unlocked: oneAttemptSolves >= 5,
      progress: Math.min(100, (oneAttemptSolves / 5) * 100),
    },
    {
      icon: Shield,
      title: "Difficulty Conqueror",
      description: "Complete puzzles in all difficulties",
      unlocked: ["easy", "medium", "hard", "expert", "nightmare"].every(
        (diff) =>
          Array.from(solvedPuzzleIds).some((id) => id.startsWith(`${diff}-`))
      ),
      progress:
        ["easy", "medium", "hard", "expert", "nightmare"].filter((diff) =>
          Array.from(solvedPuzzleIds).some((id) => id.startsWith(`${diff}-`))
        ).length * 20,
    },
    {
      icon: Brain,
      title: "Daily Grinder",
      description: "Complete 3 puzzles in one day",
      unlocked: recentCompletions >= 3,
      progress: Math.min(100, (recentCompletions / 3) * 100),
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Achievements</h2>
        <div className="text-sm text-muted-foreground">
          {unlockedCount} / {achievements.length} unlocked
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.title}
              className={`p-3 rounded-lg border transition-all flex flex-col h-full ${
                achievement.unlocked
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/30 border-border opacity-60"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    achievement.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-xs">{achievement.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2 flex-grow">
                {achievement.description}
              </p>
              <div className="w-full bg-muted rounded-full h-1 mt-auto">
                <div
                  className={`h-1 rounded-full transition-all ${
                    achievement.unlocked
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

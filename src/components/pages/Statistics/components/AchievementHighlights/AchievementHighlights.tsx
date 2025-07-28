import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/Card";
import { Award, Star, Zap, Target } from "lucide-react";

export function AchievementHighlights() {
  const completedPuzzles = useGameStore((state) => state.completedPuzzles);
  const getCompletionRateByDifficulty = useGameStore(
    (state) => state.getCompletionRateByDifficulty
  );

  const completionRates = getCompletionRateByDifficulty();
  const totalCompleted = completedPuzzles.size;

  // Define achievements based on current progress
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
      unlocked: Array.from(completedPuzzles).some((id) =>
        id.includes("-expert-")
      ),
      progress: completionRates.expert || 0,
    },
    {
      icon: Award,
      title: "Nightmare Conqueror",
      description: "Complete a nightmare puzzle",
      unlocked: Array.from(completedPuzzles).some((id) =>
        id.includes("-nightmare-")
      ),
      progress: completionRates.nightmare || 0,
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

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.title}
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlocked
                  ? "bg-primary/5 border-primary/20"
                  : "bg-muted/30 border-border opacity-60"
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`p-2 rounded-lg ${
                    achievement.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-sm">{achievement.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
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

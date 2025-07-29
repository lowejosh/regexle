import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-easy-500" },
  medium: { label: "Medium", color: "bg-medium-500" },
  hard: { label: "Hard", color: "bg-hard-500" },
  expert: { label: "Expert", color: "bg-expert-500" },
  nightmare: { label: "Nightmare", color: "bg-nightmare-500" },
};

export function DifficultyBreakdown() {
  const getCompletionRateByDifficulty = useGameStore(
    (state) => state.getCompletionRateByDifficulty
  );
  const getTotalPuzzlesByDifficulty = useGameStore(
    (state) => state.getTotalPuzzlesByDifficulty
  );
  const completedPuzzles = useGameStore((state) => state.completedPuzzles);

  const completionRates = getCompletionRateByDifficulty();
  const totalByDifficulty = getTotalPuzzlesByDifficulty();

  const difficultyData = Object.entries(difficultyConfig).map(
    ([key, config]) => {
      // Fix the pattern matching for puzzle IDs (they start with difficulty prefix)
      const completed = Array.from(completedPuzzles).filter((id) =>
        id.startsWith(`${key}-`)
      ).length;
      const total = totalByDifficulty[key] || 0;
      const percentage = completionRates[key] || 0;

      return {
        difficulty: config.label,
        completed,
        total,
        percentage,
        color: config.color,
      };
    }
  );

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Difficulty Breakdown</h2>
      <div className="space-y-6">
        {difficultyData.map((item) => (
          <div key={item.difficulty} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.difficulty}</span>
              <span className="text-sm text-muted-foreground">
                {item.completed} / {item.total} completed
              </span>
            </div>
            <Progress
              value={item.percentage}
              className="h-3"
              indicatorClassName={item.color}
            />
            <p className="text-xs text-muted-foreground text-right">
              {item.percentage.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

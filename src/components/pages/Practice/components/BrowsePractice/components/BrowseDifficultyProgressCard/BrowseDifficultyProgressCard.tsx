import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Trophy, Lock, Target } from "lucide-react";

interface BrowseDifficultyProgressCardProps {
  difficulty: string;
  completed: number;
  total: number;
}

export function BrowseDifficultyProgressCard({
  difficulty,
  completed,
  total,
}: BrowseDifficultyProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = percentage === 100;
  const hasStarted = percentage > 0;

  // Map difficulty to badge variant
  const badgeVariant = difficulty.toLowerCase() as
    | "easy"
    | "medium"
    | "hard"
    | "expert"
    | "nightmare";

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isComplete &&
          "ring-2 ring-green-500/30 bg-green-50/30 dark:bg-green-950/30"
      )}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with badge and completion icon */}
          <div className="flex items-center justify-between">
            <Badge variant={badgeVariant} className="text-sm">
              {toTitleCase(difficulty)}
            </Badge>
            {isComplete ? (
              <Trophy className="w-5 h-5 text-yellow-500" />
            ) : hasStarted ? (
              <Target className="w-5 h-5 text-primary" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {/* Progress stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{completed}</span>
              <span className="text-sm text-muted-foreground">of {total}</span>
            </div>

            <Progress
              value={percentage}
              className="h-2"
              indicatorClassName={cn(
                "transition-all duration-700 ease-out",
                isComplete && "bg-green-500"
              )}
            />

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

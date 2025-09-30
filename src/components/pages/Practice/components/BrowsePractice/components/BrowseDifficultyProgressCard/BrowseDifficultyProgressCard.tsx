import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

  // Map difficulty to badge variant
  const badgeVariant = difficulty.toLowerCase() as
    | "easy"
    | "medium"
    | "hard"
    | "expert"
    | "nightmare";

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with badge */}
          <div className="flex items-center justify-between">
            <Badge variant={badgeVariant} className="text-sm">
              {toTitleCase(difficulty)}
            </Badge>
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

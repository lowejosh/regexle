import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Trophy, Lock } from "lucide-react";

interface DifficultyProgressCardProps {
  difficulty: string;
  completed: number;
  total: number;
  color: string;
}

export function DifficultyProgressCard({
  difficulty,
  completed,
  total,
  color,
}: DifficultyProgressCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = percentage === 100;

  return (
    <Card
      className={cn(
        "border-border/50",
        isComplete && "ring-2 ring-primary/50"
      )}
    >
      <CardContent className="p-6 text-center space-y-3">
        <div className="relative">
          <div className="text-3xl font-bold">{completed}</div>
          <div className="text-sm text-muted-foreground">of {total}</div>
          {isComplete && (
            <Trophy className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
          )}
        </div>

        <Badge
          className={cn(color, "w-full justify-center py-1.5 font-semibold")}
        >
          {toTitleCase(difficulty)}
        </Badge>

        <div className="space-y-2">
          <div className="text-lg font-bold flex items-center justify-center gap-1">
            {percentage}%
            {percentage === 0 && (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                isComplete
                  ? "bg-gradient-to-r from-green-500 to-green-400"
                  : "bg-gradient-to-r from-primary to-primary/70"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

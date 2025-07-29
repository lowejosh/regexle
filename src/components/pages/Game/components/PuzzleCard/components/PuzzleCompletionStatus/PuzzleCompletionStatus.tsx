import { Card, CardContent } from "@/components/ui";
import { CheckCircle } from "lucide-react";

interface PuzzleCompletionStatusProps {
  isDailyCompleted: boolean;
}

export function PuzzleCompletionStatus({
  isDailyCompleted,
}: PuzzleCompletionStatusProps) {
  if (!isDailyCompleted) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">
            Today's Puzzle Completed!
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}

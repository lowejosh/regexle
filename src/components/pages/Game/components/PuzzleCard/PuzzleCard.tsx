import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { RegexInput } from "../RegexInput";
import { TestCases } from "../TestCases/TestCases";
import { GameResults } from "../GameResults";
import { SpinWheelButton } from "../SpinWheelButton";
import type { Puzzle, GameResult } from "../../../../../types/game";

interface PuzzleCardProps {
  puzzle: Puzzle;
  userPattern: string;
  gameResult: GameResult | null;
  showDescription: boolean;
  revealedTestCases: number;
  availableSpins: number;
  onPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTestPattern: () => void;
  onComplete: () => void;
  onOpenSpinWheel: () => void;
}

export function PuzzleCard({
  puzzle,
  userPattern,
  gameResult,
  showDescription,
  revealedTestCases,
  availableSpins,
  onPatternChange,
  onTestPattern,
  onComplete,
  onOpenSpinWheel,
}: PuzzleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{puzzle.title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={puzzle.difficulty}>{puzzle.difficulty}</Badge>
            <SpinWheelButton
              availableSpins={availableSpins}
              gameResult={gameResult}
              onOpenSpinWheel={onOpenSpinWheel}
            />
          </div>
        </div>
        {puzzle.description && (
          <CardDescription>
            {showDescription && puzzle.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <RegexInput
          userPattern={userPattern}
          onPatternChange={onPatternChange}
          onTestPattern={onTestPattern}
        />
        <TestCases
          testCases={puzzle.testCases}
          gameResult={gameResult}
          revealedCount={revealedTestCases}
        />
        {gameResult && (
          <GameResults gameResult={gameResult} onComplete={onComplete} />
        )}
        {/* Dev Solution (for testing) */}
        {process.env.NODE_ENV === "development" && puzzle.solution && (
          <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
            🔧 Dev Solution: <code>{puzzle.solution}</code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

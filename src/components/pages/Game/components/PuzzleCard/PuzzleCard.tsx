import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RegexInput } from "../RegexInput";
import { TestCases } from "../TestCases";
import { GameResults } from "../GameResults";
import type { Puzzle, GameResult } from "../../../../../types/game";

interface PuzzleCardProps {
  puzzle: Puzzle;
  userPattern: string;
  gameResult: GameResult | null;
  showDescription: boolean;
  onPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTestPattern: () => void;
  onToggleDescription: () => void;
  onComplete: () => void;
}

export function PuzzleCard({
  puzzle,
  userPattern,
  gameResult,
  showDescription,
  onPatternChange,
  onTestPattern,
  onToggleDescription,
  onComplete,
}: PuzzleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{puzzle.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={puzzle.difficulty}>{puzzle.difficulty}</Badge>
            <Button variant="outline" size="sm" onClick={onToggleDescription}>
              {showDescription ? "Hide" : "Show"} Description
            </Button>
          </div>
        </div>
        {showDescription && puzzle.description && (
          <CardDescription>{puzzle.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Regex Input */}
        <RegexInput
          userPattern={userPattern}
          onPatternChange={onPatternChange}
          onTestPattern={onTestPattern}
        />

        {/* Test Cases */}
        <TestCases testCases={puzzle.testCases} gameResult={gameResult} />

        {/* Results */}
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

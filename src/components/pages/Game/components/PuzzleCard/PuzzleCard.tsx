import { useSpinWheelStore } from "../../../../../store/spinWheelStore";
import { useGameStore } from "../../../../../store/gameStore";
import type { Puzzle } from "../../../../../types/game";
import { SpinWheelButton } from "../SpinWheelButton";
import { TestCases } from "../TestCases/TestCases";
import { Badge } from "@/components/ui/Badge";
import { GameResults } from "../GameResults";
import { RegexInput } from "../RegexInput";
import { toTitleCase } from "@/lib/utils";
import {
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
  Card,
} from "@/components/ui";

interface PuzzleCardProps {
  puzzle?: Puzzle;
}

export function PuzzleCard({ puzzle: propPuzzle }: PuzzleCardProps) {
  const {
    currentPuzzle,
    userPattern,
    gameResult,
    showDescription,
    revealedTestCases,
    attempts,
    updatePattern,
    testPatternWithEffects,
  } = useGameStore();

  const { partialDescription, getAvailableSpins, openSpinWheel } =
    useSpinWheelStore();

  const availableSpins = getAvailableSpins();

  const puzzle = propPuzzle || currentPuzzle;

  if (!puzzle) return null;

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPatternWithEffects();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{puzzle.title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant={puzzle.difficulty}>
              {toTitleCase(puzzle.difficulty)}
            </Badge>
            <SpinWheelButton
              availableSpins={availableSpins}
              gameResult={gameResult}
              onOpenSpinWheel={openSpinWheel}
            />
          </div>
        </div>
        {puzzle.description && (
          <CardDescription>
            {showDescription && puzzle.description}
            {!showDescription && partialDescription}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <RegexInput
          userPattern={userPattern}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
        />
        <TestCases
          testCases={puzzle.testCases}
          gameResult={gameResult}
          revealedCount={revealedTestCases}
        />
        {gameResult && (
          <GameResults gameResult={gameResult} attempts={attempts} />
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

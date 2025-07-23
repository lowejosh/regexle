import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { samplePuzzles, getRandomPuzzle } from "../data/puzzles";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function GameProofOfConcept() {
  const {
    currentPuzzle,
    userPattern,
    gameResult,
    completedPuzzles,
    loadPuzzle,
    updatePattern,
    completePuzzle,
  } = useGameStore();

  const [hintLevel, setHintLevel] = useState(0);

  const handleLoadRandomPuzzle = () => {
    const puzzle = getRandomPuzzle();
    loadPuzzle(puzzle);
    setHintLevel(0);
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleNextHint = () => {
    if (currentPuzzle?.hints && hintLevel < currentPuzzle.hints.length) {
      setHintLevel(hintLevel + 1);
    }
  };

  const handleComplete = () => {
    completePuzzle();
    handleLoadRandomPuzzle();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Regexle - Core Game Logic Test</h1>
        <p className="text-muted-foreground">
          Testing the core game mechanics. Total puzzles: {samplePuzzles.length}{" "}
          | Completed: {completedPuzzles.size}
        </p>

        <Button onClick={handleLoadRandomPuzzle} size="lg">
          Load Random Puzzle
        </Button>
      </div>

      {currentPuzzle && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentPuzzle.title}</CardTitle>
              <Badge variant="secondary">{currentPuzzle.difficulty}</Badge>
            </div>
            <CardDescription>{currentPuzzle.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Regex Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Regex Pattern:</label>
              <Input
                placeholder="Enter your regex pattern..."
                value={userPattern}
                onChange={handlePatternChange}
                className="font-mono"
              />
            </div>

            {/* Test Cases */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Test Cases:</h3>
              <div className="grid gap-2">
                {currentPuzzle.testCases.map((testCase, index) => {
                  const isCorrect = gameResult
                    ? !gameResult.failedCases.some(
                        (failed) => failed.input === testCase.input
                      )
                    : null;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded border flex items-center justify-between ${
                        isCorrect === true
                          ? "bg-green-50 border-green-200"
                          : isCorrect === false
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">
                          "{testCase.input}"
                        </span>
                        <span className="text-xs text-muted-foreground">
                          should {testCase.shouldMatch ? "match" : "not match"}
                        </span>
                      </div>
                      <div className="text-lg">
                        {isCorrect === true
                          ? "✅"
                          : isCorrect === false
                          ? "❌"
                          : "⏳"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            {gameResult && (
              <div className="p-4 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    Score: {gameResult.passedTests}/{gameResult.totalTests}
                  </span>
                  {gameResult.isCorrect ? (
                    <Badge variant="correct">🎉 Correct!</Badge>
                  ) : (
                    <Badge variant="incorrect">Try Again</Badge>
                  )}
                </div>

                {gameResult.isCorrect && (
                  <Button onClick={handleComplete} className="w-full">
                    Complete & Next Puzzle
                  </Button>
                )}
              </div>
            )}

            {/* Hints */}
            {currentPuzzle.hints && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hints:</span>
                  <Button
                    variant="hint"
                    size="sm"
                    onClick={handleNextHint}
                    disabled={hintLevel >= currentPuzzle.hints.length}
                  >
                    Get Hint ({hintLevel}/{currentPuzzle.hints.length})
                  </Button>
                </div>

                {hintLevel > 0 && (
                  <div className="space-y-2">
                    {currentPuzzle.hints
                      .slice(0, hintLevel)
                      .map((hint, index) => (
                        <div
                          key={index}
                          className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm"
                        >
                          💡 {hint}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Dev Solution (for testing) */}
            {process.env.NODE_ENV === "development" &&
              currentPuzzle.solution && (
                <div className="p-2 bg-gray-100 rounded text-xs text-gray-600">
                  🔧 Dev Solution: <code>{currentPuzzle.solution}</code>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

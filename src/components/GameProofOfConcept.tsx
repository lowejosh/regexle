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
    showDescription,
    loadPuzzle,
    updatePattern,
    testPattern,
    completePuzzle,
    toggleDescription,
  } = useGameStore();

  const handleLoadRandomPuzzle = () => {
    const puzzle = getRandomPuzzle();
    loadPuzzle(puzzle);
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPattern();
  };

  const handleComplete = () => {
    completePuzzle();
    handleLoadRandomPuzzle();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Regexle</h1>
        <p className="text-muted-foreground">
          Guess the pattern from the test cases. Total puzzles:{" "}
          {samplePuzzles.length} | Completed: {completedPuzzles.size}
        </p>

        <Button onClick={handleLoadRandomPuzzle} size="lg">
          {currentPuzzle ? "Load New Puzzle" : "Start Playing"}
        </Button>
      </div>

      {currentPuzzle && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentPuzzle.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{currentPuzzle.difficulty}</Badge>
                <Button variant="outline" size="sm" onClick={toggleDescription}>
                  {showDescription ? "Hide" : "Show"} Description
                </Button>
              </div>
            </div>
            {showDescription && currentPuzzle.description && (
              <CardDescription>{currentPuzzle.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Regex Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Regex Pattern:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your regex pattern..."
                  value={userPattern}
                  onChange={handlePatternChange}
                  className="font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTestPattern();
                    }
                  }}
                />
                <Button
                  onClick={handleTestPattern}
                  disabled={!userPattern.trim()}
                >
                  Test Pattern
                </Button>
              </div>
            </div>

            {/* Test Cases */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">
                Test Cases ({currentPuzzle.testCases.length} total):
              </h3>
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
                        {gameResult === null
                          ? "⏳"
                          : isCorrect === true
                          ? "✅"
                          : "❌"}
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
                    <Badge variant="correct">
                      🎉 Perfect! All tests passed!
                    </Badge>
                  ) : (
                    <Badge variant="incorrect">
                      {gameResult.failedCases.length} test
                      {gameResult.failedCases.length !== 1 ? "s" : ""} failed
                    </Badge>
                  )}
                </div>

                {gameResult.isCorrect && (
                  <Button onClick={handleComplete} className="w-full">
                    Complete & Next Puzzle
                  </Button>
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

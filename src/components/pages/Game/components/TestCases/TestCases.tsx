import type { TestCase, GameResult } from "../../../../../types/game";

interface TestCaseItemProps {
  testCase: TestCase;
  index: number;
  gameResult: GameResult | null;
  keyPrefix: string;
  isRevealed: boolean;
}

function TestCaseItem({
  testCase,
  index,
  gameResult,
  keyPrefix,
  isRevealed,
}: TestCaseItemProps) {
  const isCorrect = gameResult
    ? !gameResult.failedCases.some((failed) => failed.input === testCase.input)
    : null;

  return (
    <div
      key={`${keyPrefix}-${index}`}
      className={`p-3 rounded border flex items-center justify-between transition-all duration-300 ${
        isCorrect === true
          ? "bg-green-50 border-green-200"
          : isCorrect === false
            ? "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
      } ${!isRevealed ? "blur-sm opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm">
          {isRevealed
            ? `"${testCase.input}"`
            : `"${"•".repeat(Math.max(3, testCase.input.length))}"`}
        </span>
      </div>
    </div>
  );
}

interface TestCasesProps {
  testCases: TestCase[];
  gameResult: GameResult | null;
  revealedCount: number;
}

export function TestCases({
  testCases,
  gameResult,
  revealedCount,
}: TestCasesProps) {
  const shouldMatchCases = testCases.filter((tc) => tc.shouldMatch);
  const shouldNotMatchCases = testCases.filter((tc) => !tc.shouldMatch);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Test Cases:</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Should Match Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-700">Should Match</h4>
          <div className="space-y-2">
            {shouldMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="match"
                isRevealed={index < revealedCount}
              />
            ))}
          </div>
        </div>

        {/* Should NOT Match Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-purple-700">
            Should NOT Match
          </h4>
          <div className="space-y-2">
            {shouldNotMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`no-match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="no-match"
                isRevealed={index < revealedCount}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import type { TestCase, GameResult } from "../../../../../types/game";

interface TestCaseItemProps {
  testCase: TestCase;
  index: number;
  gameResult: GameResult | null;
  keyPrefix: string;
}

function TestCaseItem({
  testCase,
  index,
  gameResult,
  keyPrefix,
}: TestCaseItemProps) {
  const isCorrect = gameResult
    ? !gameResult.failedCases.some((failed) => failed.input === testCase.input)
    : null;

  return (
    <div
      key={`${keyPrefix}-${index}`}
      className={`p-3 rounded border flex items-center justify-between ${
        isCorrect === true
          ? "bg-green-50 border-green-200"
          : isCorrect === false
            ? "bg-red-50 border-red-200"
            : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm">"{testCase.input}"</span>
      </div>
      <div className="text-lg">
        {gameResult === null ? "⏳" : isCorrect === true ? "✅" : "❌"}
      </div>
    </div>
  );
}

interface TestCasesProps {
  testCases: TestCase[];
  gameResult: GameResult | null;
}

export function TestCases({ testCases, gameResult }: TestCasesProps) {
  const shouldMatchCases = testCases.filter((tc) => tc.shouldMatch);
  const shouldNotMatchCases = testCases.filter((tc) => !tc.shouldMatch);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">
        Test Cases ({testCases.length} total):
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Should Match Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-blue-700">
            📝 Should Match ({shouldMatchCases.length})
          </h4>
          <div className="space-y-2">
            {shouldMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="match"
              />
            ))}
          </div>
        </div>

        {/* Should NOT Match Column */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-purple-700">
            🚫 Should NOT Match ({shouldNotMatchCases.length})
          </h4>
          <div className="space-y-2">
            {shouldNotMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`no-match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="no-match"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

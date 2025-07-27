import { useEffect, useState } from "react";
import type { TestCase, GameResult } from "../../../../../types/game";

// Animation constants
const TRANSITION_DURATION_MS = 500;
const ROW_ANIMATION_DELAY_MS = 150;

interface TestCaseItemProps {
  testCase: TestCase;
  index: number;
  gameResult: GameResult | null;
  keyPrefix: string;
  isRevealed: boolean;
  animationDelay: number;
}

function TestCaseItem({
  testCase,
  index,
  gameResult,
  keyPrefix,
  isRevealed,
  animationDelay,
}: TestCaseItemProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const isCorrect = gameResult
    ? !gameResult.failedCases.some((failed) => failed.input === testCase.input)
    : null;

  useEffect(() => {
    // Reset animation state first when gameResult changes
    setShouldAnimate(false);

    if (gameResult && isCorrect !== null) {
      // Wait for reset transition to complete plus the row delay
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, TRANSITION_DURATION_MS + animationDelay);

      return () => clearTimeout(timer);
    }
  }, [gameResult, isCorrect, animationDelay]);

  const getBackgroundClass = () => {
    if (!gameResult || isCorrect === null) {
      return "bg-muted border-border";
    }

    if (!shouldAnimate) {
      return "bg-muted border-border";
    }

    return isCorrect
      ? "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-600/50"
      : "bg-red-100 border-red-300 dark:bg-red-900/20 dark:border-red-600/50";
  };

  return (
    <div
      key={`${keyPrefix}-${index}`}
      className={`p-2 sm:p-3 rounded border flex items-center justify-between transition-all duration-500 ${getBackgroundClass()} ${!isRevealed ? "blur-sm opacity-60" : ""}`}
      style={{
        transitionDuration: `${TRANSITION_DURATION_MS}ms`,
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <span className="font-mono text-xs sm:text-sm break-all">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Should Match Column */}
        <div className="space-y-2">
          <div className="border-b border-border pb-1">
            <h4 className="text-sm font-medium text-foreground">
              Should Match
            </h4>
          </div>
          <div className="space-y-2">
            {shouldMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="match"
                isRevealed={index < revealedCount}
                animationDelay={index * ROW_ANIMATION_DELAY_MS}
              />
            ))}
          </div>
        </div>

        {/* Should NOT Match Column */}
        <div className="space-y-2">
          <div className="border-b border-border pb-1">
            <h4 className="text-sm font-medium text-foreground">
              Should Not Match
            </h4>
          </div>
          <div className="space-y-2">
            {shouldNotMatchCases.map((testCase, index) => (
              <TestCaseItem
                key={`no-match-${index}`}
                testCase={testCase}
                index={index}
                gameResult={gameResult}
                keyPrefix="no-match"
                isRevealed={index < revealedCount}
                animationDelay={index * ROW_ANIMATION_DELAY_MS}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

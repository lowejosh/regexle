import type { Puzzle } from "@/types/game";
import { STUPID_QUOTES } from "./PuzzleCardSolutionReveal.const";

interface SolutionRevealProps {
  puzzle: Puzzle;
}

export function PuzzleCardSolutionReveal({ puzzle }: SolutionRevealProps) {
  const randomQuote =
    STUPID_QUOTES[Math.floor(Math.random() * STUPID_QUOTES.length)];

  return (
    <div className="space-y-4 p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 text-red-800">
        <span className="text-lg">🤡</span>
        <h3 className="font-semibold text-lg">Womp, womp...</h3>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-red-700 italic">{randomQuote}</p>

        <code className="block p-3 bg-white border border-red-200 rounded-md text-sm font-mono text-gray-800 break-all">
          {puzzle.solution}
        </code>

        {puzzle.solutionSummary && (
          <div>
            <span className="text-sm font-medium text-red-700 block mb-1">
              Pay attention:
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {puzzle.solutionSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

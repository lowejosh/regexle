import { Game } from "@/components/pages/Game";
import { DailyCountdown } from "./DailyCountdown";

export function DailyPuzzle() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Puzzle</h1>
        <p className="text-gray-600">
          Challenge yourself with today's regex puzzle!
        </p>
      </div>

      <DailyCountdown />

      <Game mode="daily" />
    </div>
  );
}

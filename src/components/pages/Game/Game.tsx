import { useGameStore } from "../../../store/gameStore";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import type { WheelOption } from "./components/SpinWheel/SpinWheel.consts";
import { useState } from "react";

export function Game() {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [revealedTestCases, setRevealedTestCases] = useState(1); // Start with 1 test case of each type revealed

  const {
    currentPuzzle,
    userPattern,
    gameResult,
    completedPuzzles,
    showDescription,
    loadRandomPuzzle,
    updatePattern,
    testPattern,
    completePuzzle,
    toggleDescription,
  } = useGameStore();

  const handleLoadRandomPuzzle = async () => {
    await loadRandomPuzzle();
    setRevealedTestCases(1); // Reset to show only 1 test case of each type for new puzzle
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPattern();

    // After testing, if there were incorrect results, reveal one more test case
    setTimeout(() => {
      const result = useGameStore.getState().gameResult;
      if (result && !result.isCorrect && currentPuzzle) {
        const maxRevealable = Math.min(
          currentPuzzle.testCases.filter((tc) => tc.shouldMatch).length,
          currentPuzzle.testCases.filter((tc) => !tc.shouldMatch).length
        );
        setRevealedTestCases((prev) => Math.min(prev + 1, maxRevealable));
      }
    }, 100); // Small delay to ensure state is updated
  };

  const handleComplete = async () => {
    completePuzzle();
    await loadRandomPuzzle();
    setRevealedTestCases(1); // Reset for new puzzle
  };

  const handleSpinWheelResult = (option: WheelOption) => {
    console.log("Spin wheel result:", option);
    // TODO: Handle different wheel results
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GameHeader
        completedPuzzlesCount={completedPuzzles.size}
        onLoadRandomPuzzle={handleLoadRandomPuzzle}
        onOpenSpinWheel={() => setIsSpinWheelOpen(true)}
        hasCurrentPuzzle={!!currentPuzzle}
      />

      {currentPuzzle && (
        <PuzzleCard
          puzzle={currentPuzzle}
          userPattern={userPattern}
          gameResult={gameResult}
          showDescription={showDescription}
          revealedTestCases={revealedTestCases}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
          onToggleDescription={toggleDescription}
          onComplete={handleComplete}
        />
      )}

      {/* Spin Wheel Modal */}
      <SpinWheel
        isOpen={isSpinWheelOpen}
        onClose={() => setIsSpinWheelOpen(false)}
        onResult={handleSpinWheelResult}
      />
    </div>
  );
}

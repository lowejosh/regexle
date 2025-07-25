import { useGameStore } from "../../../store/gameStore";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import { useSpinResults } from "./hooks/useSpinResults";
import { useState, useRef } from "react";

export function Game() {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [revealedTestCases, setRevealedTestCases] = useState(1); // Start with 1 test case of each type revealed
  const [availableSpins, setAvailableSpins] = useState(1); // User starts with 1 spin
  const showEncouragementRef = useRef<(() => void) | null>(null);
  const [partialDescription, setPartialDescription] = useState<string | null>(
    null
  );

  const { handleSpinWheelResult } = useSpinResults({
    setPartialDescription,
    setAvailableSpins,
    showEncouragementRef,
  });

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
  } = useGameStore();

  const handleLoadRandomPuzzle = async () => {
    await loadRandomPuzzle();
    setRevealedTestCases(1); // Reset to show only 1 test case of each type for new puzzle
    setAvailableSpins(1); // Reset to 1 spin for new puzzle
    setPartialDescription(null); // Clear any partial description
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPattern();

    // After testing, if there were incorrect results, reveal one more test case and grant a spin
    setTimeout(() => {
      const result = useGameStore.getState().gameResult;
      if (result && !result.isCorrect && currentPuzzle) {
        const maxRevealable = Math.min(
          currentPuzzle.testCases.filter((tc) => tc.shouldMatch).length,
          currentPuzzle.testCases.filter((tc) => !tc.shouldMatch).length
        );
        setRevealedTestCases((prev) => Math.min(prev + 1, maxRevealable));
        setAvailableSpins((prev) => prev + 1); // Grant another spin for failed attempt
      }
    }, 100); // Small delay to ensure state is updated
  };

  const handleComplete = async () => {
    completePuzzle();
    await loadRandomPuzzle();
    setRevealedTestCases(1); // Reset for new puzzle
    setAvailableSpins(1); // Reset spins for new puzzle
    setPartialDescription(null); // Clear any partial description
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <GameHeader
        completedPuzzlesCount={completedPuzzles.size}
        onLoadRandomPuzzle={handleLoadRandomPuzzle}
        hasCurrentPuzzle={!!currentPuzzle}
      />

      {currentPuzzle && (
        <PuzzleCard
          puzzle={currentPuzzle}
          userPattern={userPattern}
          gameResult={gameResult}
          showDescription={showDescription}
          partialDescription={partialDescription}
          revealedTestCases={revealedTestCases}
          availableSpins={availableSpins}
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
          onComplete={handleComplete}
          onOpenSpinWheel={() => setIsSpinWheelOpen(true)}
        />
      )}

      {/* Encouragement Toast */}
      <EncouragementToast
        onShowMessage={(callback) => {
          showEncouragementRef.current = callback;
        }}
      />

      {/* Spin Wheel Modal */}
      <SpinWheel
        isOpen={isSpinWheelOpen}
        onClose={() => setIsSpinWheelOpen(false)}
        onResult={handleSpinWheelResult}
      />
    </div>
  );
}

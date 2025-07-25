import { useGameStore } from "../../../store/gameStore";
import { useSpinWheelStore } from "../../../store/spinWheelStore";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";

export function Game() {
  // Game store for puzzle logic
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

  // Spin wheel store for spin-related state
  const {
    isSpinWheelOpen,
    closeSpinWheel,
    handleSpinResult,
    grantSpin,
    revealMoreTestCases,
    resetForNewPuzzle,
    setShowEncouragementCallback,
  } = useSpinWheelStore();

  const handleLoadRandomPuzzle = async () => {
    await loadRandomPuzzle();
    resetForNewPuzzle(); // Reset all spin-related state for new puzzle
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
        revealMoreTestCases();
        grantSpin(); // Grant another spin for failed attempt
      }
    }, 100); // Small delay to ensure state is updated
  };

  const handleComplete = async () => {
    completePuzzle();
    await loadRandomPuzzle();
    resetForNewPuzzle(); // Reset all spin-related state for new puzzle
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
          onPatternChange={handlePatternChange}
          onTestPattern={handleTestPattern}
          onComplete={handleComplete}
        />
      )}

      {/* Encouragement Toast */}
      <EncouragementToast onShowMessage={setShowEncouragementCallback} />

      {/* Spin Wheel Modal */}
      <SpinWheel
        isOpen={isSpinWheelOpen}
        onClose={closeSpinWheel}
        onResult={handleSpinResult}
      />
    </div>
  );
}

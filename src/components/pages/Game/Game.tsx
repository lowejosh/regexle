import { useGameStore } from "../../../store/gameStore";
import { GameHeader, PuzzleCard, SpinWheel } from "./components";
import type { WheelOption } from "./components";
import { useState } from "react";

export function Game() {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);

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
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePattern(e.target.value);
  };

  const handleTestPattern = () => {
    testPattern();
  };

  const handleComplete = async () => {
    completePuzzle();
    await loadRandomPuzzle();
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

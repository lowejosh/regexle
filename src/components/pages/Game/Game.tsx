import { useGameStore } from "../../../store/gameStore";
import { GameHeader } from "./components/GameHeader/GameHeader";
import { PuzzleCard } from "./components/PuzzleCard/PuzzleCard";
import { SpinWheel } from "./components/SpinWheel/SpinWheel";
import { EncouragementToast } from "./components/EncouragementToast/EncouragementToast";
import type {
  WheelOption,
  WheelOptionId,
} from "./components/SpinWheel/SpinWheel.consts";
import { useState, useRef } from "react";

export function Game() {
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [revealedTestCases, setRevealedTestCases] = useState(1); // Start with 1 test case of each type revealed
  const [availableSpins, setAvailableSpins] = useState(1); // User starts with 1 spin
  const showEncouragementRef = useRef<(() => void) | null>(null);
  const [partialDescription, setPartialDescription] = useState<string | null>(
    null
  );

  // Function to garble exactly half of the characters randomly
  const garbleText = (text: string): string => {
    const chars = text.split("");
    const garbleChars = ["█", "▓", "▒", "░", "?", "*", "#", "@", "&", "%"];

    // Calculate how many characters to garble (half)
    const numToGarble = Math.floor(chars.length / 2);

    // Get random indexes to garble
    const indexesToGarble = new Set<number>();
    while (indexesToGarble.size < numToGarble) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      // Don't garble spaces to maintain readability
      if (chars[randomIndex] !== " ") {
        indexesToGarble.add(randomIndex);
      }
    }

    // Replace characters at selected indexes
    indexesToGarble.forEach((index) => {
      chars[index] =
        garbleChars[Math.floor(Math.random() * garbleChars.length)];
    });

    return chars.join("");
  };

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

  const handleSpinWheelResult = (option: WheelOption) => {
    setAvailableSpins((prev) => Math.max(0, prev - 1)); // Consume a spin

    // Handle different wheel results
    const optionId: WheelOptionId = option.id;
    switch (optionId) {
      case "challenge-description":
        if (currentPuzzle?.description && !showDescription) {
          toggleDescription();
        }
        break;
      case "half-challenge-description":
        // Show partial description with random garbled parts
        if (currentPuzzle?.description) {
          const garbledDesc = garbleText(currentPuzzle.description);
          setPartialDescription(garbledDesc);
          // Clear partial description after 10 seconds
          setTimeout(() => setPartialDescription(null), 10000);
        }
        break;
      case "emotional-support": {
        // Show encouraging message
        if (showEncouragementRef.current) {
          showEncouragementRef.current();
        }
        break;
      }
      case "free-spin":
        // Grant an extra spin
        setAvailableSpins((prev) => prev + 1);
        break;
      case "clippy":
        // Show Clippy-style hint
        break;
      case "rubber-duck":
        // Show rubber duck debugging hint
        break;
      default: {
        // TypeScript will enforce exhaustive checking
        const _exhaustive: never = optionId;
        void _exhaustive;
        break;
      }
    }
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

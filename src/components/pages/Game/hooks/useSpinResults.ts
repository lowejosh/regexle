import { useCallback } from "react";
import { useGameStore } from "../../../../store/gameStore";
import {
  SpinResultProcessor,
  type SpinResultContext,
} from "../utils/spinResultHandlers";
import type {
  WheelOption,
  WheelOptionId,
} from "../components/SpinWheel/SpinWheel.consts";

interface UseSpinResultsProps {
  setPartialDescription: (desc: string | null) => void;
  setAvailableSpins: (updater: (prev: number) => number) => void;
  showEncouragementRef: React.MutableRefObject<(() => void) | null>;
}

export function useSpinResults({
  setPartialDescription,
  setAvailableSpins,
  showEncouragementRef,
}: UseSpinResultsProps) {
  const { currentPuzzle, showDescription, gameResult, toggleDescription } =
    useGameStore();

  const handleSpinWheelResult = useCallback(
    (option: WheelOption) => {
      // Consume a spin first
      setAvailableSpins((prev) => Math.max(0, prev - 1));

      // Create context for handlers
      const context: SpinResultContext = {
        currentPuzzle,
        showDescription,
        gameResult,
        toggleDescription,
        setPartialDescription,
        setAvailableSpins,
        showEncouragement: () => {
          if (showEncouragementRef.current) {
            showEncouragementRef.current();
          }
        },
      };

      // Process the result using the appropriate handler
      const optionId: WheelOptionId = option.id;
      SpinResultProcessor.process(optionId, context);
    },
    [
      currentPuzzle,
      showDescription,
      gameResult,
      toggleDescription,
      setPartialDescription,
      setAvailableSpins,
      showEncouragementRef,
    ]
  );

  return {
    handleSpinWheelResult,
  };
}

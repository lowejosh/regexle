import { Button } from "@/components/ui/Button";
import {
  SPIN_BUTTON_ANIMATIONS,
  SPIN_BUTTON_CONFIG,
} from "./SpinWheelButton.consts";
import type { GameResult } from "../../../../../types/game";

interface SpinWheelButtonProps {
  availableSpins: number;
  gameResult: GameResult | null;
  onOpenSpinWheel: () => void;
}

export function SpinWheelButton({
  availableSpins,
  gameResult,
  onOpenSpinWheel,
}: SpinWheelButtonProps) {
  const hasFailedAttempt = gameResult && !gameResult.isCorrect;
  const shouldHighlight = availableSpins > 0;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onOpenSpinWheel}
      disabled={availableSpins === 0}
      className={`relative transition-all ${SPIN_BUTTON_ANIMATIONS.TRANSITION_DURATION} ${
        shouldHighlight
          ? SPIN_BUTTON_ANIMATIONS.HIGHLIGHT_CLASSES
          : availableSpins > 0
            ? SPIN_BUTTON_ANIMATIONS.HOVER_CLASSES
            : SPIN_BUTTON_ANIMATIONS.DISABLED_CLASSES
      }`}
    >
      {SPIN_BUTTON_CONFIG.EMOJI}

      {/* Multiple spins indicator */}
      {availableSpins > 1 && (
        <span
          className={`absolute -top-2 -right-2 ${SPIN_BUTTON_CONFIG.INDICATOR_COLORS.MULTIPLE_SPINS} text-white dark:text-background text-xs rounded-full w-5 h-5 flex items-center justify-center ${SPIN_BUTTON_ANIMATIONS.INDICATOR_PULSE}`}
        >
          {availableSpins}
        </span>
      )}

      {/* Single spin after failure indicator */}
      {availableSpins === 1 && hasFailedAttempt && (
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 ${SPIN_BUTTON_CONFIG.INDICATOR_COLORS.SINGLE_SPIN_FAILED} rounded-full ${SPIN_BUTTON_ANIMATIONS.INDICATOR_PULSE}`}
        ></span>
      )}
    </Button>
  );
}

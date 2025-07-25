import type { WheelOptionId } from "../components/SpinWheel/SpinWheel.consts";
import type { Puzzle, GameResult } from "../../../../types/game";
import { garbleText } from "./textGarbler";
import { VisualEffectsService } from "./visualEffects";
import { useSpinWheelStore } from "../../../../store/spinWheelStore";

export interface SpinResultContext {
  currentPuzzle: Puzzle | null;
  showDescription: boolean;
  gameResult: GameResult | null;
  // Actions
  toggleDescription: () => void;
  setPartialDescription: (desc: string | null) => void;
  setAvailableSpins: (updater: (prev: number) => number) => void;
  showEncouragement: () => void;
}

export interface SpinResultHandler {
  handle(context: SpinResultContext): void;
}

export class ChallengeDescriptionHandler implements SpinResultHandler {
  handle(context: SpinResultContext): void {
    if (context.currentPuzzle?.description && !context.showDescription) {
      context.toggleDescription();
    }
  }
}

export class HalfChallengeDescriptionHandler implements SpinResultHandler {
  handle(context: SpinResultContext): void {
    if (context.currentPuzzle?.description) {
      const garbledDesc = garbleText(context.currentPuzzle.description);
      context.setPartialDescription(garbledDesc);
    }
  }
}

export class EmotionalSupportHandler implements SpinResultHandler {
  handle(context: SpinResultContext): void {
    context.showEncouragement();
  }
}

export class FreeSpinHandler implements SpinResultHandler {
  handle(context: SpinResultContext): void {
    context.setAvailableSpins((prev) => prev + 1);
  }
}

export class ClippyHandler implements SpinResultHandler {
  handle(): void {
    // TODO: Show Clippy-style hint
    console.log("Clippy would help here!");
  }
}

export class RubberDuckHandler implements SpinResultHandler {
  handle(): void {
    // Activate rubber duck through the store
    useSpinWheelStore.getState().activateRubberDuck();
  }
}

export class ComicSansModeHandler implements SpinResultHandler {
  handle(): void {
    VisualEffectsService.activateComicSansMode();
  }
}

export class VikingModeHandler implements SpinResultHandler {
  handle(): void {
    VisualEffectsService.activateVikingMode();
  }
}

export class UpsideDownModeHandler implements SpinResultHandler {
  handle(): void {
    VisualEffectsService.activateUpsideDownMode();
  }
}

// Handler registry
const SPIN_HANDLERS: Record<WheelOptionId, SpinResultHandler> = {
  "challenge-description": new ChallengeDescriptionHandler(),
  "half-challenge-description": new HalfChallengeDescriptionHandler(),
  "emotional-support": new EmotionalSupportHandler(),
  "free-spin": new FreeSpinHandler(),
  clippy: new ClippyHandler(),
  "rubber-duck": new RubberDuckHandler(),
  "comic-sans-mode": new ComicSansModeHandler(),
  "viking-mode": new VikingModeHandler(),
  "upside-down-mode": new UpsideDownModeHandler(),
};

export class SpinResultProcessor {
  static process(optionId: WheelOptionId, context: SpinResultContext): void {
    const handler = SPIN_HANDLERS[optionId];
    if (handler) {
      handler.handle(context);
    } else {
      console.warn(`No handler found for wheel option: ${optionId}`);
    }
  }
}

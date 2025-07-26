import type { WheelOptionId } from "../components/SpinWheel/SpinWheel.consts";
import type { Puzzle } from "../../../../types/game";
import { garbleText } from "./textGarbler";
import { VisualEffectsService } from "./visualEffects";

export interface SpinResultContext {
  currentPuzzle: Puzzle | null;
  showDescription: boolean;
}

export interface SpinResultActions {
  toggleDescription: () => void;
  setPartialDescription: (desc: string | null) => void;
  setAvailableSpins: (updater: (prev: number) => number) => void;
  showEncouragement: () => void;
  activateRubberDuck: () => void;
  revealMoreTestCases: () => void;
  revealAllTestCases: () => void;
}

const spinHandlers = {
  "challenge-description": (
    context: SpinResultContext,
    actions: SpinResultActions
  ) => {
    if (context.currentPuzzle?.description && !context.showDescription) {
      actions.toggleDescription();
    }
  },

  "half-challenge-description": (
    context: SpinResultContext,
    actions: SpinResultActions
  ) => {
    if (context.currentPuzzle?.description) {
      const garbledDesc = garbleText(context.currentPuzzle.description);
      actions.setPartialDescription(garbledDesc);
    }
  },

  "emotional-support": (
    _context: SpinResultContext,
    actions: SpinResultActions
  ) => {
    actions.showEncouragement();
  },

  "free-spin": (_context: SpinResultContext, actions: SpinResultActions) => {
    actions.setAvailableSpins((prev) => prev + 1);
  },

  clippy: () => {
    // TODO
  },

  "rubber-duck": (_context: SpinResultContext, actions: SpinResultActions) => {
    actions.activateRubberDuck();
  },

  "comic-sans-mode": () => {
    VisualEffectsService.activateComicSansMode();
  },

  "viking-mode": () => {
    VisualEffectsService.activateVikingMode();
  },

  "upside-down-mode": () => {
    VisualEffectsService.activateUpsideDownMode();
  },

  "free-test-case": (
    _context: SpinResultContext,
    actions: SpinResultActions
  ) => {
    actions.revealMoreTestCases();
  },

  "reveal-all-test-cases": (
    _context: SpinResultContext,
    actions: SpinResultActions
  ) => {
    actions.revealAllTestCases();
  },
} as const;

export function processSpinResult(
  optionId: WheelOptionId,
  context: SpinResultContext,
  actions: SpinResultActions
): void {
  const handler = spinHandlers[optionId];
  if (handler) {
    handler(context, actions);
  } else {
    console.warn(`No handler found for wheel option: ${optionId}`);
  }
}

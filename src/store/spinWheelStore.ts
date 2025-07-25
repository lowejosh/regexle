import { create } from "zustand";
import { useGameStore, setGrantSpinHandler } from "./gameStore";
import {
  SpinResultProcessor,
  type WheelOption,
  type WheelOptionId,
} from "../components/pages/Game/components";

interface SpinWheelState {
  // Spin wheel modal state
  isSpinWheelOpen: boolean;
  availableSpins: number;

  // Partial description state
  partialDescription: string | null;

  // Encouragement
  showEncouragementCallback: (() => void) | null;

  // Rubber duck state
  isRubberDuckActive: boolean;
}

interface SpinWheelActions {
  // Modal actions
  openSpinWheel: () => void;
  closeSpinWheel: () => void;

  // Spin management
  setAvailableSpins: (spins: number | ((prev: number) => number)) => void;
  consumeSpin: () => void;
  grantSpin: () => void;

  // Partial description
  setPartialDescription: (description: string | null) => void;
  clearPartialDescription: () => void;

  // Encouragement
  setShowEncouragementCallback: (callback: (() => void) | null) => void;
  showEncouragement: () => void;

  // Rubber duck actions
  activateRubberDuck: () => void;
  deactivateRubberDuck: () => void;

  // Spin result processing
  handleSpinResult: (option: WheelOption) => void;

  // Reset methods
  resetForNewPuzzle: () => void;
  resetAll: () => void;
}

type SpinWheelStore = SpinWheelState & SpinWheelActions;

export const useSpinWheelStore = create<SpinWheelStore>((set, get) => ({
  // Initial state
  isSpinWheelOpen: false,
  availableSpins: 1,
  partialDescription: null,
  showEncouragementCallback: null,
  isRubberDuckActive: false,

  // Modal actions
  openSpinWheel: () => set({ isSpinWheelOpen: true }),
  closeSpinWheel: () => set({ isSpinWheelOpen: false }),

  // Spin management
  setAvailableSpins: (spins) =>
    set({
      availableSpins:
        typeof spins === "function" ? spins(get().availableSpins) : spins,
    }),
  consumeSpin: () =>
    set((state) => ({
      availableSpins: Math.max(0, state.availableSpins - 1),
    })),
  grantSpin: () =>
    set((state) => ({
      availableSpins: state.availableSpins + 1,
    })),

  // Partial description
  setPartialDescription: (description) =>
    set({ partialDescription: description }),
  clearPartialDescription: () => set({ partialDescription: null }),

  // Encouragement
  setShowEncouragementCallback: (callback) =>
    set({ showEncouragementCallback: callback }),
  showEncouragement: () => {
    const { showEncouragementCallback } = get();
    if (showEncouragementCallback) {
      showEncouragementCallback();
    }
  },

  // Rubber duck actions
  activateRubberDuck: () => {
    set({ isRubberDuckActive: true });
    console.log("🦆 Rubber duck debugging activated!");
  },
  deactivateRubberDuck: () => set({ isRubberDuckActive: false }),

  // Spin result processing
  handleSpinResult: (option: WheelOption) => {
    const state = get();

    // Consume a spin first
    state.consumeSpin();

    // Create context for handlers by combining both stores
    const gameState = useGameStore.getState();
    const context = {
      currentPuzzle: gameState.currentPuzzle,
      showDescription: gameState.showDescription,
      gameResult: gameState.gameResult,
      toggleDescription: gameState.toggleDescription,
      setPartialDescription: state.setPartialDescription,
      setAvailableSpins: state.setAvailableSpins,
      showEncouragement: state.showEncouragement,
    };

    // Process the result using the appropriate handler
    const optionId: WheelOptionId = option.id;
    SpinResultProcessor.process(optionId, context);
  },

  // Reset methods
  resetForNewPuzzle: () =>
    set({
      availableSpins: 1,
      partialDescription: null,
      isRubberDuckActive: false,
    }),

  resetAll: () =>
    set({
      isSpinWheelOpen: false,
      availableSpins: 1,
      partialDescription: null,
      showEncouragementCallback: null,
      isRubberDuckActive: false,
    }),
}));

// Set up the grant spin handler callback
setGrantSpinHandler(() => {
  const store = useSpinWheelStore.getState();
  store.grantSpin();
});

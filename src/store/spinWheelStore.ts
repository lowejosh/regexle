import { create } from "zustand";
import { useGameStore, setGrantSpinHandler } from "./gameStore";
import {
  type WheelOption,
  type WheelOptionId,
} from "../components/pages/Game/components";
import { processSpinResult } from "../components/pages/Game/utils/spinResultHandlers";

interface SpinWheelState {
  isSpinWheelOpen: boolean;
  dailySpins: number;
  randomSpins: number;
  currentMode: "daily" | "random";
  partialDescription: string | null;
  showEncouragementCallback: (() => void) | null;
  isRubberDuckActive: boolean;
}

interface SpinWheelActions {
  // Modal actions
  openSpinWheel: () => void;
  closeSpinWheel: () => void;

  // Mode management
  setCurrentMode: (mode: "daily" | "random") => void;

  // Spin management
  getAvailableSpins: () => number;
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
  dailySpins: 1,
  randomSpins: 1,
  currentMode: "daily",
  partialDescription: null,
  showEncouragementCallback: null,
  isRubberDuckActive: false,

  // Modal actions
  openSpinWheel: () => set({ isSpinWheelOpen: true }),
  closeSpinWheel: () => set({ isSpinWheelOpen: false }),

  // Mode management
  setCurrentMode: (mode) => set({ currentMode: mode }),

  // Spin management
  getAvailableSpins: () => {
    const state = get();
    return state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
  },
  setAvailableSpins: (spins) => {
    const state = get();
    const currentSpins =
      state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
    const newSpins = typeof spins === "function" ? spins(currentSpins) : spins;

    if (state.currentMode === "daily") {
      set({ dailySpins: newSpins });
    } else {
      set({ randomSpins: newSpins });
    }
  },
  consumeSpin: () => {
    const state = get();
    if (state.currentMode === "daily") {
      set({ dailySpins: Math.max(0, state.dailySpins - 1) });
    } else {
      set({ randomSpins: Math.max(0, state.randomSpins - 1) });
    }
  },
  grantSpin: () => {
    const state = get();
    if (state.currentMode === "daily") {
      set({ dailySpins: state.dailySpins + 1 });
    } else {
      set({ randomSpins: state.randomSpins + 1 });
    }
  },

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

  // Rubber duck
  activateRubberDuck: () => {
    set({ isRubberDuckActive: true });
  },
  deactivateRubberDuck: () => set({ isRubberDuckActive: false }),

  handleSpinResult: (option: WheelOption) => {
    const state = get();
    state.consumeSpin();

    const gameState = useGameStore.getState();

    const context = {
      currentPuzzle: gameState.currentPuzzle,
      showDescription: gameState.showDescription,
    };

    const actions = {
      toggleDescription: gameState.toggleDescription,
      setPartialDescription: state.setPartialDescription,
      setAvailableSpins: state.setAvailableSpins,
      showEncouragement: state.showEncouragement,
      activateRubberDuck: state.activateRubberDuck,
      revealMoreTestCases: gameState.revealMoreTestCases,
      revealAllTestCases: () => {
        if (gameState.currentPuzzle) {
          const maxRevealable = Math.min(
            gameState.currentPuzzle.testCases.filter((tc) => tc.shouldMatch)
              .length,
            gameState.currentPuzzle.testCases.filter((tc) => !tc.shouldMatch)
              .length
          );
          gameState.setRevealedTestCases(maxRevealable);
        }
      },
    };

    // Process the result using the new handler API
    const optionId: WheelOptionId = option.id;
    processSpinResult(optionId, context, actions);
  },

  // Reset methods
  resetForNewPuzzle: () => {
    const state = get();
    if (state.currentMode === "daily") {
      set({
        dailySpins: 1,
        partialDescription: null,
        isRubberDuckActive: false,
      });
    } else {
      set({
        randomSpins: 1,
        partialDescription: null,
        isRubberDuckActive: false,
      });
    }
  },

  resetAll: () =>
    set({
      isSpinWheelOpen: false,
      dailySpins: 1,
      randomSpins: 1,
      currentMode: "daily",
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

import { create } from "zustand";
import {
  useGameStore,
  setGrantSpinHandler,
  setResetSpinWheelHandler,
} from "./gameStore";
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
  openSpinWheel: () => void;
  closeSpinWheel: () => void;
  setCurrentMode: (mode: "daily" | "random") => void;
  getAvailableSpins: () => number;
  setAvailableSpins: (spins: number | ((prev: number) => number)) => void;
  consumeSpin: () => void;
  grantSpin: () => void;
  setPartialDescription: (description: string | null) => void;
  clearPartialDescription: () => void;
  setShowEncouragementCallback: (callback: (() => void) | null) => void;
  showEncouragement: () => void;
  activateRubberDuck: () => void;
  deactivateRubberDuck: () => void;
  handleSpinResult: (option: WheelOption) => void;
  resetForNewPuzzle: () => void;
  resetAll: () => void;
}

type SpinWheelStore = SpinWheelState & SpinWheelActions;

export const useSpinWheelStore = create<SpinWheelStore>((set, get) => ({
  isSpinWheelOpen: false,
  dailySpins: 1,
  randomSpins: 1,
  currentMode: "daily",
  partialDescription: null,
  showEncouragementCallback: null,
  isRubberDuckActive: false,

  openSpinWheel: () => set({ isSpinWheelOpen: true }),
  closeSpinWheel: () => set({ isSpinWheelOpen: false }),

  setCurrentMode: (mode) => set({ currentMode: mode }),

  getAvailableSpins: () => {
    const state = get();
    return state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
  },
  setAvailableSpins: (spins) => {
    const state = get();
    const currentSpins =
      state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
    const newSpins = typeof spins === "function" ? spins(currentSpins) : spins;
    const key = state.currentMode === "daily" ? "dailySpins" : "randomSpins";
    set({ [key]: newSpins });
  },
  consumeSpin: () => {
    const state = get();
    const key = state.currentMode === "daily" ? "dailySpins" : "randomSpins";
    const currentValue =
      state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
    set({ [key]: Math.max(0, currentValue - 1) });
  },
  grantSpin: () => {
    const state = get();
    const key = state.currentMode === "daily" ? "dailySpins" : "randomSpins";
    const currentValue =
      state.currentMode === "daily" ? state.dailySpins : state.randomSpins;
    set({ [key]: currentValue + 1 });
  },

  setPartialDescription: (description) =>
    set({ partialDescription: description }),
  clearPartialDescription: () => set({ partialDescription: null }),

  setShowEncouragementCallback: (callback) =>
    set({ showEncouragementCallback: callback }),
  showEncouragement: () => {
    const { showEncouragementCallback } = get();
    if (showEncouragementCallback) {
      showEncouragementCallback();
    }
  },

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
      deactivateRubberDuck: state.deactivateRubberDuck,
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

    const optionId: WheelOptionId = option.id;
    processSpinResult(optionId, context, actions);
  },

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

setGrantSpinHandler(() => {
  const store = useSpinWheelStore.getState();
  store.grantSpin();
});

setResetSpinWheelHandler(() => {
  const store = useSpinWheelStore.getState();
  store.resetForNewPuzzle();
});

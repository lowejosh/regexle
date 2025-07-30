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
  practiceSpins: number;
  currentMode: "daily" | "practice";
  partialDescription: string | null;
  showEncouragementCallback: (() => void) | null;
  isRubberDuckActive: boolean;
  isTarotReadingActive: boolean;
}

interface SpinWheelActions {
  openSpinWheel: () => void;
  closeSpinWheel: () => void;
  setCurrentMode: (mode: "daily" | "practice") => void;
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
  activateTarotReading: () => void;
  deactivateTarotReading: () => void;
  handleSpinResult: (option: WheelOption) => void;
  resetForNewPuzzle: () => void;
  resetAll: () => void;
}

type SpinWheelStore = SpinWheelState & SpinWheelActions;

export const useSpinWheelStore = create<SpinWheelStore>((set, get) => ({
  isSpinWheelOpen: false,
  dailySpins: 1,
  practiceSpins: 1,
  currentMode: "daily",
  partialDescription: null,
  showEncouragementCallback: null,
  isRubberDuckActive: false,
  isTarotReadingActive: false,

  openSpinWheel: () => set({ isSpinWheelOpen: true }),
  closeSpinWheel: () => set({ isSpinWheelOpen: false }),

  setCurrentMode: (mode) => set({ currentMode: mode }),

  getAvailableSpins: () => {
    const state = get();
    return state.currentMode === "daily" ? state.dailySpins : state.practiceSpins;
  },
  setAvailableSpins: (spins) => {
    const state = get();
    const currentSpins =
      state.currentMode === "daily" ? state.dailySpins : state.practiceSpins;
    const newSpins = typeof spins === "function" ? spins(currentSpins) : spins;
    const key = state.currentMode === "daily" ? "dailySpins" : "practiceSpins";
    set({ [key]: newSpins });
  },
  consumeSpin: () => {
    const state = get();
    const key = state.currentMode === "daily" ? "dailySpins" : "practiceSpins";
    const currentValue =
      state.currentMode === "daily" ? state.dailySpins : state.practiceSpins;
    set({ [key]: Math.max(0, currentValue - 1) });
  },
  grantSpin: () => {
    const state = get();
    const key = state.currentMode === "daily" ? "dailySpins" : "practiceSpins";
    const currentValue =
      state.currentMode === "daily" ? state.dailySpins : state.practiceSpins;
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

  activateTarotReading: () => {
    set({ isTarotReadingActive: true });
  },
  deactivateTarotReading: () => set({ isTarotReadingActive: false }),

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
      activateTarotReading: state.activateTarotReading,
      deactivateTarotReading: state.deactivateTarotReading,
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
        isTarotReadingActive: false,
      });
    } else {
      set({
        practiceSpins: 1,
        partialDescription: null,
        isRubberDuckActive: false,
        isTarotReadingActive: false,
      });
    }
  },

  resetAll: () =>
    set({
      isSpinWheelOpen: false,
      dailySpins: 1,
      practiceSpins: 1,
      currentMode: "daily",
      partialDescription: null,
      showEncouragementCallback: null,
      isRubberDuckActive: false,
      isTarotReadingActive: false,
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

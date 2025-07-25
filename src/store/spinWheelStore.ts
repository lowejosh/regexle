import { create } from "zustand";
import { useGameStore, setTestFailureHandler } from "./gameStore";
import {
  SpinResultProcessor,
  type WheelOption,
  type WheelOptionId,
} from "../components/pages/Game/components";

interface SpinWheelState {
  // Spin wheel modal state
  isSpinWheelOpen: boolean;
  availableSpins: number;

  // Test case revelation
  revealedTestCases: number;

  // Partial description state
  partialDescription: string | null;

  // Encouragement
  showEncouragementCallback: (() => void) | null;
}

interface SpinWheelActions {
  // Modal actions
  openSpinWheel: () => void;
  closeSpinWheel: () => void;

  // Spin management
  setAvailableSpins: (spins: number | ((prev: number) => number)) => void;
  consumeSpin: () => void;
  grantSpin: () => void;

  // Test case revelation
  setRevealedTestCases: (cases: number | ((prev: number) => number)) => void;
  revealMoreTestCases: () => void;

  // Partial description
  setPartialDescription: (description: string | null) => void;
  clearPartialDescription: () => void;

  // Encouragement
  setShowEncouragementCallback: (callback: (() => void) | null) => void;
  showEncouragement: () => void;

  // Spin result processing
  handleSpinResult: (option: WheelOption) => void;

  // Test failure handling
  handleTestFailure: () => void;

  // Reset methods
  resetForNewPuzzle: () => void;
  resetAll: () => void;
}

type SpinWheelStore = SpinWheelState & SpinWheelActions;

export const useSpinWheelStore = create<SpinWheelStore>((set, get) => ({
  // Initial state
  isSpinWheelOpen: false,
  availableSpins: 1,
  revealedTestCases: 1,
  partialDescription: null,
  showEncouragementCallback: null,

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

  // Test case revelation
  setRevealedTestCases: (cases) =>
    set({
      revealedTestCases:
        typeof cases === "function" ? cases(get().revealedTestCases) : cases,
    }),
  revealMoreTestCases: () => {
    const { currentPuzzle } = useGameStore.getState();
    if (currentPuzzle) {
      const maxRevealable = Math.min(
        currentPuzzle.testCases.filter((tc) => tc.shouldMatch).length,
        currentPuzzle.testCases.filter((tc) => !tc.shouldMatch).length
      );
      set((state) => ({
        revealedTestCases: Math.min(state.revealedTestCases + 1, maxRevealable),
      }));
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

  // Test failure handling
  handleTestFailure: () => {
    const state = get();
    // Reveal more test cases and grant a spin for failed attempts
    state.revealMoreTestCases();
    state.grantSpin();
  },

  // Reset methods
  resetForNewPuzzle: () =>
    set({
      revealedTestCases: 1,
      availableSpins: 1,
      partialDescription: null,
    }),

  resetAll: () =>
    set({
      isSpinWheelOpen: false,
      availableSpins: 1,
      revealedTestCases: 1,
      partialDescription: null,
      showEncouragementCallback: null,
    }),
}));

// Set up the test failure handler callback
setTestFailureHandler(() => {
  const store = useSpinWheelStore.getState();
  store.handleTestFailure();
});

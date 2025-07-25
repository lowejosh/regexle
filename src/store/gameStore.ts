import { create } from "zustand";
import type { GameState, Puzzle } from "../types/game";
import { RegexGameEngine } from "../engine/gameEngine";
import { puzzleLoader } from "../data/puzzleLoader";
import { puzzleService, type GameMode } from "../services/puzzleService";

// Callback for granting spins on test failure (set from spin wheel store)
let grantSpinCallback: (() => void) | null = null;

export const setGrantSpinHandler = (callback: (() => void) | null) => {
  grantSpinCallback = callback;
};

interface GameStore extends GameState {
  // Actions
  loadPuzzle: (puzzle: Puzzle) => void;
  loadRandomPuzzle: (difficulty?: Puzzle["difficulty"]) => Promise<void>;
  loadDailyPuzzle: () => Promise<void>;
  loadPuzzleByMode: (
    mode: GameMode,
    difficulty?: Puzzle["difficulty"]
  ) => Promise<void>;
  updatePattern: (pattern: string) => void;
  testPattern: () => void;
  testPatternWithEffects: () => void;
  completePuzzle: () => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Puzzle["difficulty"]) => void;
  toggleDescription: () => void;
  // Test case revelation
  setRevealedTestCases: (cases: number | ((prev: number) => number)) => void;
  revealMoreTestCases: () => void;
  handleTestFailure: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentPuzzle: null,
  userPattern: "",
  gameResult: null,
  completedPuzzles: new Set(),
  currentDifficulty: "easy",
  showDescription: false,
  revealedTestCases: 1,
  attempts: 0,

  // Actions
  loadPuzzle: (puzzle: Puzzle) => {
    set({
      currentPuzzle: puzzle,
      userPattern: "",
      gameResult: null,
      showDescription: false, // Hide description for new puzzle
      revealedTestCases: 1, // Reset to 1 for new puzzle
      attempts: 0, // Reset attempts for new puzzle
    });
  },

  loadRandomPuzzle: async (difficulty?: Puzzle["difficulty"]) => {
    try {
      const puzzle = await puzzleLoader.getRandomPuzzle(difficulty);
      if (puzzle) {
        set({
          currentPuzzle: puzzle,
          userPattern: "",
          gameResult: null,
          showDescription: false,
          revealedTestCases: 1, // Reset to 1 for new puzzle
          attempts: 0, // Reset attempts for new puzzle
        });
      }
    } catch (error) {
      console.error("Failed to load random puzzle:", error);
    }
  },

  loadDailyPuzzle: async () => {
    try {
      const puzzle = await puzzleLoader.getDailyPuzzle();
      if (puzzle) {
        set({
          currentPuzzle: puzzle,
          userPattern: "",
          gameResult: null,
          showDescription: false,
          revealedTestCases: 1, // Reset to 1 for new puzzle
          attempts: 0, // Reset attempts for new puzzle
        });
      }
    } catch (error) {
      console.error("Failed to load daily puzzle:", error);
    }
  },

  loadPuzzleByMode: async (
    mode: GameMode,
    difficulty?: Puzzle["difficulty"]
  ) => {
    try {
      const puzzle = await puzzleService.loadPuzzle(mode, difficulty);
      if (puzzle) {
        set({
          currentPuzzle: puzzle,
          userPattern: "",
          gameResult: null,
          showDescription: false,
          revealedTestCases: 1, // Reset to 1 for new puzzle
          attempts: 0, // Reset attempts for new puzzle
        });
      }
    } catch (error) {
      console.error(`Failed to load ${mode} puzzle:`, error);
    }
  },

  updatePattern: (pattern: string) => {
    set({ userPattern: pattern });
    // Remove auto-testing - only test on button press
  },

  testPattern: () => {
    const state = get();
    if (!state.currentPuzzle || !state.userPattern.trim()) return;

    const result = RegexGameEngine.testPattern(
      state.userPattern,
      state.currentPuzzle.testCases
    );
    set({
      gameResult: result,
      attempts: state.attempts + 1, // Increment attempt counter
    });
  },

  // Test pattern and handle post-test logic (side effects)
  testPatternWithEffects: () => {
    const state = get();
    if (!state.currentPuzzle || !state.userPattern.trim()) return;

    // First, run the test
    const result = RegexGameEngine.testPattern(
      state.userPattern,
      state.currentPuzzle.testCases
    );
    set({
      gameResult: result,
      attempts: state.attempts + 1, // Increment attempt counter
    });

    // Then handle side effects asynchronously
    setTimeout(() => {
      if (result && !result.isCorrect && state.currentPuzzle) {
        // Handle test failure directly
        state.handleTestFailure();
      }
    }, 100);
  },

  completePuzzle: () => {
    const state = get();
    if (!state.currentPuzzle || !state.gameResult?.isCorrect) return;

    const newCompleted = new Set(state.completedPuzzles);
    newCompleted.add(state.currentPuzzle.id);

    set({ completedPuzzles: newCompleted });
  },

  resetGame: () => {
    set({
      currentPuzzle: null,
      userPattern: "",
      gameResult: null,
      showDescription: false,
      revealedTestCases: 1,
    });
  },

  setDifficulty: (difficulty: Puzzle["difficulty"]) => {
    set({ currentDifficulty: difficulty });
  },

  toggleDescription: () => {
    const state = get();
    set({ showDescription: !state.showDescription });
  },

  // Test case revelation actions
  setRevealedTestCases: (cases) =>
    set({
      revealedTestCases:
        typeof cases === "function" ? cases(get().revealedTestCases) : cases,
    }),

  revealMoreTestCases: () => {
    const state = get();
    if (state.currentPuzzle) {
      const maxRevealable = Math.min(
        state.currentPuzzle.testCases.filter((tc) => tc.shouldMatch).length,
        state.currentPuzzle.testCases.filter((tc) => !tc.shouldMatch).length
      );
      set((state) => ({
        revealedTestCases: Math.min(state.revealedTestCases + 1, maxRevealable),
      }));
    }
  },

  handleTestFailure: () => {
    const state = get();
    state.revealMoreTestCases();
    // Notify spin wheel store to grant a spin
    if (grantSpinCallback) {
      grantSpinCallback();
    }
  },
}));

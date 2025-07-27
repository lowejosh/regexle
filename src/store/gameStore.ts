import { create } from "zustand";
import type { GameState, Puzzle } from "../types/game";
import { RegexGameEngine } from "../engine/gameEngine";
import { puzzleLoader } from "../data/puzzleLoader";
import { puzzleService, type GameMode } from "../services/puzzleService";
import { useStatisticsStore } from "./statisticsStore";

let grantSpinCallback: (() => void) | null = null;
let resetSpinWheelCallback: (() => void) | null = null;

export const setGrantSpinHandler = (callback: (() => void) | null) => {
  grantSpinCallback = callback;
};

export const setResetSpinWheelHandler = (callback: (() => void) | null) => {
  resetSpinWheelCallback = callback;
};

const resetPuzzleState = () => {
  if (resetSpinWheelCallback) {
    resetSpinWheelCallback();
  }
  return {
    userPattern: "",
    gameResult: null,
    showDescription: false,
    revealedTestCases: 1,
    attempts: 0,
    solutionRevealed: false,
  };
};

interface GameStore extends GameState {
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
  setSolutionRevealed: (revealed: boolean) => void;
  setRevealedTestCases: (cases: number | ((prev: number) => number)) => void;
  revealMoreTestCases: () => void;
  handleTestFailure: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentPuzzle: null,
  userPattern: "",
  gameResult: null,
  completedPuzzles: new Set(),
  currentDifficulty: "easy",
  currentMode: "random",
  showDescription: false,
  revealedTestCases: 1,
  attempts: 0,
  solutionRevealed: false,
  loadPuzzle: (puzzle: Puzzle) => {
    set({
      currentPuzzle: puzzle,
      ...resetPuzzleState(),
    });
  },

  loadRandomPuzzle: async (difficulty?: Puzzle["difficulty"]) => {
    try {
      const puzzle = await puzzleLoader.getRandomPuzzle(difficulty);
      if (puzzle) {
        set({
          currentPuzzle: puzzle,
          currentMode: "random",
          ...resetPuzzleState(),
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
          currentMode: "daily",
          ...resetPuzzleState(),
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
          currentMode: mode,
          ...resetPuzzleState(),
        });
      }
    } catch (error) {
      console.error(`Failed to load ${mode} puzzle:`, error);
    }
  },

  updatePattern: (pattern: string) => {
    set({ userPattern: pattern });
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
      attempts: state.attempts + 1,
    });
  },

  testPatternWithEffects: () => {
    const state = get();
    if (!state.currentPuzzle || !state.userPattern.trim()) return;

    const result = RegexGameEngine.testPattern(
      state.userPattern,
      state.currentPuzzle.testCases
    );
    set({
      gameResult: result,
      attempts: state.attempts + 1,
    });

    if (result && !result.isCorrect && state.currentPuzzle) {
      state.handleTestFailure();
    } else if (result && result.isCorrect) {
      state.completePuzzle();
    }
  },

  completePuzzle: () => {
    const state = get();

    if (!state.currentPuzzle || !state.gameResult?.isCorrect) return;

    const newCompleted = new Set(state.completedPuzzles);
    newCompleted.add(state.currentPuzzle.id);

    useStatisticsStore
      .getState()
      .recordSolve(
        state.currentPuzzle.id,
        state.currentPuzzle.difficulty,
        state.attempts,
        state.solutionRevealed,
        state.currentMode
      );

    set({ completedPuzzles: newCompleted });
  },

  resetGame: () => {
    set({
      currentPuzzle: null,
      userPattern: "",
      gameResult: null,
      showDescription: false,
      revealedTestCases: 1,
      solutionRevealed: false,
    });
  },

  setDifficulty: (difficulty: Puzzle["difficulty"]) => {
    set({ currentDifficulty: difficulty });
  },

  toggleDescription: () => {
    const state = get();
    set({ showDescription: !state.showDescription });
  },

  setSolutionRevealed: (revealed: boolean) => {
    set({ solutionRevealed: revealed });
  },

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
    if (grantSpinCallback) {
      grantSpinCallback();
    }
  },
}));

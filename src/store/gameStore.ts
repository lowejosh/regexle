import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, Puzzle, CompletedPuzzle } from "../types/game";
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

  // New computed statistics methods
  getCompletionRateByDifficulty: () => Record<string, number>;
  getTotalPuzzlesByDifficulty: () => Record<string, number>;
  getRecentCompletions: (limit?: number) => CompletedPuzzle[];
  getCompletionStreak: () => number;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      userPattern: "",
      gameResult: null,
      completedPuzzles: new Set(),
      completedPuzzlesData: new Map(),
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

    if (result.isCorrect) {
      get().completePuzzle();
    } else {
      get().handleTestFailure();
    }
  },

  completePuzzle: () => {
    const state = get();

    if (!state.currentPuzzle || !state.gameResult?.isCorrect) return;

    const newCompleted = new Set(state.completedPuzzles);
    newCompleted.add(state.currentPuzzle.id);

    const newCompletedData = new Map(state.completedPuzzlesData);
    newCompletedData.set(state.currentPuzzle.id, {
      id: state.currentPuzzle.id,
      timestamp: Date.now(),
      attempts: state.attempts,
    });

    useStatisticsStore
      .getState()
      .recordSolve(
        state.currentPuzzle.id,
        state.currentPuzzle.difficulty,
        state.attempts,
        state.solutionRevealed,
        state.currentMode
      );

    set({
      completedPuzzles: newCompleted,
      completedPuzzlesData: newCompletedData,
    });
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

  // New statistics methods
  getCompletionRateByDifficulty: () => {
    const state = get();
    const completionRates: Record<string, number> = {};
    const difficulties = ["easy", "medium", "hard", "expert", "nightmare"];

    difficulties.forEach((difficulty) => {
      const totalInDifficulty =
        state.getTotalPuzzlesByDifficulty()[difficulty] || 0;
      const completedInDifficulty = Array.from(state.completedPuzzles).filter(
        (id) => id.includes(`-${difficulty}-`)
      ).length;

      completionRates[difficulty] =
        totalInDifficulty > 0
          ? (completedInDifficulty / totalInDifficulty) * 100
          : 0;
    });

    return completionRates;
  },

  getTotalPuzzlesByDifficulty: () => {
    // Based on the actual manifest data
    return {
      easy: 13,
      medium: 12,
      hard: 13,
      expert: 9,
      nightmare: 2,
    };
  },

  getRecentCompletions: (limit = 10) => {
    const state = get();
    const completedData = Array.from(state.completedPuzzlesData.values());

    return completedData
      .sort(
        (a: CompletedPuzzle, b: CompletedPuzzle) => b.timestamp - a.timestamp
      )
      .slice(0, limit);
  },

  getCompletionStreak: () => {
    // Calculate current completion streak
    // This would need timestamp tracking for accurate implementation
    return 0;
  },
}),
{
  name: "regexle-game-store",
  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const { state } = JSON.parse(str);
      return {
        ...state,
        completedPuzzles: new Set(state.completedPuzzles || []),
        completedPuzzlesData: new Map(Object.entries(state.completedPuzzlesData || {})),
      };
    },
    setItem: (name, newValue) => {
      const { state } = newValue;
      const serializedState = {
        ...state,
        completedPuzzles: Array.from(state.completedPuzzles || []),
        completedPuzzlesData: Object.fromEntries(state.completedPuzzlesData || []),
      };
      localStorage.setItem(name, JSON.stringify({ state: serializedState, version: 0 }));
    },
    removeItem: (name) => localStorage.removeItem(name),
  },
}
));

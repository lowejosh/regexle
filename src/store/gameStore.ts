import { create } from "zustand";
import type { GameState, Puzzle } from "../types/game";
import { RegexGameEngine } from "../engine/gameEngine";

interface GameStore extends GameState {
  // Actions
  loadPuzzle: (puzzle: Puzzle) => void;
  updatePattern: (pattern: string) => void;
  testPattern: () => void;
  completePuzzle: () => void;
  resetGame: () => void;
  setDifficulty: (difficulty: Puzzle["difficulty"]) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentPuzzle: null,
  userPattern: "",
  gameResult: null,
  completedPuzzles: new Set(),
  currentDifficulty: "easy",

  // Actions
  loadPuzzle: (puzzle: Puzzle) => {
    set({
      currentPuzzle: puzzle,
      userPattern: "",
      gameResult: null,
    });
  },

  updatePattern: (pattern: string) => {
    set({ userPattern: pattern });

    // Auto-test the pattern when it changes
    const state = get();
    if (state.currentPuzzle) {
      const result = RegexGameEngine.testPattern(
        pattern,
        state.currentPuzzle.testCases
      );
      set({ gameResult: result });
    }
  },

  testPattern: () => {
    const state = get();
    if (!state.currentPuzzle) return;

    const result = RegexGameEngine.testPattern(
      state.userPattern,
      state.currentPuzzle.testCases
    );
    set({ gameResult: result });
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
    });
  },

  setDifficulty: (difficulty: Puzzle["difficulty"]) => {
    set({ currentDifficulty: difficulty });
  },
}));

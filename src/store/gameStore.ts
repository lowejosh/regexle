import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, Puzzle, DailyPuzzleState } from "../types/game";
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

// Helper functions for daily puzzle state
const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  // Daily puzzle state
  dailyPuzzleState: DailyPuzzleState;

  // Existing methods
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

  // Daily puzzle specific methods
  isDailyPuzzleCompleted: () => boolean;
  getDailyPuzzleCompletion: () => DailyPuzzleState | null;
  clearDailyPuzzleIfNewDay: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      userPattern: "",
      gameResult: null,
      currentDifficulty: "easy",
      currentMode: "random",
      showDescription: false,
      revealedTestCases: 1,
      attempts: 0,
      solutionRevealed: false,

      // Daily puzzle state
      dailyPuzzleState: {
        completedDate: null,
        completedPuzzleId: null,
        completionUserPattern: null,
        completionGameResult: null,
        completionAttempts: 0,
        completionSolutionRevealed: false,
      },
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
          // Clear daily puzzle state if it's a new day
          get().clearDailyPuzzleIfNewDay();

          const puzzle = await puzzleLoader.getDailyPuzzle();
          if (puzzle) {
            const isDailyCompleted = get().isDailyPuzzleCompleted();
            const completionData = get().getDailyPuzzleCompletion();

            if (
              isDailyCompleted &&
              completionData &&
              completionData.completedPuzzleId === puzzle.id
            ) {
              // Restore completed state
              set({
                currentPuzzle: puzzle,
                currentMode: "daily",
                userPattern: completionData.completionUserPattern || "",
                gameResult: completionData.completionGameResult,
                attempts: completionData.completionAttempts,
                solutionRevealed: completionData.completionSolutionRevealed,
                showDescription: false,
                revealedTestCases: puzzle.testCases.length, // Show all test cases for completed puzzle
              });
            } else {
              // Fresh daily puzzle
              set({
                currentPuzzle: puzzle,
                currentMode: "daily",
                ...resetPuzzleState(),
              });
            }
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

        // Record in statistics
        useStatisticsStore
          .getState()
          .recordSolve(
            state.currentPuzzle.id,
            state.currentPuzzle.difficulty,
            state.attempts,
            state.solutionRevealed,
            state.currentMode
          );

        // Save daily puzzle completion state
        if (state.currentMode === "daily") {
          set({
            dailyPuzzleState: {
              completedDate: getTodayDateString(),
              completedPuzzleId: state.currentPuzzle!.id,
              completionUserPattern: state.userPattern,
              completionGameResult: state.gameResult,
              completionAttempts: state.attempts,
              completionSolutionRevealed: state.solutionRevealed,
            },
          });
        }
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
            typeof cases === "function"
              ? cases(get().revealedTestCases)
              : cases,
        }),

      revealMoreTestCases: () => {
        const state = get();
        if (state.currentPuzzle) {
          const maxRevealable = Math.min(
            state.currentPuzzle.testCases.filter((tc) => tc.shouldMatch).length,
            state.currentPuzzle.testCases.filter((tc) => !tc.shouldMatch).length
          );
          set((state) => ({
            revealedTestCases: Math.min(
              state.revealedTestCases + 1,
              maxRevealable
            ),
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

      // Daily puzzle specific methods
      isDailyPuzzleCompleted: () => {
        const state = get();
        const today = getTodayDateString();
        return (
          state.dailyPuzzleState.completedDate === today &&
          state.dailyPuzzleState.completedPuzzleId !== null
        );
      },

      getDailyPuzzleCompletion: () => {
        const state = get();
        const today = getTodayDateString();
        if (state.dailyPuzzleState.completedDate === today) {
          return state.dailyPuzzleState;
        }
        return null;
      },

      clearDailyPuzzleIfNewDay: () => {
        const state = get();
        const today = getTodayDateString();
        if (
          state.dailyPuzzleState.completedDate &&
          state.dailyPuzzleState.completedDate !== today
        ) {
          set({
            dailyPuzzleState: {
              completedDate: null,
              completedPuzzleId: null,
              completionUserPattern: null,
              completionGameResult: null,
              completionAttempts: 0,
              completionSolutionRevealed: false,
            },
          });
        }
      },
    }),
    {
      name: "regexle-game-store",
      version: 1,
    }
  )
);

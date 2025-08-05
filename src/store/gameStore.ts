import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, Puzzle, DailyPuzzleState, PracticePuzzleStates } from "../types/game";
import { RegexGameEngine } from "../engine/gameEngine";
import { puzzleLoader } from "../data/puzzleLoader";
import { useStatisticsStore } from "./statisticsStore";

export type GameMode = "daily" | "practice";

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
    showRegexExplosion: false,
  };
};

interface GameStore extends GameState {
  // Daily puzzle state
  dailyPuzzleState: DailyPuzzleState;
  
  // Practice puzzle states
  practicePuzzleStates: PracticePuzzleStates;

  // Existing methods
  loadPuzzle: (puzzle: Puzzle) => void;
  loadRandomPuzzle: (difficulty?: Puzzle["difficulty"]) => Promise<void>;
  loadDailyPuzzle: () => Promise<void>;
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
  clearRegexExplosion: () => void;

  // Daily puzzle specific methods
  isDailyPuzzleCompleted: () => boolean;
  getDailyPuzzleCompletion: () => DailyPuzzleState | null;
  clearDailyPuzzleIfNewDay: () => void;
  forceRefreshDailyPuzzle: () => Promise<void>;
  saveDailyPuzzleState: () => void;
  
  // Practice puzzle state methods
  savePracticePuzzleState: () => void;
  loadPracticePuzzleState: (puzzleId: string) => void;
  clearPracticePuzzleState: (puzzleId: string) => void;
  
  // Anti-cheat methods
  getCurrentDailyPuzzleId: () => string;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentPuzzle: null,
      userPattern: "",
      gameResult: null,
      currentDifficulty: "easy",
      currentMode: "practice",
      showDescription: false,
      revealedTestCases: 1,
      attempts: 0,
      solutionRevealed: false,
      showRegexExplosion: false,

      // Daily puzzle state
      dailyPuzzleState: {
        completedDate: null,
        completedPuzzleId: null,
        completionUserPattern: null,
        completionGameResult: null,
        completionAttempts: 0,
        completionSolutionRevealed: false,
        completionRevealedTestCases: 1,
        completionShowDescription: false,
      },
      
      // Practice puzzle states
      practicePuzzleStates: {},
      loadPuzzle: (puzzle: Puzzle) => {
        // Save current practice state if we're switching puzzles
        const currentState = get();
        if (currentState.currentPuzzle && currentState.currentMode === "practice") {
          get().savePracticePuzzleState();
        }
        
        // Check if we have saved state for this puzzle
        const savedState = currentState.practicePuzzleStates[puzzle.id];
        
        // Set the new puzzle with either saved state or reset state
        if (savedState) {
          // Load with saved state
          set({
            currentPuzzle: puzzle,
            currentMode: "practice",
            userPattern: savedState.userPattern,
            gameResult: savedState.gameResult,
            showDescription: savedState.showDescription,
            revealedTestCases: savedState.revealedTestCases,
            attempts: savedState.attempts,
            solutionRevealed: savedState.solutionRevealed,
            showRegexExplosion: false,
          });
        } else {
          // Load with fresh state
          set({
            currentPuzzle: puzzle,
            currentMode: "practice",
            ...resetPuzzleState(),
          });
        }
        
        // Reset spin wheel for new puzzle
        if (resetSpinWheelCallback) {
          resetSpinWheelCallback();
        }
      },

      loadRandomPuzzle: async (difficulty?: Puzzle["difficulty"]) => {
        try {
          const puzzle = await puzzleLoader.getRandomPuzzle(difficulty);
          if (puzzle) {
            set({
              currentPuzzle: puzzle,
              currentMode: "practice",
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
            const dailyState = get().dailyPuzzleState;
            const isDailyCompleted = get().isDailyPuzzleCompleted();
            
            // Check if we have saved state for today's puzzle (completed or in-progress)
            if (dailyState && dailyState.completedPuzzleId === puzzle.id) {
              // Restore saved state (whether completed or in-progress)
              const revealedTestCases = isDailyCompleted 
                ? puzzle.testCases.length 
                : (dailyState.completionRevealedTestCases || 1);
                
              set({
                currentPuzzle: puzzle,
                currentMode: "daily",
                userPattern: dailyState.completionUserPattern || "",
                gameResult: dailyState.completionGameResult,
                attempts: dailyState.completionAttempts,
                solutionRevealed: dailyState.completionSolutionRevealed,
                showDescription: dailyState.completionShowDescription || false,
                revealedTestCases,
                showRegexExplosion: false,
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

      updatePattern: (pattern: string) => {
        set({ userPattern: pattern });
        
        // Auto-save state for both modes
        const state = get();
        if (state.currentMode === "practice") {
          get().savePracticePuzzleState();
        } else if (state.currentMode === "daily") {
          get().saveDailyPuzzleState();
        }
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
        
        // Auto-save state after test for both modes
        if (state.currentMode === "practice") {
          get().savePracticePuzzleState();
        } else if (state.currentMode === "daily") {
          get().saveDailyPuzzleState();
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
              completionRevealedTestCases: state.revealedTestCases,
              completionShowDescription: state.showDescription,
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
          showRegexExplosion: false,
        });
      },

      setDifficulty: (difficulty: Puzzle["difficulty"]) => {
        set({ currentDifficulty: difficulty });
      },

      toggleDescription: () => {
        const state = get();
        set({ showDescription: !state.showDescription });
        
        // Auto-save state for both modes
        if (state.currentMode === "practice") {
          get().savePracticePuzzleState();
        } else if (state.currentMode === "daily") {
          get().saveDailyPuzzleState();
        }
      },

      setSolutionRevealed: (revealed: boolean) => {
        set({ solutionRevealed: revealed });
        
        // Auto-save state for both modes
        const state = get();
        if (state.currentMode === "practice") {
          get().savePracticePuzzleState();
        } else if (state.currentMode === "daily") {
          get().saveDailyPuzzleState();
        }
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

        // Check if user has reached 10 attempts without solving
        if (state.attempts === 10) {
          set({ showRegexExplosion: true });
        }

        state.revealMoreTestCases();
        if (grantSpinCallback) {
          grantSpinCallback();
        }
      },

      clearRegexExplosion: () => {
        set({ showRegexExplosion: false });
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
              completionRevealedTestCases: 1,
              completionShowDescription: false,
            },
          });
        }
      },

      forceRefreshDailyPuzzle: async () => {
        // Force clear daily puzzle state regardless of date
        set({
          dailyPuzzleState: {
            completedDate: null,
            completedPuzzleId: null,
            completionUserPattern: null,
            completionGameResult: null,
            completionAttempts: 0,
            completionSolutionRevealed: false,
            completionRevealedTestCases: 1,
            completionShowDescription: false,
          },
        });

        // Load the new daily puzzle
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
          console.error("Failed to force refresh daily puzzle:", error);
        }
      },
      
      saveDailyPuzzleState: () => {
        const state = get();
        if (!state.currentPuzzle || state.currentMode !== "daily") return;
        
        // Save current progress (even if not completed)
        set({
          dailyPuzzleState: {
            completedDate: state.gameResult?.isCorrect ? getTodayDateString() : null,
            completedPuzzleId: state.currentPuzzle.id,
            completionUserPattern: state.userPattern,
            completionGameResult: state.gameResult,
            completionAttempts: state.attempts,
            completionSolutionRevealed: state.solutionRevealed,
            completionRevealedTestCases: state.revealedTestCases,
            completionShowDescription: state.showDescription,
          },
        });
      },
      
      // Practice puzzle state methods
      savePracticePuzzleState: () => {
        const state = get();
        if (!state.currentPuzzle || state.currentMode !== "practice") return;
        
        const practiceState = {
          puzzleId: state.currentPuzzle.id,
          userPattern: state.userPattern,
          gameResult: state.gameResult,
          attempts: state.attempts,
          solutionRevealed: state.solutionRevealed,
          revealedTestCases: state.revealedTestCases,
          showDescription: state.showDescription,
          lastPlayedAt: Date.now(),
        };
        
        set(prevState => ({
          practicePuzzleStates: {
            ...prevState.practicePuzzleStates,
            [state.currentPuzzle!.id]: practiceState,
          },
        }));
      },
      
      loadPracticePuzzleState: (puzzleId: string) => {
        const state = get();
        const savedState = state.practicePuzzleStates[puzzleId];
        
        if (savedState) {
          set({
            userPattern: savedState.userPattern,
            gameResult: savedState.gameResult,
            attempts: savedState.attempts,
            solutionRevealed: savedState.solutionRevealed,
            revealedTestCases: savedState.revealedTestCases,
            showDescription: savedState.showDescription,
          });
        }
      },
      
      clearPracticePuzzleState: (puzzleId: string) => {
        const state = get();
        const newStates = { ...state.practicePuzzleStates };
        delete newStates[puzzleId];
        
        set({
          practicePuzzleStates: newStates,
        });
      },
      
      // Anti-cheat methods
      getCurrentDailyPuzzleId: () => {
        return puzzleLoader.getCurrentDailyPuzzleId();
      },
    }),
    {
      name: "regexle-game-store",
      version: 2, // Increment version to handle migration of new practice puzzle states
    }
  )
);

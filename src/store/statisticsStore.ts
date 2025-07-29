import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Puzzle, PuzzleSolveRecord } from "../types/game";
import manifestData from "../data/puzzles/manifest.json";

export interface DifficultyStats {
  totalSolved: number;
  totalAttempts: number;
  averageAttempts: number;
  solvedWithoutSolution: number;
  percentageWithoutSolution: number;
}

export interface StatisticsState {
  solveHistory: PuzzleSolveRecord[];
  solvedPuzzleIds: Set<string>;
  totalPuzzlesSolved: number;
  totalAttempts: number;
  averageAttempts: number;
  currentStreak: number;
  longestStreak: number;
  lastSolveDate: number | null;
}

export interface StatisticsActions {
  recordSolve: (
    puzzleId: string,
    difficulty: Puzzle["difficulty"],
    attempts: number,
    solutionRevealed: boolean,
    mode: "daily" | "random"
  ) => void;
  isPuzzleSolved: (puzzleId: string) => boolean;
  getDifficultyStats: (difficulty?: Puzzle["difficulty"]) => DifficultyStats;
  getStatsForDateRange: (startDate: Date, endDate: Date) => PuzzleSolveRecord[];
  getWeeklyStats: () => {
    thisWeek: PuzzleSolveRecord[];
    lastWeek: PuzzleSolveRecord[];
  };
  calculateStreak: () => number;
  getTopPerformanceDays: () => Array<{
    date: string;
    solveCount: number;
    averageAttempts: number;
  }>;
  getCompletionRateByDifficulty: () => Record<string, number>;
  getTotalPuzzlesByDifficulty: () => Record<string, number>;
  getRecentCompletions: (limit?: number) => PuzzleSolveRecord[];
  resetStatistics: () => void;
}

type StatisticsStore = StatisticsState & StatisticsActions;

const initialState: StatisticsState = {
  solveHistory: [],
  solvedPuzzleIds: new Set(),
  totalPuzzlesSolved: 0,
  totalAttempts: 0,
  averageAttempts: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSolveDate: null,
};

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      recordSolve: (puzzleId, difficulty, attempts, solutionRevealed, mode) => {
        const state = get();
        const isFirstTimeSolving = !state.solvedPuzzleIds.has(puzzleId);

        // Only count statistics for first-time solves, except daily puzzles which always count for streaks
        if (!isFirstTimeSolving && mode !== "daily") {
          return;
        }

        const now = Date.now();
        const newRecord: PuzzleSolveRecord = {
          puzzleId,
          difficulty,
          attempts,
          solutionRevealed,
          solvedAt: now,
          mode,
        };

        set((prevState) => {
          const newHistory = [...prevState.solveHistory, newRecord];
          const newSolvedIds = new Set(prevState.solvedPuzzleIds);
          newSolvedIds.add(puzzleId);

          // Only count for total if it's a first-time solve
          const totalSolved = isFirstTimeSolving
            ? prevState.totalPuzzlesSolved + 1
            : prevState.totalPuzzlesSolved;

          const totalAttempts = isFirstTimeSolving
            ? prevState.totalAttempts + attempts
            : prevState.totalAttempts;

          const newStreak = get().calculateStreak();

          return {
            solveHistory: newHistory,
            solvedPuzzleIds: newSolvedIds,
            totalPuzzlesSolved: totalSolved,
            totalAttempts,
            averageAttempts: totalSolved > 0 ? totalAttempts / totalSolved : 0,
            currentStreak: newStreak,
            longestStreak: Math.max(prevState.longestStreak, newStreak),
            lastSolveDate: now,
          };
        });
      },

      isPuzzleSolved: (puzzleId) => {
        return get().solvedPuzzleIds.has(puzzleId);
      },

      getDifficultyStats: (difficulty) => {
        const { solveHistory } = get();
        const relevantSolves = difficulty
          ? solveHistory.filter((solve) => solve.difficulty === difficulty)
          : solveHistory;

        const totalSolved = relevantSolves.length;
        const totalAttempts = relevantSolves.reduce(
          (sum, solve) => sum + solve.attempts,
          0
        );
        const solvedWithoutSolution = relevantSolves.filter(
          (solve) => !solve.solutionRevealed
        ).length;

        return {
          totalSolved,
          totalAttempts,
          averageAttempts: totalSolved > 0 ? totalAttempts / totalSolved : 0,
          solvedWithoutSolution,
          percentageWithoutSolution:
            totalSolved > 0 ? (solvedWithoutSolution / totalSolved) * 100 : 0,
        };
      },

      getStatsForDateRange: (startDate, endDate) => {
        const { solveHistory } = get();
        return solveHistory.filter((solve) => {
          const solveDate = solve.solvedAt;
          return (
            solveDate >= startDate.getTime() && solveDate <= endDate.getTime()
          );
        });
      },

      getWeeklyStats: () => {
        const now = new Date();
        const thisWeekStart = new Date(now);
        thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of this week
        thisWeekStart.setHours(0, 0, 0, 0);

        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(thisWeekStart.getDate() - 7);

        const lastWeekEnd = new Date(thisWeekStart);
        lastWeekEnd.setMilliseconds(-1);

        return {
          thisWeek: get().getStatsForDateRange(thisWeekStart, now),
          lastWeek: get().getStatsForDateRange(lastWeekStart, lastWeekEnd),
        };
      },

      calculateStreak: () => {
        const { solveHistory } = get();
        const dailyPuzzleSolves = solveHistory.filter(
          (solve) => solve.mode === "daily"
        );

        if (dailyPuzzleSolves.length === 0) return 0;

        const sortedSolves = [...dailyPuzzleSolves].sort(
          (a, b) => b.solvedAt - a.solvedAt
        );

        let streak = 0;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const latestSolve = new Date(sortedSolves[0].solvedAt);
        latestSolve.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor(
          (currentDate.getTime() - latestSolve.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (daysDiff > 1) {
          return 0;
        }

        const dailySolves = new Map<string, boolean>();
        sortedSolves.forEach((solve) => {
          const date = new Date(solve.solvedAt);
          date.setHours(0, 0, 0, 0);
          dailySolves.set(date.toISOString().split("T")[0], true);
        });

        const checkDate = new Date(currentDate);
        if (daysDiff === 1) {
          checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
          const dateKey = checkDate.toISOString().split("T")[0];
          if (dailySolves.has(dateKey)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return streak;
      },

      getTopPerformanceDays: () => {
        const { solveHistory } = get();
        const dayStats = new Map<
          string,
          { solveCount: number; totalAttempts: number }
        >();

        solveHistory.forEach((solve) => {
          const date = new Date(solve.solvedAt).toISOString().split("T")[0];
          const existing = dayStats.get(date) || {
            solveCount: 0,
            totalAttempts: 0,
          };
          dayStats.set(date, {
            solveCount: existing.solveCount + 1,
            totalAttempts: existing.totalAttempts + solve.attempts,
          });
        });

        return Array.from(dayStats.entries())
          .map(([date, stats]) => ({
            date,
            solveCount: stats.solveCount,
            averageAttempts: stats.totalAttempts / stats.solveCount,
          }))
          .sort((a, b) => b.solveCount - a.solveCount)
          .slice(0, 10);
      },

      getCompletionRateByDifficulty: () => {
        const state = get();
        const completionRates: Record<string, number> = {};
        const difficulties = ["easy", "medium", "hard", "expert", "nightmare"];

        difficulties.forEach((difficulty) => {
          const totalInDifficulty =
            state.getTotalPuzzlesByDifficulty()[difficulty] || 0;
          const completedInDifficulty = Array.from(
            state.solvedPuzzleIds
          ).filter((id) => id.startsWith(`${difficulty}-`)).length;

          completionRates[difficulty] =
            totalInDifficulty > 0
              ? (completedInDifficulty / totalInDifficulty) * 100
              : 0;
        });

        return completionRates;
      },

      getTotalPuzzlesByDifficulty: () => {
        return manifestData.puzzles.reduce((acc, puzzle) => {
          acc[puzzle.difficulty] = (acc[puzzle.difficulty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getRecentCompletions: (limit = 10) => {
        const { solveHistory } = get();
        console.log(solveHistory);
        return [...solveHistory]
          .sort((a, b) => b.solvedAt - a.solvedAt)
          .slice(0, limit);
      },

      resetStatistics: () => set(initialState),
    }),
    {
      name: "regexle-statistics",
      version: 1,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert solvedPuzzleIds array back to Set
          if (parsed.state && parsed.state.solvedPuzzleIds) {
            parsed.state.solvedPuzzleIds = new Set(
              parsed.state.solvedPuzzleIds
            );
          }
          return parsed;
        },
        setItem: (name, value) => {
          // Convert Set to array for serialization
          const serializable = {
            ...value,
            state: {
              ...value.state,
              solvedPuzzleIds: Array.from(value.state.solvedPuzzleIds || []),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

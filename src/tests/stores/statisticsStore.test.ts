import { describe, it, expect, beforeEach, vi } from "vitest";
import { useStatisticsStore } from "../../store/statisticsStore";
import type { PuzzleSolveRecord } from "../../types/game";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock the manifest data
vi.mock("../../data/puzzles/manifest.json", () => ({
  default: {
    easy: ["puzzle1", "puzzle2"],
    medium: ["puzzle3", "puzzle4"],
    hard: ["puzzle5", "puzzle6"],
    expert: ["puzzle7", "puzzle8"],
    nightmare: ["puzzle9", "puzzle10"],
  },
}));

describe("statisticsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup global localStorage mock
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    // Reset store to initial state
    useStatisticsStore.setState({
      solveHistory: [],
      solvedPuzzleIds: new Set(),
      totalPuzzlesSolved: 0,
      totalAttempts: 0,
      averageAttempts: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSolveDate: null,
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useStatisticsStore.getState();

      expect(state.solveHistory).toEqual([]);
      expect(state.solvedPuzzleIds).toEqual(new Set());
      expect(state.totalPuzzlesSolved).toBe(0);
      expect(state.totalAttempts).toBe(0);
      expect(state.averageAttempts).toBe(0);
      expect(state.currentStreak).toBe(0);
      expect(state.longestStreak).toBe(0);
      expect(state.lastSolveDate).toBe(null);
    });
  });

  describe("recordSolve", () => {
    it("should record first-time puzzle solve", () => {
      const { recordSolve } = useStatisticsStore.getState();

      recordSolve("puzzle1", "easy", 3, false, "practice");

      const state = useStatisticsStore.getState();
      expect(state.solveHistory).toHaveLength(1);
      expect(state.solvedPuzzleIds.has("puzzle1")).toBe(true);
      expect(state.totalPuzzlesSolved).toBe(1);
      expect(state.totalAttempts).toBe(3);
      expect(state.averageAttempts).toBe(3);
      expect(state.lastSolveDate).toBeTypeOf("number");
    });

    it("should not count duplicate practice puzzle solves for statistics", () => {
      const { recordSolve } = useStatisticsStore.getState();

      // First solve
      recordSolve("puzzle1", "easy", 3, false, "practice");
      // Second solve of same puzzle
      recordSolve("puzzle1", "easy", 2, false, "practice");

      const state = useStatisticsStore.getState();
      expect(state.solveHistory).toHaveLength(1); // Only first solve recorded
      expect(state.totalPuzzlesSolved).toBe(1);
      expect(state.totalAttempts).toBe(3); // Only first attempt count
    });

    it("should allow daily puzzle re-solves for streak tracking", () => {
      const { recordSolve } = useStatisticsStore.getState();

      // First solve
      recordSolve("daily-puzzle", "medium", 4, false, "daily");
      // Second solve of same daily puzzle (different day scenario)
      recordSolve("daily-puzzle", "medium", 2, false, "daily");

      const state = useStatisticsStore.getState();
      expect(state.solveHistory).toHaveLength(2);
    });

    it("should calculate average attempts correctly", () => {
      const { recordSolve } = useStatisticsStore.getState();

      recordSolve("puzzle1", "easy", 2, false, "practice");
      recordSolve("puzzle2", "medium", 4, false, "practice");
      recordSolve("puzzle3", "hard", 6, false, "practice");

      const state = useStatisticsStore.getState();
      expect(state.totalPuzzlesSolved).toBe(3);
      expect(state.totalAttempts).toBe(12);
      expect(state.averageAttempts).toBe(4);
    });

    it("should track solution revealed flag", () => {
      const { recordSolve } = useStatisticsStore.getState();

      recordSolve("puzzle1", "easy", 5, true, "practice");

      const state = useStatisticsStore.getState();
      expect(state.solveHistory[0].solutionRevealed).toBe(true);
    });

    it("should update longest streak", () => {
      const { recordSolve } = useStatisticsStore.getState();

      // Mock calculateStreak to return increasing values
      const originalCalculateStreak =
        useStatisticsStore.getState().calculateStreak;
      let streakValue = 0;
      useStatisticsStore.setState({
        calculateStreak: () => ++streakValue,
      });

      recordSolve("puzzle1", "easy", 2, false, "practice");
      expect(useStatisticsStore.getState().longestStreak).toBe(1);

      recordSolve("puzzle2", "medium", 3, false, "practice");
      expect(useStatisticsStore.getState().longestStreak).toBe(2);

      // Restore original function
      useStatisticsStore.setState({ calculateStreak: originalCalculateStreak });
    });
  });

  describe("isPuzzleSolved", () => {
    it("should return false for unsolved puzzle", () => {
      const { isPuzzleSolved } = useStatisticsStore.getState();

      expect(isPuzzleSolved("puzzle1")).toBe(false);
    });

    it("should return true for solved puzzle", () => {
      const { recordSolve, isPuzzleSolved } = useStatisticsStore.getState();

      recordSolve("puzzle1", "easy", 3, false, "practice");

      expect(isPuzzleSolved("puzzle1")).toBe(true);
    });
  });

  describe("getDifficultyStats", () => {
    beforeEach(() => {
      const { recordSolve } = useStatisticsStore.getState();

      // Set up test data
      recordSolve("puzzle1", "easy", 2, false, "practice");
      recordSolve("puzzle2", "easy", 4, true, "practice");
      recordSolve("puzzle3", "medium", 6, false, "practice");
      recordSolve("puzzle4", "hard", 8, false, "practice");
    });

    it("should return stats for specific difficulty", () => {
      const { getDifficultyStats } = useStatisticsStore.getState();

      const easyStats = getDifficultyStats("easy");

      expect(easyStats.totalSolved).toBe(2);
      expect(easyStats.totalAttempts).toBe(6);
      expect(easyStats.averageAttempts).toBe(3);
      expect(easyStats.solvedWithoutSolution).toBe(1);
      expect(easyStats.percentageWithoutSolution).toBe(50);
    });

    it("should return stats for all difficulties when none specified", () => {
      const { getDifficultyStats } = useStatisticsStore.getState();

      const allStats = getDifficultyStats();

      expect(allStats.totalSolved).toBe(4);
      expect(allStats.totalAttempts).toBe(20);
      expect(allStats.averageAttempts).toBe(5);
      expect(allStats.solvedWithoutSolution).toBe(3);
      expect(allStats.percentageWithoutSolution).toBe(75);
    });

    it("should handle empty stats gracefully", () => {
      useStatisticsStore.setState({ solveHistory: [] });
      const { getDifficultyStats } = useStatisticsStore.getState();

      const stats = getDifficultyStats("easy");

      expect(stats.totalSolved).toBe(0);
      expect(stats.totalAttempts).toBe(0);
      expect(stats.averageAttempts).toBe(0);
      expect(stats.solvedWithoutSolution).toBe(0);
      expect(stats.percentageWithoutSolution).toBe(0);
    });
  });

  describe("getStatsForDateRange", () => {
    beforeEach(() => {
      const now = Date.now();
      const hour = 60 * 60 * 1000;

      // Create solve records with different timestamps
      useStatisticsStore.setState({
        solveHistory: [
          {
            puzzleId: "puzzle1",
            difficulty: "easy",
            attempts: 2,
            solutionRevealed: false,
            solvedAt: now - 25 * hour, // 25 hours ago
            mode: "practice",
          },
          {
            puzzleId: "puzzle2",
            difficulty: "medium",
            attempts: 3,
            solutionRevealed: false,
            solvedAt: now - 5 * hour, // 5 hours ago
            mode: "practice",
          },
          {
            puzzleId: "puzzle3",
            difficulty: "hard",
            attempts: 4,
            solutionRevealed: true,
            solvedAt: now - hour, // 1 hour ago
            mode: "daily",
          },
        ] as PuzzleSolveRecord[],
      });
    });

    it("should return solves within date range", () => {
      const { getStatsForDateRange } = useStatisticsStore.getState();
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const stats = getStatsForDateRange(yesterday, now);

      expect(stats).toHaveLength(2); // puzzle2 and puzzle3
      expect(stats.map((s) => s.puzzleId)).toEqual(["puzzle2", "puzzle3"]);
    });

    it("should return empty array for date range with no solves", () => {
      const { getStatsForDateRange } = useStatisticsStore.getState();
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const evenMoreFuture = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const stats = getStatsForDateRange(futureDate, evenMoreFuture);

      expect(stats).toHaveLength(0);
    });
  });

  describe("getRecentCompletions", () => {
    beforeEach(() => {
      const now = Date.now();

      // Create multiple solve records
      useStatisticsStore.setState({
        solveHistory: [
          {
            puzzleId: "puzzle1",
            difficulty: "easy",
            attempts: 1,
            solutionRevealed: false,
            solvedAt: now - 5000,
            mode: "practice",
          },
          {
            puzzleId: "puzzle2",
            difficulty: "medium",
            attempts: 2,
            solutionRevealed: false,
            solvedAt: now - 4000,
            mode: "practice",
          },
          {
            puzzleId: "puzzle3",
            difficulty: "hard",
            attempts: 3,
            solutionRevealed: true,
            solvedAt: now - 3000,
            mode: "daily",
          },
          {
            puzzleId: "puzzle4",
            difficulty: "expert",
            attempts: 4,
            solutionRevealed: false,
            solvedAt: now - 2000,
            mode: "practice",
          },
          {
            puzzleId: "puzzle5",
            difficulty: "nightmare",
            attempts: 5,
            solutionRevealed: false,
            solvedAt: now - 1000,
            mode: "practice",
          },
        ] as PuzzleSolveRecord[],
      });
    });

    it("should return recent completions with default limit", () => {
      const { getRecentCompletions } = useStatisticsStore.getState();

      const recent = getRecentCompletions();

      expect(recent).toHaveLength(5); // Default should return all if less than limit
      expect(recent[0].puzzleId).toBe("puzzle5"); // Most recent first
      expect(recent[4].puzzleId).toBe("puzzle1"); // Oldest last
    });

    it("should respect custom limit", () => {
      const { getRecentCompletions } = useStatisticsStore.getState();

      const recent = getRecentCompletions(3);

      expect(recent).toHaveLength(3);
      expect(recent.map((r) => r.puzzleId)).toEqual([
        "puzzle5",
        "puzzle4",
        "puzzle3",
      ]);
    });

    it("should handle empty history", () => {
      useStatisticsStore.setState({ solveHistory: [] });
      const { getRecentCompletions } = useStatisticsStore.getState();

      const recent = getRecentCompletions();

      expect(recent).toHaveLength(0);
    });
  });

  describe("resetStatistics", () => {
    it("should reset all statistics to initial state", () => {
      // Set up some state
      const { recordSolve, resetStatistics } = useStatisticsStore.getState();
      recordSolve("puzzle1", "easy", 3, false, "practice");
      recordSolve("puzzle2", "medium", 5, true, "practice");

      // Verify state has data
      expect(useStatisticsStore.getState().totalPuzzlesSolved).toBe(2);
      expect(useStatisticsStore.getState().solveHistory).toHaveLength(2);

      // Reset
      resetStatistics();

      // Verify reset
      const state = useStatisticsStore.getState();
      expect(state.solveHistory).toEqual([]);
      expect(state.solvedPuzzleIds).toEqual(new Set());
      expect(state.totalPuzzlesSolved).toBe(0);
      expect(state.totalAttempts).toBe(0);
      expect(state.averageAttempts).toBe(0);
      expect(state.currentStreak).toBe(0);
      expect(state.longestStreak).toBe(0);
      expect(state.lastSolveDate).toBe(null);
    });
  });
});

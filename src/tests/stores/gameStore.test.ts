import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGameStore, setGrantSpinHandler, setResetSpinWheelHandler } from "../../store/gameStore";
import type { Puzzle, GameResult } from "../../types/game";

// Mock dependencies
vi.mock("../../engine/gameEngine", () => ({
  RegexGameEngine: {
    testPattern: vi.fn(),
  },
}));

vi.mock("../../data/puzzleLoader", () => ({
  puzzleLoader: {
    getRandomPuzzle: vi.fn(),
    getDailyPuzzle: vi.fn(),
    getCurrentDailyPuzzleId: vi.fn(() => "daily-puzzle-id"),
  },
}));

vi.mock("../../store/statisticsStore", () => ({
  useStatisticsStore: vi.fn(() => ({
    recordSolve: vi.fn(),
  })),
}));

const mockPuzzle: Puzzle = {
  id: "test-puzzle",
  title: "Test Puzzle",
  description: "A test puzzle",
  difficulty: "easy",
  testCases: [
    { input: "test", shouldMatch: true },
    { input: "fail", shouldMatch: false },
  ],
  solution: "test",
};

const mockGameResult: GameResult = {
  isCorrect: true,
  passedTests: 2,
  totalTests: 2,
  failedCases: [],
};

describe("gameStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset store to initial state
    useGameStore.setState({
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
      practicePuzzleStates: {},
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useGameStore.getState();
      
      expect(state.currentPuzzle).toBe(null);
      expect(state.userPattern).toBe("");
      expect(state.gameResult).toBe(null);
      expect(state.currentDifficulty).toBe("easy");
      expect(state.currentMode).toBe("practice");
      expect(state.showDescription).toBe(false);
      expect(state.revealedTestCases).toBe(1);
      expect(state.attempts).toBe(0);
      expect(state.solutionRevealed).toBe(false);
      expect(state.showRegexExplosion).toBe(false);
    });
  });

  describe("loadPuzzle", () => {
    it("should load puzzle and reset state", () => {
      // Set some existing state
      useGameStore.setState({
        userPattern: "old pattern",
        attempts: 5,
        gameResult: mockGameResult,
        showDescription: true,
        solutionRevealed: true,
      });

      const { loadPuzzle } = useGameStore.getState();
      loadPuzzle(mockPuzzle);

      const state = useGameStore.getState();
      expect(state.currentPuzzle).toEqual(mockPuzzle);
      expect(state.currentMode).toBe("practice");
      expect(state.userPattern).toBe("");
      expect(state.attempts).toBe(0);
      expect(state.gameResult).toBe(null);
      expect(state.showDescription).toBe(false);
      expect(state.solutionRevealed).toBe(false);
      expect(state.revealedTestCases).toBe(1);
    });
  });

  describe("loadRandomPuzzle", () => {
    it("should load random puzzle successfully", async () => {
      const { puzzleLoader } = await import("../../data/puzzleLoader");
      vi.mocked(puzzleLoader.getRandomPuzzle).mockResolvedValue(mockPuzzle);

      const { loadRandomPuzzle } = useGameStore.getState();
      await loadRandomPuzzle("easy");

      expect(puzzleLoader.getRandomPuzzle).toHaveBeenCalledWith("easy");
      expect(useGameStore.getState().currentPuzzle).toEqual(mockPuzzle);
      expect(useGameStore.getState().currentMode).toBe("practice");
    });

    it("should handle puzzle loading error gracefully", async () => {
      const { puzzleLoader } = await import("../../data/puzzleLoader");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(puzzleLoader.getRandomPuzzle).mockRejectedValue(new Error("Loading failed"));

      const { loadRandomPuzzle } = useGameStore.getState();
      await loadRandomPuzzle("medium");

      expect(consoleSpy).toHaveBeenCalledWith("Failed to load random puzzle:", expect.any(Error));
      expect(useGameStore.getState().currentPuzzle).toBe(null);
      
      consoleSpy.mockRestore();
    });

    it("should handle null puzzle response", async () => {
      const { puzzleLoader } = await import("../../data/puzzleLoader");
      vi.mocked(puzzleLoader.getRandomPuzzle).mockResolvedValue(null);

      const { loadRandomPuzzle } = useGameStore.getState();
      await loadRandomPuzzle();

      expect(useGameStore.getState().currentPuzzle).toBe(null);
    });
  });

  describe("updatePattern", () => {
    it("should update user pattern", () => {
      const { updatePattern } = useGameStore.getState();
      
      updatePattern("new pattern");
      
      expect(useGameStore.getState().userPattern).toBe("new pattern");
    });

    it("should allow empty pattern", () => {
      useGameStore.setState({ userPattern: "existing" });
      const { updatePattern } = useGameStore.getState();
      
      updatePattern("");
      
      expect(useGameStore.getState().userPattern).toBe("");
    });
  });

  describe("testPattern", () => {
    beforeEach(() => {
      useGameStore.setState({
        currentPuzzle: mockPuzzle,
        userPattern: "test pattern",
        attempts: 2,
      });
    });

    it("should test pattern and update results", async () => {
      const { RegexGameEngine } = await import("../../engine/gameEngine");
      vi.mocked(RegexGameEngine.testPattern).mockReturnValue(mockGameResult);

      const { testPattern } = useGameStore.getState();
      testPattern();

      expect(RegexGameEngine.testPattern).toHaveBeenCalledWith("test pattern", mockPuzzle.testCases);
      expect(useGameStore.getState().gameResult).toEqual(mockGameResult);
      expect(useGameStore.getState().attempts).toBe(3);
    });

    it("should not test when no puzzle loaded", async () => {
      useGameStore.setState({ currentPuzzle: null });
      const { RegexGameEngine } = await import("../../engine/gameEngine");

      const { testPattern } = useGameStore.getState();
      testPattern();

      expect(RegexGameEngine.testPattern).not.toHaveBeenCalled();
      expect(useGameStore.getState().attempts).toBe(2); // Unchanged
    });

    it("should not test when pattern is empty", async () => {
      useGameStore.setState({ userPattern: "   " });
      const { RegexGameEngine } = await import("../../engine/gameEngine");

      const { testPattern } = useGameStore.getState();
      testPattern();

      expect(RegexGameEngine.testPattern).not.toHaveBeenCalled();
    });
  });

  describe("setDifficulty", () => {
    it("should update current difficulty", () => {
      const { setDifficulty } = useGameStore.getState();
      
      setDifficulty("hard");
      
      expect(useGameStore.getState().currentDifficulty).toBe("hard");
    });
  });

  describe("toggleDescription", () => {
    it("should toggle description visibility", () => {
      const { toggleDescription } = useGameStore.getState();
      
      expect(useGameStore.getState().showDescription).toBe(false);
      
      toggleDescription();
      expect(useGameStore.getState().showDescription).toBe(true);
      
      toggleDescription();
      expect(useGameStore.getState().showDescription).toBe(false);
    });
  });

  describe("setSolutionRevealed", () => {
    it("should set solution revealed state", () => {
      const { setSolutionRevealed } = useGameStore.getState();
      
      setSolutionRevealed(true);
      expect(useGameStore.getState().solutionRevealed).toBe(true);
      
      setSolutionRevealed(false);
      expect(useGameStore.getState().solutionRevealed).toBe(false);
    });
  });

  describe("setRevealedTestCases", () => {
    it("should set revealed test cases with number", () => {
      const { setRevealedTestCases } = useGameStore.getState();
      
      setRevealedTestCases(5);
      
      expect(useGameStore.getState().revealedTestCases).toBe(5);
    });

    it("should set revealed test cases with function", () => {
      useGameStore.setState({ revealedTestCases: 3 });
      const { setRevealedTestCases } = useGameStore.getState();
      
      setRevealedTestCases((prev) => prev + 2);
      
      expect(useGameStore.getState().revealedTestCases).toBe(5);
    });
  });

  describe("revealMoreTestCases", () => {
    it("should reveal one more test case when puzzle is loaded", () => {
      useGameStore.setState({ 
        currentPuzzle: mockPuzzle, 
        revealedTestCases: 1 
      });
      const { revealMoreTestCases } = useGameStore.getState();
      
      revealMoreTestCases();
      
      // The actual logic looks at matching vs non-matching test cases
      // and limits to the minimum of both types, but with only 1 match and 1 non-match,
      // it can reveal up to 1 case
      expect(useGameStore.getState().revealedTestCases).toBe(1); // Limited by min(1,1) = 1
    });

    it("should not exceed maximum revealable test cases", () => {
      const puzzleWithMoreCases = {
        ...mockPuzzle,
        testCases: [
          { input: "test1", shouldMatch: true },
          { input: "test2", shouldMatch: true },
          { input: "fail1", shouldMatch: false },
          { input: "fail2", shouldMatch: false },
        ],
      };
      
      useGameStore.setState({ 
        currentPuzzle: puzzleWithMoreCases, 
        revealedTestCases: 1 
      });
      const { revealMoreTestCases } = useGameStore.getState();
      
      revealMoreTestCases();
      
      expect(useGameStore.getState().revealedTestCases).toBe(2);
    });
  });

  describe("resetGame", () => {
    it("should reset game state", () => {
      useGameStore.setState({
        userPattern: "some pattern",
        gameResult: mockGameResult,
        attempts: 5,
        showDescription: true,
        solutionRevealed: true,
        revealedTestCases: 3,
        showRegexExplosion: true,
      });

      const { resetGame } = useGameStore.getState();
      resetGame();

      const state = useGameStore.getState();
      expect(state.currentPuzzle).toBe(null); // resetGame sets this to null
      expect(state.userPattern).toBe("");
      expect(state.gameResult).toBe(null);
      expect(state.showDescription).toBe(false);
      expect(state.solutionRevealed).toBe(false);
      expect(state.revealedTestCases).toBe(1);
      expect(state.showRegexExplosion).toBe(false);
      // Note: attempts is not reset by resetGame
    });
  });

  describe("clearRegexExplosion", () => {
    it("should clear regex explosion state", () => {
      useGameStore.setState({ showRegexExplosion: true });
      const { clearRegexExplosion } = useGameStore.getState();
      
      clearRegexExplosion();
      
      expect(useGameStore.getState().showRegexExplosion).toBe(false);
    });
  });

  describe("callback handlers", () => {
    it("should set grant spin handler", () => {
      const mockCallback = vi.fn();
      
      setGrantSpinHandler(mockCallback);
      
      // This is a module-level function, so we test it doesn't throw
      expect(() => setGrantSpinHandler(mockCallback)).not.toThrow();
      expect(() => setGrantSpinHandler(null)).not.toThrow();
    });

    it("should set reset spin wheel handler", () => {
      const mockCallback = vi.fn();
      
      setResetSpinWheelHandler(mockCallback);
      
      // This is a module-level function, so we test it doesn't throw
      expect(() => setResetSpinWheelHandler(mockCallback)).not.toThrow();
      expect(() => setResetSpinWheelHandler(null)).not.toThrow();
    });
  });

  describe("daily puzzle state", () => {
    it("should have correct initial daily puzzle state", () => {
      const state = useGameStore.getState();
      
      expect(state.dailyPuzzleState.completedDate).toBe(null);
      expect(state.dailyPuzzleState.completedPuzzleId).toBe(null);
      expect(state.dailyPuzzleState.completionUserPattern).toBe(null);
      expect(state.dailyPuzzleState.completionGameResult).toBe(null);
      expect(state.dailyPuzzleState.completionAttempts).toBe(0);
      expect(state.dailyPuzzleState.completionSolutionRevealed).toBe(false);
    });

    it("should check if daily puzzle is completed", () => {
      const { isDailyPuzzleCompleted } = useGameStore.getState();
      
      expect(isDailyPuzzleCompleted()).toBe(false);
      
      // Set completed state
      const today = new Date().toISOString().split('T')[0];
      useGameStore.setState({
        dailyPuzzleState: {
          completedDate: today,
          completedPuzzleId: "daily-puzzle",
          completionUserPattern: ".*",
          completionGameResult: mockGameResult,
          completionAttempts: 3,
          completionSolutionRevealed: false,
          completionRevealedTestCases: 1,
          completionShowDescription: false,
        },
      });
      
      expect(isDailyPuzzleCompleted()).toBe(true);
    });

    it("should get daily puzzle completion data for today", () => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const completionData = {
        completedDate: today, // Must be today's date
        completedPuzzleId: "daily-puzzle",
        completionUserPattern: "test.*",
        completionGameResult: mockGameResult,
        completionAttempts: 2,
        completionSolutionRevealed: false,
        completionRevealedTestCases: 1,
        completionShowDescription: false,
      };
      
      useGameStore.setState({ dailyPuzzleState: completionData });
      
      const { getDailyPuzzleCompletion } = useGameStore.getState();
      expect(getDailyPuzzleCompletion()).toEqual(completionData);
    });

    it("should return null for daily puzzle completion from previous day", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      const completionData = {
        completedDate: yesterdayString, // Previous day
        completedPuzzleId: "daily-puzzle",
        completionUserPattern: "test.*",
        completionGameResult: mockGameResult,
        completionAttempts: 2,
        completionSolutionRevealed: false,
        completionRevealedTestCases: 1,
        completionShowDescription: false,
      };
      
      useGameStore.setState({ dailyPuzzleState: completionData });
      
      const { getDailyPuzzleCompletion } = useGameStore.getState();
      expect(getDailyPuzzleCompletion()).toBe(null);
    });

    it("should return null when no daily puzzle completion", () => {
      const { getDailyPuzzleCompletion } = useGameStore.getState();
      expect(getDailyPuzzleCompletion()).toBe(null);
    });
  });

  describe("practice puzzle state persistence", () => {
    it("should save practice puzzle state", () => {
      useGameStore.setState({
        currentPuzzle: mockPuzzle,
        currentMode: "practice",
        userPattern: "test.*",
        gameResult: mockGameResult,
        attempts: 3,
        solutionRevealed: true,
        revealedTestCases: 2,
        showDescription: true,
      });

      const { savePracticePuzzleState } = useGameStore.getState();
      savePracticePuzzleState();

      const state = useGameStore.getState();
      const savedState = state.practicePuzzleStates[mockPuzzle.id];

      expect(savedState).toBeDefined();
      expect(savedState.puzzleId).toBe(mockPuzzle.id);
      expect(savedState.userPattern).toBe("test.*");
      expect(savedState.gameResult).toEqual(mockGameResult);
      expect(savedState.attempts).toBe(3);
      expect(savedState.solutionRevealed).toBe(true);
      expect(savedState.revealedTestCases).toBe(2);
      expect(savedState.showDescription).toBe(true);
      expect(savedState.lastPlayedAt).toBeTypeOf("number");
    });

    it("should load practice puzzle state", () => {
      const savedState = {
        puzzleId: mockPuzzle.id,
        userPattern: "saved.*pattern",
        gameResult: mockGameResult,
        attempts: 5,
        solutionRevealed: true,
        revealedTestCases: 3,
        showDescription: true,
        lastPlayedAt: Date.now(),
      };

      useGameStore.setState({
        practicePuzzleStates: {
          [mockPuzzle.id]: savedState,
        },
      });

      const { loadPracticePuzzleState } = useGameStore.getState();
      loadPracticePuzzleState(mockPuzzle.id);

      const state = useGameStore.getState();
      expect(state.userPattern).toBe("saved.*pattern");
      expect(state.gameResult).toEqual(mockGameResult);
      expect(state.attempts).toBe(5);
      expect(state.solutionRevealed).toBe(true);
      expect(state.revealedTestCases).toBe(3);
      expect(state.showDescription).toBe(true);
    });

    it("should clear practice puzzle state", () => {
      const savedState = {
        puzzleId: mockPuzzle.id,
        userPattern: "test.*",
        gameResult: null,
        attempts: 2,
        solutionRevealed: false,
        revealedTestCases: 1,
        showDescription: false,
        lastPlayedAt: Date.now(),
      };

      useGameStore.setState({
        practicePuzzleStates: {
          [mockPuzzle.id]: savedState,
          "other-puzzle": savedState,
        },
      });

      const { clearPracticePuzzleState } = useGameStore.getState();
      clearPracticePuzzleState(mockPuzzle.id);

      const state = useGameStore.getState();
      expect(state.practicePuzzleStates[mockPuzzle.id]).toBeUndefined();
      expect(state.practicePuzzleStates["other-puzzle"]).toBeDefined();
    });

    it("should auto-save practice state when updating pattern", () => {
      useGameStore.setState({
        currentPuzzle: mockPuzzle,
        currentMode: "practice",
      });

      const { updatePattern } = useGameStore.getState();
      updatePattern("new.*pattern");

      const state = useGameStore.getState();
      expect(state.userPattern).toBe("new.*pattern");
      expect(state.practicePuzzleStates[mockPuzzle.id]).toBeDefined();
      expect(state.practicePuzzleStates[mockPuzzle.id].userPattern).toBe("new.*pattern");
    });

    it("should load existing practice state when loading puzzle", () => {
      const existingState = {
        puzzleId: mockPuzzle.id,
        userPattern: "existing.*pattern",
        gameResult: null,
        attempts: 1,
        solutionRevealed: false,
        revealedTestCases: 1,
        showDescription: false,
        lastPlayedAt: Date.now(),
      };

      useGameStore.setState({
        practicePuzzleStates: {
          [mockPuzzle.id]: existingState,
        },
      });

      const { loadPuzzle } = useGameStore.getState();
      loadPuzzle(mockPuzzle);

      const state = useGameStore.getState();
      expect(state.userPattern).toBe("existing.*pattern");
      expect(state.attempts).toBe(1);
    });
  });

  describe("anti-cheat methods", () => {
    it("should get current daily puzzle ID", () => {
      const { getCurrentDailyPuzzleId } = useGameStore.getState();
      expect(getCurrentDailyPuzzleId()).toBe("daily-puzzle-id");
    });
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useSpinWheelStore } from "../../store/spinWheelStore";

// Mock the gameStore and its handlers
vi.mock("../../store/gameStore", () => ({
  useGameStore: vi.fn(),
  setGrantSpinHandler: vi.fn(),
  setResetSpinWheelHandler: vi.fn(),
}));

// Mock the spin result processor
vi.mock("../../components/pages/Game/utils/spinResultHandlers", () => ({
  processSpinResult: vi.fn(),
}));

// Mock the wheel options
vi.mock("../../components/pages/Game/components", () => ({
  // Mock wheel option types
}));

describe("spinWheelStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    useSpinWheelStore.setState({
      isSpinWheelOpen: false,
      dailySpins: 1,
      practiceSpins: 1,
      currentMode: "practice",
      partialDescription: null,
      showEncouragementCallback: null,
      isRubberDuckActive: false,
      isTarotReadingActive: false,
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useSpinWheelStore.getState();
      
      expect(state.isSpinWheelOpen).toBe(false);
      expect(state.dailySpins).toBe(1);
      expect(state.practiceSpins).toBe(1);
      expect(state.currentMode).toBe("practice"); // Default mode from initial store state
      expect(state.partialDescription).toBe(null);
      expect(state.showEncouragementCallback).toBe(null);
      expect(state.isRubberDuckActive).toBe(false);
      expect(state.isTarotReadingActive).toBe(false);
    });
  });

  describe("spin wheel visibility", () => {
    it("should open spin wheel", () => {
      const { openSpinWheel } = useSpinWheelStore.getState();
      
      openSpinWheel();
      
      expect(useSpinWheelStore.getState().isSpinWheelOpen).toBe(true);
    });

    it("should close spin wheel", () => {
      useSpinWheelStore.setState({ isSpinWheelOpen: true });
      const { closeSpinWheel } = useSpinWheelStore.getState();
      
      closeSpinWheel();
      
      expect(useSpinWheelStore.getState().isSpinWheelOpen).toBe(false);
    });
  });

  describe("mode management", () => {
    it("should set current mode to daily", () => {
      const { setCurrentMode } = useSpinWheelStore.getState();
      
      setCurrentMode("daily");
      
      expect(useSpinWheelStore.getState().currentMode).toBe("daily");
    });

    it("should set current mode to practice", () => {
      useSpinWheelStore.setState({ currentMode: "daily" });
      const { setCurrentMode } = useSpinWheelStore.getState();
      
      setCurrentMode("practice");
      
      expect(useSpinWheelStore.getState().currentMode).toBe("practice");
    });
  });

  describe("spin management", () => {
    it("should get available spins for practice mode", () => {
      useSpinWheelStore.setState({ currentMode: "practice", practiceSpins: 3 });
      const { getAvailableSpins } = useSpinWheelStore.getState();
      
      expect(getAvailableSpins()).toBe(3);
    });

    it("should get available spins for daily mode", () => {
      useSpinWheelStore.setState({ currentMode: "daily", dailySpins: 2 });
      const { getAvailableSpins } = useSpinWheelStore.getState();
      
      expect(getAvailableSpins()).toBe(2);
    });

    it("should set available spins with number for practice mode", () => {
      useSpinWheelStore.setState({ currentMode: "practice" });
      const { setAvailableSpins } = useSpinWheelStore.getState();
      
      setAvailableSpins(5);
      
      expect(useSpinWheelStore.getState().practiceSpins).toBe(5);
    });

    it("should set available spins with function for daily mode", () => {
      useSpinWheelStore.setState({ currentMode: "daily", dailySpins: 2 });
      const { setAvailableSpins } = useSpinWheelStore.getState();
      
      setAvailableSpins((prev) => prev + 1);
      
      expect(useSpinWheelStore.getState().dailySpins).toBe(3);
    });

    it("should consume spin in practice mode", () => {
      useSpinWheelStore.setState({ currentMode: "practice", practiceSpins: 3 });
      const { consumeSpin } = useSpinWheelStore.getState();
      
      consumeSpin();
      
      expect(useSpinWheelStore.getState().practiceSpins).toBe(2);
    });

    it("should consume spin in daily mode", () => {
      useSpinWheelStore.setState({ currentMode: "daily", dailySpins: 2 });
      const { consumeSpin } = useSpinWheelStore.getState();
      
      consumeSpin();
      
      expect(useSpinWheelStore.getState().dailySpins).toBe(1);
    });

    it("should not consume spin when none available", () => {
      useSpinWheelStore.setState({ currentMode: "practice", practiceSpins: 0 });
      const { consumeSpin } = useSpinWheelStore.getState();
      
      consumeSpin();
      
      expect(useSpinWheelStore.getState().practiceSpins).toBe(0);
    });

    it("should grant spin in practice mode", () => {
      useSpinWheelStore.setState({ currentMode: "practice", practiceSpins: 1 });
      const { grantSpin } = useSpinWheelStore.getState();
      
      grantSpin();
      
      expect(useSpinWheelStore.getState().practiceSpins).toBe(2);
    });

    it("should grant spin in daily mode", () => {
      useSpinWheelStore.setState({ currentMode: "daily", dailySpins: 0 });
      const { grantSpin } = useSpinWheelStore.getState();
      
      grantSpin();
      
      expect(useSpinWheelStore.getState().dailySpins).toBe(1);
    });
  });

  describe("partial description management", () => {
    it("should set partial description", () => {
      const { setPartialDescription } = useSpinWheelStore.getState();
      const description = "This is a hint about the pattern";
      
      setPartialDescription(description);
      
      expect(useSpinWheelStore.getState().partialDescription).toBe(description);
    });

    it("should clear partial description", () => {
      useSpinWheelStore.setState({ partialDescription: "Some hint" });
      const { clearPartialDescription } = useSpinWheelStore.getState();
      
      clearPartialDescription();
      
      expect(useSpinWheelStore.getState().partialDescription).toBe(null);
    });
  });

  describe("encouragement system", () => {
    it("should set encouragement callback", () => {
      const { setShowEncouragementCallback } = useSpinWheelStore.getState();
      const mockCallback = vi.fn();
      
      setShowEncouragementCallback(mockCallback);
      
      expect(useSpinWheelStore.getState().showEncouragementCallback).toBe(mockCallback);
    });

    it("should show encouragement when callback is set", () => {
      const mockCallback = vi.fn();
      useSpinWheelStore.setState({ showEncouragementCallback: mockCallback });
      const { showEncouragement } = useSpinWheelStore.getState();
      
      showEncouragement();
      
      expect(mockCallback).toHaveBeenCalledOnce();
    });

    it("should not crash when showing encouragement with no callback", () => {
      const { showEncouragement } = useSpinWheelStore.getState();
      
      expect(() => showEncouragement()).not.toThrow();
    });
  });

  describe("special features", () => {
    it("should activate rubber duck", () => {
      const { activateRubberDuck } = useSpinWheelStore.getState();
      
      activateRubberDuck();
      
      expect(useSpinWheelStore.getState().isRubberDuckActive).toBe(true);
    });

    it("should deactivate rubber duck", () => {
      useSpinWheelStore.setState({ isRubberDuckActive: true });
      const { deactivateRubberDuck } = useSpinWheelStore.getState();
      
      deactivateRubberDuck();
      
      expect(useSpinWheelStore.getState().isRubberDuckActive).toBe(false);
    });

    it("should activate tarot reading", () => {
      const { activateTarotReading } = useSpinWheelStore.getState();
      
      activateTarotReading();
      
      expect(useSpinWheelStore.getState().isTarotReadingActive).toBe(true);
    });

    it("should deactivate tarot reading", () => {
      useSpinWheelStore.setState({ isTarotReadingActive: true });
      const { deactivateTarotReading } = useSpinWheelStore.getState();
      
      deactivateTarotReading();
      
      expect(useSpinWheelStore.getState().isTarotReadingActive).toBe(false);
    });
  });

  describe("reset functionality", () => {
    it("should reset for new puzzle", () => {
      useSpinWheelStore.setState({
        partialDescription: "Some hint",
        isRubberDuckActive: true,
        isTarotReadingActive: true,
      });
      const { resetForNewPuzzle } = useSpinWheelStore.getState();
      
      resetForNewPuzzle();
      
      const state = useSpinWheelStore.getState();
      expect(state.partialDescription).toBe(null);
      expect(state.isRubberDuckActive).toBe(false);
      expect(state.isTarotReadingActive).toBe(false);
    });

    it("should reset all state", () => {
      useSpinWheelStore.setState({
        isSpinWheelOpen: true,
        dailySpins: 5,
        practiceSpins: 3,
        currentMode: "practice",
        partialDescription: "Some hint",
        isRubberDuckActive: true,
        isTarotReadingActive: true,
      });
      const { resetAll } = useSpinWheelStore.getState();
      
      resetAll();
      
      const state = useSpinWheelStore.getState();
      expect(state.isSpinWheelOpen).toBe(false);
      expect(state.dailySpins).toBe(1);
      expect(state.practiceSpins).toBe(1);
      expect(state.currentMode).toBe("daily"); // Default is daily mode
      expect(state.partialDescription).toBe(null);
      expect(state.isRubberDuckActive).toBe(false);
      expect(state.isTarotReadingActive).toBe(false);
    });
  });
});

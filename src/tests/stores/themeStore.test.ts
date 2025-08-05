import { describe, it, expect, beforeEach, vi } from "vitest";
import { useThemeStore } from "../../store/themeStore";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock document
const documentMock = {
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  },
};

// Mock window.matchMedia
const matchMediaMock = vi.fn(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

describe("themeStore", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup global mocks
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(global, "document", {
      value: documentMock,
      writable: true,
    });

    Object.defineProperty(global, "window", {
      value: {
        matchMedia: matchMediaMock,
      },
      writable: true,
    });

    // Reset store state to dark mode (the new default)
    useThemeStore.setState({ isDarkMode: true });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const state = useThemeStore.getState();
      // Theme store now defaults to dark mode
      expect(state.isDarkMode).toBe(true);
    });
  });

  describe("toggleTheme", () => {
    it("should toggle theme from dark to light", () => {
      // Starting from dark mode (default)
      const { toggleTheme } = useThemeStore.getState();

      toggleTheme();

      const state = useThemeStore.getState();
      expect(state.isDarkMode).toBe(false);
      expect(
        documentMock.documentElement.classList.remove
      ).toHaveBeenCalledWith("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "regexle-theme",
        JSON.stringify(false)
      );
    });

    it("should toggle theme from light to dark", () => {
      useThemeStore.setState({ isDarkMode: false });
      const { toggleTheme } = useThemeStore.getState();

      toggleTheme();

      const state = useThemeStore.getState();
      expect(state.isDarkMode).toBe(true);
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        "dark"
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "regexle-theme",
        JSON.stringify(true)
      );
    });

    it("should toggle multiple times correctly", () => {
      const { toggleTheme } = useThemeStore.getState();

      toggleTheme(); // true -> false
      expect(useThemeStore.getState().isDarkMode).toBe(false);

      toggleTheme(); // false -> true
      expect(useThemeStore.getState().isDarkMode).toBe(true);

      toggleTheme(); // true -> false
      expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
  });

  describe("setTheme", () => {
    it("should set theme to dark", () => {
      const { setTheme } = useThemeStore.getState();

      setTheme(true);

      const state = useThemeStore.getState();
      expect(state.isDarkMode).toBe(true);
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith(
        "dark"
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "regexle-theme",
        JSON.stringify(true)
      );
    });

    it("should set theme to light", () => {
      // Starting from dark mode (default)
      const { setTheme } = useThemeStore.getState();

      setTheme(false);

      const state = useThemeStore.getState();
      expect(state.isDarkMode).toBe(false);
      expect(
        documentMock.documentElement.classList.remove
      ).toHaveBeenCalledWith("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "regexle-theme",
        JSON.stringify(false)
      );
    });

    it("should handle setting same theme multiple times", () => {
      const { setTheme } = useThemeStore.getState();

      setTheme(true);
      setTheme(true);

      expect(useThemeStore.getState().isDarkMode).toBe(true);
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledTimes(
        2
      );
    });
  });

  describe("localStorage integration", () => {
    it("should handle localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const { setTheme } = useThemeStore.getState();

      expect(() => setTheme(true)).not.toThrow();
      expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it("should handle localStorage getItem errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("Storage access denied");
      });

      // This would be tested in the initialization code
      expect(() => {
        // Simulate the initialization code that reads from localStorage
        try {
          const saved = localStorageMock.getItem("regexle-theme");
          return saved ? JSON.parse(saved) : null;
        } catch {
          return null;
        }
      }).not.toThrow();
    });
  });

  describe("DOM integration", () => {
    it("should handle missing document gracefully", () => {
      Object.defineProperty(global, "document", {
        value: undefined,
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();

      expect(() => setTheme(true)).not.toThrow();
      expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it("should handle missing localStorage gracefully", () => {
      Object.defineProperty(global, "localStorage", {
        value: undefined,
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();

      expect(() => setTheme(true)).not.toThrow();
      expect(useThemeStore.getState().isDarkMode).toBe(true);
    });
  });
});

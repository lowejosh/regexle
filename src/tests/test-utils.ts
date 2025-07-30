import { describe, it, expect, test, vi } from "vitest";

// Export test utilities for consistent testing
export { describe, it, expect, test, vi };

// Test helper functions
export const createMockPuzzle = (overrides = {}) => ({
  id: "test-puzzle",
  title: "Test Puzzle",
  description: "A test puzzle",
  difficulty: "easy" as const,
  testCases: [
    { input: "test", shouldMatch: true },
    { input: "fail", shouldMatch: false },
  ],
  solution: "test",
  ...overrides,
});

export const createMockGameResult = (overrides = {}) => ({
  isCorrect: true,
  passedTests: 2,
  totalTests: 2,
  failedCases: [],
  ...overrides,
});

// Common test patterns
export const TEST_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  URL: /^https?:\/\/.+$/,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
};

// Mock localStorage for browser environment tests
export const createMockLocalStorage = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(key => delete store[key]); },
  };
};

// Mock document for DOM tests
export const createMockDocument = () => ({
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    },
  },
});

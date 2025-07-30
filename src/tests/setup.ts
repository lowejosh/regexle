import { beforeEach, vi } from "vitest";

// Setup global mocks that apply to all tests
beforeEach(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  // Mock console methods to avoid noise in tests
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});

// Global window.matchMedia mock (for module-level imports)
Object.defineProperty(global, "window", {
  value: {
    matchMedia: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    localStorage: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
  },
  writable: true,
});

// Global test environment setup
declare global {
  var IS_TEST_ENVIRONMENT: boolean;
}

(globalThis as typeof globalThis & { IS_TEST_ENVIRONMENT: boolean }).IS_TEST_ENVIRONMENT = true;

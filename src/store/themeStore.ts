import { create } from "zustand";

interface ThemeState {
  isDarkMode: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  // Initial state - default to light mode
  isDarkMode: false,

  // Actions
  toggleTheme: () => {
    const { isDarkMode } = get();
    const newTheme = !isDarkMode;

    // Update state
    set({ isDarkMode: newTheme });

    // Update document class and persist
    updateDocumentTheme(newTheme);
    persistTheme(newTheme);
  },

  setTheme: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    updateDocumentTheme(isDark);
    persistTheme(isDark);
  },
}));

// Helper function to update document theme
function updateDocumentTheme(isDark: boolean) {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

// Helper function to persist theme preference
function persistTheme(isDark: boolean) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("regexle-theme", JSON.stringify(isDark));
  }
}

// Helper function to load persisted theme
function loadPersistedTheme(): boolean | null {
  if (typeof localStorage !== "undefined") {
    try {
      const saved = localStorage.getItem("regexle-theme");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  return null;
}

// Initialize theme on module load
if (typeof window !== "undefined") {
  // Check if there's a saved preference, otherwise check system preference
  const savedTheme = loadPersistedTheme();

  if (savedTheme !== null) {
    useThemeStore.getState().setTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    useThemeStore.getState().setTheme(prefersDark);
  }
}

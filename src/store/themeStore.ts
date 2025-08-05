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
  isDarkMode: true,

  toggleTheme: () => {
    const { isDarkMode } = get();
    const newTheme = !isDarkMode;

    set({ isDarkMode: newTheme });
    updateDocumentTheme(newTheme);
    persistTheme(newTheme);
  },

  setTheme: (isDark: boolean) => {
    set({ isDarkMode: isDark });
    updateDocumentTheme(isDark);
    persistTheme(isDark);
  },
}));

function updateDocumentTheme(isDark: boolean) {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

function persistTheme(isDark: boolean) {
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("regexle-theme", JSON.stringify(isDark));
    } catch (error) {
      // Silently handle localStorage errors (quota exceeded, etc.)
      console.warn("Failed to persist theme to localStorage:", error);
    }
  }
}

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

if (typeof window !== "undefined") {
  const savedTheme = loadPersistedTheme();

  if (savedTheme !== null) {
    useThemeStore.getState().setTheme(savedTheme);
  } else {
    useThemeStore.getState().setTheme(true);
  }
}

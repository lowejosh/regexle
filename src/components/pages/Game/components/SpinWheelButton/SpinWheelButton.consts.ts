export const SPIN_BUTTON_ANIMATIONS = {
  TRANSITION_DURATION: "duration-2000",
  HIGHLIGHT_CLASSES:
    "animate-color-flash-wiggle dark:animate-color-flash-wiggle-dark",
  HOVER_CLASSES: "hover:bg-accent",
  DISABLED_CLASSES: "opacity-50 cursor-not-allowed",
  INDICATOR_PULSE: "animate-pulse",
} as const;

export const SPIN_BUTTON_CONFIG = {
  INDICATOR_COLORS: {
    MULTIPLE_SPINS: "bg-red-500 dark:bg-red-600",
    SINGLE_SPIN_FAILED: "bg-yellow-500 dark:bg-yellow-600",
  },
} as const;

// Animation and styling constants for the SpinWheelButton
export const SPIN_BUTTON_ANIMATIONS = {
  TRANSITION_DURATION: "duration-300",
  HIGHLIGHT_CLASSES:
    "wiggle bg-yellow-50 border-yellow-300 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-600 dark:hover:bg-yellow-900/30",
  HOVER_CLASSES: "hover:bg-accent",
  DISABLED_CLASSES: "opacity-50 cursor-not-allowed",
  INDICATOR_PULSE: "animate-pulse",
} as const;

export const SPIN_BUTTON_CONFIG = {
  EMOJI: "🎲",
  INDICATOR_COLORS: {
    MULTIPLE_SPINS: "bg-red-500 dark:bg-red-600",
    SINGLE_SPIN_FAILED: "bg-yellow-500 dark:bg-yellow-600",
  },
} as const;

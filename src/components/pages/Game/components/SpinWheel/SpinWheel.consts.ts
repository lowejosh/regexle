export type WheelOptionId =
  | "challenge-description"
  | "half-challenge-description"
  | "emotional-support"
  | "free-spin"
  | "rubber-duck"
  | "comic-sans-mode"
  | "viking-mode"
  | "upside-down-mode"
  | "free-test-case"
  | "reveal-all-test-cases"
  | "tarot-reading";

export interface WheelOption {
  id: WheelOptionId;
  label: string;
  color: string;
}

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: "challenge-description",
    label: "Description",
    color: "#FF6B6B",
  },
  {
    id: "half-challenge-description",
    label: "Half Description",
    color: "#4ECDC4",
  },
  {
    id: "emotional-support",
    label: "Emotional Support",
    color: "#45B7D1",
  },
  {
    id: "free-spin",
    label: "Free Spin",
    color: "#FFA07A",
  },
  {
    id: "rubber-duck",
    label: "Rubber Duck",
    color: "#F1C40F",
  },
  {
    id: "comic-sans-mode",
    label: "Comic Sans Mode",
    color: "#E74C3C",
  },
  {
    id: "viking-mode",
    label: "Viking Mode",
    color: "#8E44AD",
  },
  {
    id: "upside-down-mode",
    label: "Upside Down Mode",
    color: "#16A085",
  },
  {
    id: "free-test-case",
    label: "Test Case",
    color: "#27AE60",
  },
  {
    id: "reveal-all-test-cases",
    label: "All Test Cases",
    color: "#E67E22",
  },
  {
    id: "tarot-reading",
    label: "Tarot Reading",
    color: "#9B59B6",
  },
];

export const WHEEL_CONFIG = {
  SEGMENTS: WHEEL_OPTIONS.length,
  SEGMENT_ANGLE: 360 / WHEEL_OPTIONS.length,
  WHEEL_SIZE: 400,
  CENTER_SIZE: 25,
  MIN_SPINS: 3,
  MAX_SPINS: 6,
  SPIN_DURATION: 3000, // 3 seconds
};

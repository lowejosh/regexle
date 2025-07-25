// Define the wheel option IDs as a union type for type safety
export type WheelOptionId =
  | "challenge-description"
  | "half-challenge-description"
  | "emotional-support"
  | "free-spin"
  | "clippy"
  | "rubber-duck"
  | "comic-sans-mode"
  | "viking-mode"
  | "upside-down-mode"
  | "free-test-case"
  | "reveal-all-test-cases";

export interface WheelOption {
  id: WheelOptionId;
  label: string;
  color: string;
}

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: "challenge-description",
    label: "Description",
    color: "#FF6B6B", // Red
  },
  {
    id: "half-challenge-description",
    label: "Half Description",
    color: "#4ECDC4", // Teal
  },
  {
    id: "emotional-support",
    label: "Emotional Support",
    color: "#45B7D1", // Blue
  },
  {
    id: "free-spin",
    label: "Free Spin",
    color: "#FFA07A", // Light Orange
  },
  // TODO: CLIPPY :)
  // {
  //   id: "clippy",
  //   label: "Clippy",
  //   color: "#98D8C8", // Mint Green
  // },
  {
    id: "rubber-duck",
    label: "Rubber Duck",
    color: "#F1C40F", // Yellow
  },
  {
    id: "comic-sans-mode",
    label: "Comic Sans Mode",
    color: "#E74C3C", // Bright Red
  },
  {
    id: "viking-mode",
    label: "Viking Mode",
    color: "#8E44AD", // Dark Purple
  },
  {
    id: "upside-down-mode",
    label: "Upside Down Mode",
    color: "#16A085", // Teal Green
  },
  {
    id: "free-test-case",
    label: "Test Case",
    color: "#27AE60", // Green
  },
  {
    id: "reveal-all-test-cases",
    label: "All Test Cases",
    color: "#E67E22", // Orange
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

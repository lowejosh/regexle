export interface TestCase {
  input: string;
  shouldMatch: boolean;
  description?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  testCases: TestCase[];
  hints?: string[];
  solution?: string; // For development/testing
}

export interface GameResult {
  isCorrect: boolean;
  passedTests: number;
  totalTests: number;
  failedCases: TestCase[];
}

export interface GameState {
  currentPuzzle: Puzzle | null;
  userPattern: string;
  gameResult: GameResult | null;
  completedPuzzles: Set<string>;
  currentDifficulty: Puzzle["difficulty"];
}

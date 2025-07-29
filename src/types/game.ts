export interface TestCase {
  input: string;
  shouldMatch: boolean;
  description?: string;
}

export interface Puzzle {
  id: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard" | "expert" | "nightmare";
  testCases: TestCase[];
  solution?: string;
  solutionSummary?: string;
}

export interface PuzzleManifestEntry {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard" | "expert" | "nightmare";
  category: string;
  tags: string[];
  file: string;
  summary: string;
}

export interface PuzzleCategory {
  id: string;
  name: string;
  description: string;
}

export interface PuzzleManifest {
  puzzles: PuzzleManifestEntry[];
  categories: PuzzleCategory[];
}

export interface GameResult {
  isCorrect: boolean;
  passedTests: number;
  totalTests: number;
  failedCases: TestCase[];
}

export interface PuzzleSolveRecord {
  puzzleId: string;
  difficulty: Puzzle["difficulty"];
  attempts: number;
  solutionRevealed: boolean;
  solvedAt: number; // Unix timestamp for consistency
  mode: "daily" | "random";
}

export interface GameState {
  currentPuzzle: Puzzle | null;
  userPattern: string;
  gameResult: GameResult | null;
  currentDifficulty: Puzzle["difficulty"];
  currentMode: "daily" | "random";
  showDescription: boolean;
  revealedTestCases: number;
  attempts: number;
  solutionRevealed: boolean;
}

export interface DailyPuzzleState {
  completedDate: string | null; // YYYY-MM-DD format
  completedPuzzleId: string | null;
  completionUserPattern: string | null;
  completionGameResult: GameResult | null;
  completionAttempts: number;
  completionSolutionRevealed: boolean;
}

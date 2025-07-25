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
  solutionsSummary?: string;
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

export interface GameState {
  currentPuzzle: Puzzle | null;
  userPattern: string;
  gameResult: GameResult | null;
  completedPuzzles: Set<string>;
  currentDifficulty: Puzzle["difficulty"];
  showDescription: boolean;
  revealedTestCases: number;
  attempts: number;
}

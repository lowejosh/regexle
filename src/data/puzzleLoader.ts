import type {
  Puzzle,
  PuzzleManifest,
  PuzzleManifestEntry,
} from "../types/game";

import manifestData from "./puzzles/manifest.json";

const puzzleModules = import.meta.glob("./puzzles/**/*.json", { eager: false });

const importPuzzleFile = async (
  filePath: string
): Promise<{ default: Puzzle }> => {
  const fullPath = `./puzzles/${filePath}`;
  const importFn = puzzleModules[fullPath];

  if (!importFn) {
    console.error(`No import function found for: ${fullPath}`);
    console.log("Available modules:", Object.keys(puzzleModules));
    throw new Error(`Puzzle file not found: ${filePath}`);
  }

  return importFn() as Promise<{ default: Puzzle }>;
};

class PuzzleLoader {
  private manifest: PuzzleManifest = manifestData as PuzzleManifest;
  private puzzleCache = new Map<string, Puzzle>();

  async loadPuzzle(id: string): Promise<Puzzle | null> {
    if (this.puzzleCache.has(id)) {
      return this.puzzleCache.get(id)!;
    }

    const manifestEntry = this.manifest.puzzles.find((p) => p.id === id);
    if (!manifestEntry) {
      console.error(`Puzzle with id ${id} not found in manifest`);
      return null;
    }

    try {
      const puzzleModule = await importPuzzleFile(manifestEntry.file);
      const puzzle: Puzzle = puzzleModule.default as Puzzle;

      this.puzzleCache.set(id, puzzle);

      return puzzle;
    } catch (error) {
      console.error(`Failed to load puzzle ${id}:`, error);
      return null;
    }
  }

  getPuzzleManifestEntries(): PuzzleManifestEntry[] {
    return this.manifest.puzzles;
  }

  getPuzzlesByDifficulty(
    difficulty: Puzzle["difficulty"]
  ): PuzzleManifestEntry[] {
    return this.manifest.puzzles.filter((p) => p.difficulty === difficulty);
  }

  getPuzzlesByCategory(category: string): PuzzleManifestEntry[] {
    return this.manifest.puzzles.filter((p) => p.category === category);
  }

  async getRandomPuzzle(
    difficulty?: Puzzle["difficulty"]
  ): Promise<Puzzle | null> {
    const puzzles = difficulty
      ? this.getPuzzlesByDifficulty(difficulty)
      : this.manifest.puzzles;

    if (puzzles.length === 0) return null;

    const randomEntry = puzzles[Math.floor(Math.random() * puzzles.length)];
    return this.loadPuzzle(randomEntry.id);
  }

  getCategories() {
    return this.manifest.categories;
  }

  getTotalPuzzleCount(): number {
    return this.manifest.puzzles.length;
  }

  getPuzzleCountByDifficulty(difficulty: Puzzle["difficulty"]): number {
    return this.manifest.puzzles.filter((p) => p.difficulty === difficulty)
      .length;
  }

  private shuffleArray<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex: number;

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      randomIndex = Math.floor(
        seededRandom(seed + currentIndex) * currentIndex
      );
      currentIndex--;

      [shuffled[currentIndex], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[currentIndex],
      ];
    }

    return shuffled;
  }

  getCurrentDailyPuzzleId(date?: Date): string {
    const targetDate = date || new Date();

    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const seed = dateString
      .split("-")
      .reduce((acc, part) => acc + parseInt(part), 0);

    const shuffledPuzzles = this.shuffleArray(this.manifest.puzzles, seed);

    const epochDate = new Date("2025-01-01");

    const localTargetDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );
    const localEpochDate = new Date(
      epochDate.getFullYear(),
      epochDate.getMonth(),
      epochDate.getDate()
    );

    const daysSinceEpoch = Math.floor(
      (localTargetDate.getTime() - localEpochDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const puzzleIndex = daysSinceEpoch % shuffledPuzzles.length;
    const selectedPuzzle = shuffledPuzzles[puzzleIndex];

    return selectedPuzzle.id;
  }

  async getDailyPuzzle(date?: Date): Promise<Puzzle | null> {
    const targetDate = date || new Date();
    const dailyPuzzleId = this.getCurrentDailyPuzzleId(targetDate);
    return this.loadPuzzle(dailyPuzzleId);
  }
}

export const puzzleLoader = new PuzzleLoader();

export const getAllPuzzleEntries = () =>
  puzzleLoader.getPuzzleManifestEntries();
export const getTotalPuzzleCount = () => puzzleLoader.getTotalPuzzleCount();
export const getCategories = () => puzzleLoader.getCategories();
export const getCurrentDailyPuzzleId = () =>
  puzzleLoader.getCurrentDailyPuzzleId();

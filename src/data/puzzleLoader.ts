import type {
  Puzzle,
  PuzzleManifest,
  PuzzleManifestEntry,
} from "../types/game";

// Import the manifest
import manifestData from "./puzzles/manifest.json";

class PuzzleLoader {
  private manifest: PuzzleManifest = manifestData as PuzzleManifest;
  private puzzleCache = new Map<string, Puzzle>();

  async loadPuzzle(id: string): Promise<Puzzle | null> {
    // Check cache first
    if (this.puzzleCache.has(id)) {
      return this.puzzleCache.get(id)!;
    }

    // Find puzzle in manifest
    const manifestEntry = this.manifest.puzzles.find((p) => p.id === id);
    if (!manifestEntry) {
      console.error(`Puzzle with id ${id} not found in manifest`);
      return null;
    }

    try {
      // Dynamic import of the puzzle file
      const puzzleModule = await import(`./puzzles/${manifestEntry.file}`);
      const puzzle: Puzzle = puzzleModule.default;

      // Cache the loaded puzzle
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
}

export const puzzleLoader = new PuzzleLoader();

export const getAllPuzzleEntries = () =>
  puzzleLoader.getPuzzleManifestEntries();
export const getTotalPuzzleCount = () => puzzleLoader.getTotalPuzzleCount();
export const getCategories = () => puzzleLoader.getCategories();

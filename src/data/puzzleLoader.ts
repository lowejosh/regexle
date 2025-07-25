import type {
  Puzzle,
  PuzzleManifest,
  PuzzleManifestEntry,
} from "../types/game";

// Import the manifest
import manifestData from "./puzzles/manifest.json";

// Dynamic puzzle imports - needed for Vite
const puzzleImports: Record<string, () => Promise<{ default: unknown }>> = {
  // Easy puzzles
  "easy/digital-correspondence.json": () =>
    import("./puzzles/easy/digital-correspondence.json"),
  "easy/voice-connection-format.json": () =>
    import("./puzzles/easy/voice-connection-format.json"),
  "easy/dotted-decimal-dance.json": () =>
    import("./puzzles/easy/dotted-decimal-dance.json"),
  "easy/binary-truth-seekers.json": () =>
    import("./puzzles/easy/binary-truth-seekers.json"),

  // Medium puzzles
  "medium/markup-containers.json": () =>
    import("./puzzles/medium/markup-containers.json"),
  "medium/slashed-path-wanderer.json": () =>
    import("./puzzles/medium/slashed-path-wanderer.json"),
  "medium/temporal-sequence-cipher.json": () =>
    import("./puzzles/medium/temporal-sequence-cipher.json"),
  "medium/underscored-identity-crisis.json": () =>
    import("./puzzles/medium/underscored-identity-crisis.json"),
  "medium/visual-spectrum-codes.json": () =>
    import("./puzzles/medium/visual-spectrum-codes.json"),

  // Hard puzzles
  "hard/access-key-strength.json": () =>
    import("./puzzles/hard/access-key-strength.json"),
  "hard/alphabetic-soup-sorter.json": () =>
    import("./puzzles/hard/alphabetic-soup-sorter.json"),
  "hard/credit-card-whisperer.json": () =>
    import("./puzzles/hard/credit-card-whisperer.json"),
  "hard/network-node-addresses.json": () =>
    import("./puzzles/hard/network-node-addresses.json"),
  "hard/version-number-archaeologist.json": () =>
    import("./puzzles/hard/version-number-archaeologist.json"),

  // Expert puzzles
  "expert/email-header-archaeologist.json": () =>
    import("./puzzles/expert/email-header-archaeologist.json"),
  "expert/mathematical-expression-oracle.json": () =>
    import("./puzzles/expert/mathematical-expression-oracle.json"),
  "expert/nested-parentheses-zen-master.json": () =>
    import("./puzzles/expert/nested-parentheses-zen-master.json"),
  "expert/serialized-text-format.json": () =>
    import("./puzzles/expert/serialized-text-format.json"),

  // Nightmare puzzles
  "nightmare/recursive-nightmare.json": () =>
    import("./puzzles/nightmare/recursive-nightmare.json"),
  "nightmare/whitespace-phantom.json": () =>
    import("./puzzles/nightmare/whitespace-phantom.json"),
};

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
      // Use the puzzle imports mapping
      const puzzleImporter = puzzleImports[manifestEntry.file];
      if (!puzzleImporter) {
        console.error(
          `No importer found for puzzle file: ${manifestEntry.file}`
        );
        return null;
      }

      const puzzleModule = await puzzleImporter();
      const puzzle: Puzzle = puzzleModule.default as Puzzle;

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

  /**
   * Deterministic shuffle using a seed
   */
  private shuffleArray<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex: number;

    // Seeded random number generator (simple linear congruential generator)
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

  /**
   * Get puzzle for a specific day (deterministic)
   */
  async getDailyPuzzle(date?: Date): Promise<Puzzle | null> {
    const targetDate = date || new Date();

    // Create a seed based on the date (YYYY-MM-DD format)
    const dateString = targetDate.toISOString().split("T")[0];
    const seed = dateString
      .split("-")
      .reduce((acc, part) => acc + parseInt(part), 0);

    // Shuffle puzzles deterministically based on the seed
    const shuffledPuzzles = this.shuffleArray(this.manifest.puzzles, seed);

    // Calculate days since epoch to determine which puzzle to show
    const epochDate = new Date("2025-01-01"); // Starting date for the puzzle cycle
    const daysSinceEpoch = Math.floor(
      (targetDate.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Use modulo to cycle through puzzles if we run out
    const puzzleIndex = daysSinceEpoch % shuffledPuzzles.length;
    const selectedPuzzle = shuffledPuzzles[puzzleIndex];

    return this.loadPuzzle(selectedPuzzle.id);
  }
}

export const puzzleLoader = new PuzzleLoader();

export const getAllPuzzleEntries = () =>
  puzzleLoader.getPuzzleManifestEntries();
export const getTotalPuzzleCount = () => puzzleLoader.getTotalPuzzleCount();
export const getCategories = () => puzzleLoader.getCategories();

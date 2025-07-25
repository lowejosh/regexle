import type { Puzzle } from "../types/game";
import { puzzleLoader } from "../data/puzzleLoader";

export type GameMode = "daily" | "random";

export interface PuzzleService {
  loadPuzzle(
    mode: GameMode,
    difficulty?: Puzzle["difficulty"]
  ): Promise<Puzzle | null>;
  getCurrentMode(): GameMode;
  setCurrentMode(mode: GameMode): void;
}

class PuzzleServiceImpl implements PuzzleService {
  private currentMode: GameMode = "daily";

  getCurrentMode(): GameMode {
    return this.currentMode;
  }

  setCurrentMode(mode: GameMode): void {
    this.currentMode = mode;
  }

  async loadPuzzle(
    mode: GameMode,
    difficulty?: Puzzle["difficulty"]
  ): Promise<Puzzle | null> {
    switch (mode) {
      case "daily":
        return puzzleLoader.getDailyPuzzle();
      case "random":
        return puzzleLoader.getRandomPuzzle(difficulty);
      default:
        throw new Error(`Unknown game mode: ${mode}`);
    }
  }
}

export const puzzleService = new PuzzleServiceImpl();

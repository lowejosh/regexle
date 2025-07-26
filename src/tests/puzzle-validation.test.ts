import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import type { Puzzle, PuzzleManifest } from "../types/game";

// Test configuration
const TEST_CASE_LIMITS = {
  MIN_MATCHING: 4,
  MAX_MATCHING: 6,
  MIN_NON_MATCHING: 4,
  MAX_NON_MATCHING: 6,
} as const;

// Helper functions
function loadManifest(): PuzzleManifest {
  const manifestPath = join(__dirname, "../data/puzzles/manifest.json");
  const manifestContent = readFileSync(manifestPath, "utf-8");
  return JSON.parse(manifestContent);
}

function loadPuzzle(filePath: string): Puzzle {
  const puzzlePath = join(__dirname, "../data/puzzles", filePath);
  const puzzleContent = readFileSync(puzzlePath, "utf-8");
  return JSON.parse(puzzleContent);
}

function validateTestCaseCounts(puzzle: Puzzle) {
  const matchingCases = puzzle.testCases.filter((tc) => tc.shouldMatch);
  const nonMatchingCases = puzzle.testCases.filter((tc) => !tc.shouldMatch);

  return {
    matchingCount: matchingCases.length,
    nonMatchingCount: nonMatchingCases.length,
    isMatchingCountValid:
      matchingCases.length >= TEST_CASE_LIMITS.MIN_MATCHING &&
      matchingCases.length <= TEST_CASE_LIMITS.MAX_MATCHING,
    isNonMatchingCountValid:
      nonMatchingCases.length >= TEST_CASE_LIMITS.MIN_NON_MATCHING &&
      nonMatchingCases.length <= TEST_CASE_LIMITS.MAX_NON_MATCHING,
  };
}

function validateSolution(puzzle: Puzzle) {
  if (!puzzle.solution) {
    throw new Error("Puzzle solution is required for validation");
  }

  let regex: RegExp;

  try {
    regex = new RegExp(puzzle.solution);
  } catch (error) {
    throw new Error(
      `Invalid regex pattern: ${puzzle.solution}. Error: ${error}`
    );
  }

  const results = puzzle.testCases.map((testCase) => {
    const actualMatch = regex.test(testCase.input);
    const isCorrect = actualMatch === testCase.shouldMatch;

    return {
      input: testCase.input,
      expectedMatch: testCase.shouldMatch,
      actualMatch,
      isCorrect,
    };
  });

  const failures = results.filter((result) => !result.isCorrect);

  return {
    totalTests: results.length,
    passedTests: results.length - failures.length,
    failures,
    isValid: failures.length === 0,
  };
}

// Main test suite
describe("Puzzle Validation", () => {
  const manifest = loadManifest();

  describe("Manifest Structure", () => {
    it("should load manifest successfully", () => {
      expect(manifest).toBeDefined();
      expect(manifest.puzzles).toBeInstanceOf(Array);
      expect(manifest.puzzles.length).toBeGreaterThan(0);
    });

    it("should have unique puzzle IDs", () => {
      const ids = manifest.puzzles.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Individual Puzzle Validation", () => {
    manifest.puzzles.forEach((manifestEntry) => {
      describe(`Puzzle: ${manifestEntry.id} - ${manifestEntry.title}`, () => {
        let puzzle: Puzzle;

        it("should load puzzle file successfully", () => {
          expect(() => {
            puzzle = loadPuzzle(manifestEntry.file);
          }).not.toThrow();

          expect(puzzle).toBeDefined();
          expect(puzzle.id).toBe(manifestEntry.id);
          expect(puzzle.testCases).toBeInstanceOf(Array);
        });

        it("should have correct test case counts", () => {
          if (!puzzle) puzzle = loadPuzzle(manifestEntry.file);

          const validation = validateTestCaseCounts(puzzle);

          expect(validation.isMatchingCountValid).toBe(true);
          expect(validation.isNonMatchingCountValid).toBe(true);

          // Detailed error messages for debugging
          if (!validation.isMatchingCountValid) {
            console.error(
              `${puzzle.id}: Expected ${TEST_CASE_LIMITS.MIN_MATCHING}-${TEST_CASE_LIMITS.MAX_MATCHING} matching cases, got ${validation.matchingCount}`
            );
          }
          if (!validation.isNonMatchingCountValid) {
            console.error(
              `${puzzle.id}: Expected ${TEST_CASE_LIMITS.MIN_NON_MATCHING}-${TEST_CASE_LIMITS.MAX_NON_MATCHING} non-matching cases, got ${validation.nonMatchingCount}`
            );
          }
        });

        it("should have a valid regex solution", () => {
          if (!puzzle) puzzle = loadPuzzle(manifestEntry.file);

          expect(puzzle.solution).toBeDefined();
          expect(puzzle.solution).not.toBe("");
          expect(() => new RegExp(puzzle.solution!)).not.toThrow();
        });

        it("should have solution that passes all test cases", () => {
          if (!puzzle) puzzle = loadPuzzle(manifestEntry.file);

          const validation = validateSolution(puzzle);

          expect(validation.isValid).toBe(true);

          // Detailed failure reporting
          if (!validation.isValid) {
            console.error(`\n${puzzle.id} Solution Failures:`);
            console.error(`Pattern: ${puzzle.solution}`);
            validation.failures.forEach((failure) => {
              console.error(`  Input: "${failure.input}"`);
              console.error(
                `  Expected: ${failure.expectedMatch ? "MATCH" : "NO MATCH"}`
              );
              console.error(
                `  Actual: ${failure.actualMatch ? "MATCH" : "NO MATCH"}`
              );
            });
          }

          expect(validation.failures).toHaveLength(0);
        });

        it("should have balanced test cases (even total count)", () => {
          if (!puzzle) puzzle = loadPuzzle(manifestEntry.file);

          const totalTestCases = puzzle.testCases.length;
          expect(totalTestCases % 2).toBe(0);
        });
      });
    });
  });

  describe("Cross-Puzzle Statistics", () => {
    it("should provide test suite summary", () => {
      const stats = manifest.puzzles.map((entry) => {
        const puzzle = loadPuzzle(entry.file);
        const validation = validateTestCaseCounts(puzzle);

        return {
          id: entry.id,
          difficulty: entry.difficulty,
          totalTests: puzzle.testCases.length,
          matchingTests: validation.matchingCount,
          nonMatchingTests: validation.nonMatchingCount,
        };
      });

      // Log summary for visibility
      console.log("\n=== Puzzle Test Suite Summary ===");
      stats.forEach((stat) => {
        console.log(
          `${stat.id} (${stat.difficulty}): ${stat.matchingTests}/${stat.nonMatchingTests} (match/no-match)`
        );
      });

      const totalPuzzles = stats.length;
      const totalTests = stats.reduce((sum, stat) => sum + stat.totalTests, 0);

      console.log(`\nTotal: ${totalPuzzles} puzzles, ${totalTests} test cases`);

      expect(totalPuzzles).toBeGreaterThan(0);
      expect(totalTests).toBeGreaterThan(0);
    });
  });
});

import type { TestCase, GameResult } from "../types/game";

export class RegexGameEngine {
  /**
   * Tests a regex pattern against all test cases
   */
  static testPattern(pattern: string, testCases: TestCase[]): GameResult {
    if (!pattern.trim()) {
      return {
        isCorrect: false,
        passedTests: 0,
        totalTests: testCases.length,
        failedCases: [...testCases],
      };
    }

    let regex: RegExp;

    try {
      regex = new RegExp(pattern);
    } catch {
      return {
        isCorrect: false,
        passedTests: 0,
        totalTests: testCases.length,
        failedCases: [...testCases],
      };
    }

    const failedCases: TestCase[] = [];
    let passedTests = 0;

    for (const testCase of testCases) {
      const matches = regex.test(testCase.input);
      const expectedToMatch = testCase.shouldMatch;

      if (matches === expectedToMatch) {
        passedTests++;
      } else {
        failedCases.push(testCase);
      }
    }

    return {
      isCorrect: failedCases.length === 0,
      passedTests,
      totalTests: testCases.length,
      failedCases,
    };
  }

  /**
   * Validates if a regex pattern is syntactically correct
   */
  static isValidRegex(pattern: string): boolean {
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }
}

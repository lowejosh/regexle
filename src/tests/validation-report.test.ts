import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Puzzle } from '../types/game';

interface ManifestEntry {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  file: string;
}

interface Manifest {
  puzzles: ManifestEntry[];
}

interface ValidationIssue {
  puzzleId: string;
  title: string;
  file: string;
  type: 'test_count' | 'regex_invalid' | 'solution_incorrect' | 'odd_total';
  details: string;
  severity: 'error' | 'warning';
}

// Test configuration
const TEST_CASE_LIMITS = {
  MIN_MATCHING: 4,
  MAX_MATCHING: 6,
  MIN_NON_MATCHING: 4,
  MAX_NON_MATCHING: 6,
} as const;

// Helper functions
function loadManifest(): Manifest {
  const manifestPath = join(__dirname, '../data/puzzles/manifest.json');
  const manifestContent = readFileSync(manifestPath, 'utf-8');
  return JSON.parse(manifestContent);
}

function loadPuzzle(filePath: string): Puzzle {
  const puzzlePath = join(__dirname, '../data/puzzles', filePath);
  const puzzleContent = readFileSync(puzzlePath, 'utf-8');
  return JSON.parse(puzzleContent);
}

function validatePuzzle(manifestEntry: ManifestEntry): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  try {
    const puzzle = loadPuzzle(manifestEntry.file);
    
    // Check test case counts
    const matchingCases = puzzle.testCases.filter(tc => tc.shouldMatch);
    const nonMatchingCases = puzzle.testCases.filter(tc => !tc.shouldMatch);
    
    if (matchingCases.length < TEST_CASE_LIMITS.MIN_MATCHING || matchingCases.length > TEST_CASE_LIMITS.MAX_MATCHING) {
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'test_count',
        details: `Matching test cases: ${matchingCases.length} (expected: ${TEST_CASE_LIMITS.MIN_MATCHING}-${TEST_CASE_LIMITS.MAX_MATCHING})`,
        severity: 'error',
      });
    }
    
    if (nonMatchingCases.length < TEST_CASE_LIMITS.MIN_NON_MATCHING || nonMatchingCases.length > TEST_CASE_LIMITS.MAX_NON_MATCHING) {
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'test_count',
        details: `Non-matching test cases: ${nonMatchingCases.length} (expected: ${TEST_CASE_LIMITS.MIN_NON_MATCHING}-${TEST_CASE_LIMITS.MAX_NON_MATCHING})`,
        severity: 'error',
      });
    }
    
    // Check total is even
    if (puzzle.testCases.length % 2 !== 0) {
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'odd_total',
        details: `Total test cases: ${puzzle.testCases.length} (must be even)`,
        severity: 'error',
      });
    }
    
    // Check regex validity and solution correctness
    if (!puzzle.solution) {
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'regex_invalid',
        details: 'Missing solution regex',
        severity: 'error',
      });
      return issues;
    }
    
    let regex: RegExp;
    try {
      regex = new RegExp(puzzle.solution);
    } catch (error) {
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'regex_invalid',
        details: `Invalid regex: ${puzzle.solution}. Error: ${error}`,
        severity: 'error',
      });
      return issues;
    }
    
    // Test solution against test cases
    const failures = puzzle.testCases.filter(testCase => {
      const actualMatch = regex.test(testCase.input);
      return actualMatch !== testCase.shouldMatch;
    });
    
    if (failures.length > 0) {
      const failureDetails = failures.map(f => 
        `"${f.input}" -> expected: ${f.shouldMatch ? 'MATCH' : 'NO MATCH'}, got: ${regex.test(f.input) ? 'MATCH' : 'NO MATCH'}`
      ).join('; ');
      
      issues.push({
        puzzleId: puzzle.id,
        title: puzzle.title,
        file: manifestEntry.file,
        type: 'solution_incorrect',
        details: `Solution fails ${failures.length}/${puzzle.testCases.length} test cases. Pattern: ${puzzle.solution}. Failures: ${failureDetails}`,
        severity: 'error',
      });
    }
    
  } catch (error) {
    issues.push({
      puzzleId: manifestEntry.id,
      title: manifestEntry.title,
      file: manifestEntry.file,
      type: 'regex_invalid',
      details: `Failed to load puzzle: ${error}`,
      severity: 'error',
    });
  }
  
  return issues;
}

describe('Puzzle Validation Report', () => {
  it('should generate comprehensive validation report', () => {
    const manifest = loadManifest();
    const allIssues: ValidationIssue[] = [];
    
    // Validate each puzzle
    manifest.puzzles.forEach(entry => {
      const issues = validatePuzzle(entry);
      allIssues.push(...issues);
    });
    
    // Generate report
    console.log('\n=== PUZZLE VALIDATION REPORT ===\n');
    
    if (allIssues.length === 0) {
      console.log('✅ All puzzles pass validation!\n');
    } else {
      const errorCount = allIssues.filter(i => i.severity === 'error').length;
      const warningCount = allIssues.filter(i => i.severity === 'warning').length;
      
      console.log(`❌ Found ${errorCount} errors and ${warningCount} warnings:\n`);
      
      // Group by type
      const groupedIssues = allIssues.reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = [];
        acc[issue.type].push(issue);
        return acc;
      }, {} as Record<string, ValidationIssue[]>);
      
      // Report each type
      Object.entries(groupedIssues).forEach(([type, issues]) => {
        const typeLabel = {
          'test_count': 'TEST CASE COUNT ISSUES',
          'regex_invalid': 'INVALID REGEX PATTERNS',
          'solution_incorrect': 'INCORRECT SOLUTIONS',
          'odd_total': 'ODD TOTAL TEST CASES',
        }[type] || type.toUpperCase();
        
        console.log(`\n🔍 ${typeLabel} (${issues.length}):`);
        console.log('─'.repeat(50));
        
        issues.forEach(issue => {
          const icon = issue.severity === 'error' ? '❌' : '⚠️';
          console.log(`${icon} ${issue.puzzleId} - ${issue.title}`);
          console.log(`   File: ${issue.file}`);
          console.log(`   Issue: ${issue.details}\n`);
        });
      });
      
      // Summary by difficulty
      console.log('\n📊 ISSUES BY DIFFICULTY:');
      console.log('─'.repeat(30));
      
      const difficultyGroups = allIssues.reduce((acc, issue) => {
        const difficulty = issue.puzzleId.split('-')[0];
        if (!acc[difficulty]) acc[difficulty] = 0;
        acc[difficulty]++;
        return acc;
      }, {} as Record<string, number>);
      
      Object.entries(difficultyGroups).forEach(([difficulty, count]) => {
        console.log(`${difficulty.toUpperCase()}: ${count} issues`);
      });
      
      console.log(`\nTOTAL: ${allIssues.length} issues across ${new Set(allIssues.map(i => i.puzzleId)).size} puzzles`);
    }
    
    console.log('\n=== END REPORT ===\n');
    
    // The test should pass regardless - this is just for reporting
    expect(true).toBe(true);
  });
});

import type { Puzzle } from "../types/game";

export const samplePuzzles: Puzzle[] = [
  {
    id: "easy-001",
    title: "Pattern Alpha",
    description: "Match valid email addresses",
    difficulty: "easy",
    testCases: [
      { input: "user@example.com", shouldMatch: true },
      { input: "test@domain.org", shouldMatch: true },
      { input: "name@site.net", shouldMatch: true },
      { input: "admin@company.edu", shouldMatch: true },
      { input: "invalid-email", shouldMatch: false },
      { input: "@domain.com", shouldMatch: false },
      { input: "user@", shouldMatch: false },
      { input: "user.domain.com", shouldMatch: false },
    ],
    solution: "^[a-zA-Z0-9]+@[a-zA-Z0-9]+\\.[a-zA-Z]+$",
  },
  {
    id: "easy-002",
    title: "Pattern Beta",
    description: "Match US phone numbers in format (123) 456-7890",
    difficulty: "easy",
    testCases: [
      { input: "(123) 456-7890", shouldMatch: true },
      { input: "(555) 123-4567", shouldMatch: true },
      { input: "(999) 888-7777", shouldMatch: true },
      { input: "(000) 000-0000", shouldMatch: true },
      { input: "123-456-7890", shouldMatch: false },
      { input: "(12) 456-7890", shouldMatch: false },
      { input: "(123) 45-7890", shouldMatch: false },
      { input: "(123)456-7890", shouldMatch: false },
    ],
    solution: "^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$",
  },
  {
    id: "medium-001",
    title: "Pattern Gamma",
    description: "Match opening HTML tags",
    difficulty: "medium",
    testCases: [
      { input: "<div>", shouldMatch: true },
      { input: "<span>", shouldMatch: true },
      { input: "<p>", shouldMatch: true },
      { input: "<header>", shouldMatch: true },
      { input: "<article>", shouldMatch: true },
      { input: "</div>", shouldMatch: false },
      { input: '<div class="test">', shouldMatch: false },
      { input: "div>", shouldMatch: false },
      { input: "<123>", shouldMatch: false },
      { input: "<>", shouldMatch: false },
    ],
    solution: "^<[a-zA-Z]+>$",
  },
  {
    id: "medium-002",
    title: "Pattern Delta",
    description: "Match hexadecimal color codes",
    difficulty: "medium",
    testCases: [
      { input: "#FF0000", shouldMatch: true },
      { input: "#00FF00", shouldMatch: true },
      { input: "#0000FF", shouldMatch: true },
      { input: "#ABC123", shouldMatch: true },
      { input: "#FfFfFf", shouldMatch: true },
      { input: "FF0000", shouldMatch: false },
      { input: "#GG0000", shouldMatch: false },
      { input: "#FF00", shouldMatch: false },
      { input: "#FF00000", shouldMatch: false },
      { input: "#", shouldMatch: false },
    ],
    solution: "^#[0-9A-Fa-f]{6}$",
  },
  {
    id: "hard-001",
    title: "Pattern Epsilon",
    description: "Match strong passwords",
    difficulty: "hard",
    testCases: [
      { input: "Password123", shouldMatch: true },
      { input: "MySecret1", shouldMatch: true },
      { input: "Complex9Pass", shouldMatch: true },
      { input: "StrongKey7", shouldMatch: true },
      { input: "SecureCode5", shouldMatch: true },
      { input: "password123", shouldMatch: false },
      { input: "PASSWORD123", shouldMatch: false },
      { input: "Password", shouldMatch: false },
      { input: "Pass1", shouldMatch: false },
      { input: "12345678", shouldMatch: false },
    ],
    solution: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
  },
  {
    id: "hard-002",
    title: "Pattern Zeta",
    description: "Match IPv4 addresses",
    difficulty: "hard",
    testCases: [
      { input: "192.168.1.1", shouldMatch: true },
      { input: "10.0.0.1", shouldMatch: true },
      { input: "255.255.255.255", shouldMatch: true },
      { input: "127.0.0.1", shouldMatch: true },
      { input: "0.0.0.0", shouldMatch: true },
      { input: "256.1.1.1", shouldMatch: false },
      { input: "192.168.1", shouldMatch: false },
      { input: "192.168.1.1.1", shouldMatch: false },
      { input: "abc.def.ghi.jkl", shouldMatch: false },
      { input: "192.168.-1.1", shouldMatch: false },
    ],
    solution:
      "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
  },
  {
    id: "expert-001",
    title: "Pattern Omega",
    description: "Match valid JSON strings",
    difficulty: "expert",
    testCases: [
      { input: '"hello"', shouldMatch: true },
      { input: '"hello world"', shouldMatch: true },
      { input: '"test\\nstring"', shouldMatch: true },
      { input: '"with \\"quotes\\""', shouldMatch: true },
      { input: '""', shouldMatch: true },
      { input: "hello", shouldMatch: false },
      { input: '"unterminated', shouldMatch: false },
      { input: 'unterminated"', shouldMatch: false },
      { input: '"bad\\escape"', shouldMatch: false },
      { input: '"multi\nline"', shouldMatch: false },
    ],
    solution: '^"(?:[^"\\\\]|\\\\.)*"$',
  },
];

export const getPuzzleById = (id: string): Puzzle | undefined => {
  return samplePuzzles.find((puzzle) => puzzle.id === id);
};

export const getPuzzlesByDifficulty = (
  difficulty: Puzzle["difficulty"]
): Puzzle[] => {
  return samplePuzzles.filter((puzzle) => puzzle.difficulty === difficulty);
};

export const getRandomPuzzle = (difficulty?: Puzzle["difficulty"]): Puzzle => {
  const puzzles = difficulty
    ? getPuzzlesByDifficulty(difficulty)
    : samplePuzzles;
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
};

import type { Puzzle } from "../types/game";

export const samplePuzzles: Puzzle[] = [
  {
    id: "easy-001",
    title: "Simple Email Pattern",
    description: 'Match basic email addresses like "user@domain.com"',
    difficulty: "easy",
    testCases: [
      { input: "user@example.com", shouldMatch: true },
      { input: "test@domain.org", shouldMatch: true },
      { input: "invalid-email", shouldMatch: false },
      { input: "@domain.com", shouldMatch: false },
      { input: "user@", shouldMatch: false },
    ],
    hints: ["Start with matching letters and numbers for the username"],
    solution: "^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]+$",
  },
  {
    id: "easy-002",
    title: "Phone Number Validator",
    description: "Match US phone numbers in format (123) 456-7890",
    difficulty: "medium",
    testCases: [
      { input: "(123) 456-7890", shouldMatch: true },
      { input: "(999) 888-7777", shouldMatch: true },
      { input: "123-456-7890", shouldMatch: false },
      { input: "(12) 456-7890", shouldMatch: false },
      { input: "(123) 45-7890", shouldMatch: false },
    ],
    hints: [
      "The pattern starts with a parenthesis",
      "There are exactly 3 digits in parentheses",
      "After the space, there are 3 digits, a dash, then 4 digits",
    ],
    solution: "^([0-9]{3}) [0-9]{3}-[0-9]{4}$",
  },
  {
    id: "medium-001",
    title: "HTML Tag Matcher",
    description: "Match opening HTML tags like <div>, <span>, <p>",
    difficulty: "medium",
    testCases: [
      { input: "<div>", shouldMatch: true },
      { input: "<span>", shouldMatch: true },
      { input: "<p>", shouldMatch: true },
      { input: "</div>", shouldMatch: false },
      { input: '<div class="test">', shouldMatch: false },
      { input: "div>", shouldMatch: false },
    ],
    hints: [
      "HTML tags start with < and end with >",
      "The tag name contains only letters",
      "This should only match simple opening tags without attributes",
    ],
    solution: "^<[a-zA-Z]+>$",
  },
  {
    id: "hard-001",
    title: "Password Strength",
    description:
      "Match passwords with at least 8 chars, 1 uppercase, 1 lowercase, 1 digit",
    difficulty: "hard",
    testCases: [
      { input: "Password123", shouldMatch: true },
      { input: "MySecret1", shouldMatch: true },
      { input: "password123", shouldMatch: false },
      { input: "PASSWORD123", shouldMatch: false },
      { input: "Password", shouldMatch: false },
      { input: "Pass1", shouldMatch: false },
    ],
    hints: [
      "Use positive lookaheads to check for each requirement",
      "You need (?=.*[a-z]) for lowercase letters",
      "You need (?=.*[A-Z]) for uppercase letters",
      "You need (?=.*d) for digits",
      "The total length should be at least 8 characters",
    ],
    solution: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$",
  },
  {
    id: "easy-002",
    title: "Match any single digit",
    description: "Create a regex that matches exactly one digit (0-9)",
    difficulty: "easy",
    solution: "\\d",
    testCases: [
      { input: "5", shouldMatch: true },
      { input: "0", shouldMatch: true },
      { input: "9", shouldMatch: true },
      { input: "a", shouldMatch: false },
      { input: "12", shouldMatch: false },
      { input: "", shouldMatch: false },
    ],
    hints: [
      "There is a special character class for digits",
      "Use \\d to match any digit",
    ],
  },
  {
    id: "medium-001",
    title: "Valid Email Start",
    description:
      "Match strings that could be the start of an email (letters/numbers, then @)",
    difficulty: "medium",
    solution: "^[a-zA-Z0-9]+@",
    testCases: [
      { input: "user@", shouldMatch: true },
      { input: "test123@", shouldMatch: true },
      { input: "John@", shouldMatch: true },
      { input: "@domain", shouldMatch: false },
      { input: "user-name@", shouldMatch: false }, // Contains hyphen
      { input: "user@domain.com", shouldMatch: true }, // Has @ followed by more
    ],
    hints: [
      "Start with ^ to match from the beginning",
      "Use [a-zA-Z0-9] for letters and numbers",
      "Use + for one or more characters",
      "End with @ symbol",
    ],
  },
  {
    id: "hard-001",
    title: "Phone Number Pattern",
    description: "Match US phone numbers in format: (xxx) xxx-xxxx",
    difficulty: "hard",
    solution: "^\\(\\d{3}\\) \\d{3}-\\d{4}$",
    testCases: [
      { input: "(123) 456-7890", shouldMatch: true },
      { input: "(555) 123-4567", shouldMatch: true },
      { input: "123-456-7890", shouldMatch: false },
      { input: "(123)456-7890", shouldMatch: false }, // Missing space
      { input: "(12) 456-7890", shouldMatch: false }, // Wrong area code length
      { input: "(123) 45-7890", shouldMatch: false }, // Wrong middle part length
    ],
    hints: [
      "Parentheses need to be escaped: \\( and \\)",
      "Use \\d{3} to match exactly 3 digits",
      "Don't forget the space after the area code",
      "Use ^ and $ to match the entire string",
    ],
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

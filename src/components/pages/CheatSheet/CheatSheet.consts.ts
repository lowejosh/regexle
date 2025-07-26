interface CheatSheetSection {
  title: string;
  description: string;
  items: CheatSheetItem[];
}

interface CheatSheetItem {
  pattern: string;
  description: string;
  example?: string;
}

export const CHEAT_SHEET_DATA: CheatSheetSection[] = [
  {
    title: "Basic Patterns",
    description: "Fundamental regex building blocks",
    items: [
      {
        pattern: ".",
        description: "Matches any single character except newline",
        example: 'a.c → "abc", "axc", "a5c"',
      },
      {
        pattern: "\\d",
        description: "Matches any digit (0-9)",
        example: '\\d+ → "123", "7", "999"',
      },
      {
        pattern: "\\w",
        description: "Matches any word character (a-z, A-Z, 0-9, _)",
        example: '\\w+ → "hello", "Test_123"',
      },
      {
        pattern: "\\s",
        description: "Matches any whitespace character",
        example: '\\s+ → " ", "\\t", "\\n"',
      },
      {
        pattern: "\\D",
        description: "Matches any non-digit",
        example: '\\D+ → "abc", "xyz"',
      },
      {
        pattern: "\\W",
        description: "Matches any non-word character",
        example: '\\W+ → "!@#", " "',
      },
      {
        pattern: "\\S",
        description: "Matches any non-whitespace character",
        example: '\\S+ → "hello123", "!@#"',
      },
    ],
  },
  {
    title: "Character Classes",
    description: "Match specific sets of characters",
    items: [
      {
        pattern: "[abc]",
        description: "Matches any character in the set",
        example: '[aeiou] → "a", "e", "i"',
      },
      {
        pattern: "[^abc]",
        description: "Matches any character NOT in the set",
        example: '[^aeiou] → "b", "c", "d"',
      },
      {
        pattern: "[a-z]",
        description: "Matches any lowercase letter",
        example: '[a-z]+ → "hello", "world"',
      },
      {
        pattern: "[A-Z]",
        description: "Matches any uppercase letter",
        example: '[A-Z]+ → "HELLO", "WORLD"',
      },
      {
        pattern: "[0-9]",
        description: "Matches any digit (same as \\d)",
        example: '[0-9]+ → "123", "456"',
      },
      {
        pattern: "[a-zA-Z]",
        description: "Matches any letter",
        example: '[a-zA-Z]+ → "Hello", "World"',
      },
    ],
  },
  {
    title: "Quantifiers",
    description: "Specify how many times to match",
    items: [
      {
        pattern: "*",
        description: "Matches 0 or more times",
        example: 'ab*c → "ac", "abc", "abbc"',
      },
      {
        pattern: "+",
        description: "Matches 1 or more times",
        example: 'ab+c → "abc", "abbc" (not "ac")',
      },
      {
        pattern: "?",
        description: "Matches 0 or 1 time (optional)",
        example: 'ab?c → "ac", "abc"',
      },
      {
        pattern: "{n}",
        description: "Matches exactly n times",
        example: 'a{3} → "aaa"',
      },
      {
        pattern: "{n,}",
        description: "Matches n or more times",
        example: 'a{2,} → "aa", "aaa", "aaaa"',
      },
      {
        pattern: "{n,m}",
        description: "Matches between n and m times",
        example: 'a{2,4} → "aa", "aaa", "aaaa"',
      },
    ],
  },
  {
    title: "Anchors",
    description: "Match positions in the string",
    items: [
      {
        pattern: "^",
        description: "Matches start of string",
        example: '^hello → "hello world" ✓, "say hello" ✗',
      },
      {
        pattern: "$",
        description: "Matches end of string",
        example: 'world$ → "hello world" ✓, "world peace" ✗',
      },
      {
        pattern: "\\b",
        description: "Matches word boundary",
        example: '\\bcat\\b → "the cat" ✓, "concatenate" ✗',
      },
      {
        pattern: "\\B",
        description: "Matches non-word boundary",
        example: '\\Bcat\\B → "concatenate" ✓, "the cat" ✗',
      },
    ],
  },
  {
    title: "Groups & Alternatives",
    description: "Group patterns and create alternatives",
    items: [
      {
        pattern: "(abc)",
        description: "Capturing group",
        example: '(\\d{3})-(\\d{3}) → "123-456" captures "123" and "456"',
      },
      {
        pattern: "(?:abc)",
        description: "Non-capturing group",
        example: '(?:cat|dog)s → "cats", "dogs"',
      },
      {
        pattern: "a|b",
        description: "Matches either a or b",
        example: 'cat|dog → "cat", "dog"',
      },
      {
        pattern: "\\1",
        description: "Backreference to first group",
        example: '(\\w+)\\s+\\1 → "hello hello", "test test"',
      },
    ],
  },
  {
    title: "Lookarounds",
    description: "Advanced pattern matching with conditions",
    items: [
      {
        pattern: "(?=abc)",
        description: "Positive lookahead",
        example: '\\d+(?=px) → "12px" matches "12", "12em" doesn\'t',
      },
      {
        pattern: "(?!abc)",
        description: "Negative lookahead",
        example: '\\d+(?!px) → "12em" matches "12", "12px" doesn\'t',
      },
      {
        pattern: "(?<=abc)",
        description: "Positive lookbehind",
        example: '(?<=\\$)\\d+ → "$50" matches "50", "50$" doesn\'t',
      },
      {
        pattern: "(?<!abc)",
        description: "Negative lookbehind",
        example: '(?<!\\$)\\d+ → "50$" matches "50", "$50" doesn\'t',
      },
    ],
  },
  {
    title: "Special Characters",
    description: "Characters with special meaning",
    items: [
      {
        pattern: "\\",
        description: "Escape character",
        example: '\\. → matches "." literally (not any character)',
      },
      {
        pattern: "\\n",
        description: "Newline character",
        example: 'line1\\nline2 → "line1\\nline2"',
      },
      {
        pattern: "\\t",
        description: "Tab character",
        example: 'col1\\tcol2 → "col1\\tcol2"',
      },
      {
        pattern: "\\r",
        description: "Carriage return",
        example: "\\r\\n → Windows line ending",
      },
    ],
  },
];

export type { CheatSheetSection, CheatSheetItem };

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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

const cheatSheetData: CheatSheetSection[] = [
  {
    title: "Basic Patterns",
    description: "Fundamental regex building blocks",
    items: [
      { pattern: ".", description: "Matches any single character except newline", example: "a.c → abc, axc, a5c" },
      { pattern: "\\d", description: "Matches any digit (0-9)", example: "\\d+ → 123, 7, 999" },
      { pattern: "\\w", description: "Matches any word character (a-z, A-Z, 0-9, _)", example: "\\w+ → hello, Test_123" },
      { pattern: "\\s", description: "Matches any whitespace character", example: "\\s+ → spaces, tabs, newlines" },
      { pattern: "\\D", description: "Matches any non-digit", example: "\\D+ → abc, xyz" },
      { pattern: "\\W", description: "Matches any non-word character", example: "\\W+ → !@#, spaces" },
      { pattern: "\\S", description: "Matches any non-whitespace character", example: "\\S+ → hello123" },
    ],
  },
  {
    title: "Character Classes",
    description: "Match specific sets of characters",
    items: [
      { pattern: "[abc]", description: "Matches any character in the set", example: "[aeiou] → vowels" },
      { pattern: "[^abc]", description: "Matches any character NOT in the set", example: "[^aeiou] → consonants" },
      { pattern: "[a-z]", description: "Matches any lowercase letter", example: "[a-z]+ → hello" },
      { pattern: "[A-Z]", description: "Matches any uppercase letter", example: "[A-Z]+ → HELLO" },
      { pattern: "[0-9]", description: "Matches any digit (same as \\d)", example: "[0-9]+ → 123" },
      { pattern: "[a-zA-Z]", description: "Matches any letter", example: "[a-zA-Z]+ → Hello" },
    ],
  },
  {
    title: "Quantifiers",
    description: "Specify how many times to match",
    items: [
      { pattern: "*", description: "Matches 0 or more times", example: "ab*c → ac, abc, abbc" },
      { pattern: "+", description: "Matches 1 or more times", example: "ab+c → abc, abbc (not ac)" },
      { pattern: "?", description: "Matches 0 or 1 time (optional)", example: "ab?c → ac, abc" },
      { pattern: "{n}", description: "Matches exactly n times", example: "a{3} → aaa" },
      { pattern: "{n,}", description: "Matches n or more times", example: "a{2,} → aa, aaa, aaaa" },
      { pattern: "{n,m}", description: "Matches between n and m times", example: "a{2,4} → aa, aaa, aaaa" },
    ],
  },
  {
    title: "Anchors",
    description: "Match positions in the string",
    items: [
      { pattern: "^", description: "Matches start of string", example: "^hello → hello at beginning" },
      { pattern: "$", description: "Matches end of string", example: "world$ → world at end" },
      { pattern: "\\b", description: "Matches word boundary", example: "\\bcat\\b → cat (whole word)" },
      { pattern: "\\B", description: "Matches non-word boundary", example: "\\Bcat\\B → cat in concatenate" },
    ],
  },
  {
    title: "Groups & Alternatives",
    description: "Group patterns and create alternatives",
    items: [
      { pattern: "(abc)", description: "Capturing group", example: "(\\d{3})-(\\d{3})-(\\d{4}) → phone parts" },
      { pattern: "(?:abc)", description: "Non-capturing group", example: "(?:cat|dog)s → cats or dogs" },
      { pattern: "a|b", description: "Matches either a or b", example: "cat|dog → cat or dog" },
      { pattern: "\\1", description: "Backreference to first group", example: "(\\w+)\\s+\\1 → repeated words" },
    ],
  },
  {
    title: "Lookarounds",
    description: "Advanced pattern matching with conditions",
    items: [
      { pattern: "(?=abc)", description: "Positive lookahead", example: "\\d+(?=px) → numbers before px" },
      { pattern: "(?!abc)", description: "Negative lookahead", example: "\\d+(?!px) → numbers not before px" },
      { pattern: "(?<=abc)", description: "Positive lookbehind", example: "(?<=\\$)\\d+ → numbers after $" },
      { pattern: "(?<!abc)", description: "Negative lookbehind", example: "(?<!\\$)\\d+ → numbers not after $" },
    ],
  },
  {
    title: "Special Characters",
    description: "Characters with special meaning",
    items: [
      { pattern: "\\", description: "Escape character", example: "\\. → literal dot" },
      { pattern: "\\n", description: "Newline character", example: "line1\\nline2" },
      { pattern: "\\t", description: "Tab character", example: "column1\\tcolumn2" },
      { pattern: "\\r", description: "Carriage return", example: "Windows line ending \\r\\n" },
    ],
  },
];

export function CheatSheet() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Regex Cheat Sheet</h1>
        <p className="text-muted-foreground">
          Quick reference for regular expression patterns and syntax
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cheatSheetData.map((section, index) => (
          <Card key={index} className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-sm">
                      {item.pattern}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.example && (
                    <div className="text-xs text-muted-foreground/80 font-mono bg-muted/30 px-2 py-1 rounded">
                      {item.example}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Common Patterns</CardTitle>
          <CardDescription>Frequently used regex patterns for common tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"}
              </Badge>
              <p className="text-sm text-muted-foreground">Email validation</p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^\\+?[1-9]\\d{1,14}$"}
              </Badge>
              <p className="text-sm text-muted-foreground">Phone number (international)</p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^(https?:\\/\\/)([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$"}
              </Badge>
              <p className="text-sm text-muted-foreground">URL validation</p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$"}
              </Badge>
              <p className="text-sm text-muted-foreground">Strong password (8+ chars, upper, lower, number)</p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^\\d{4}-\\d{2}-\\d{2}$"}
              </Badge>
              <p className="text-sm text-muted-foreground">Date (YYYY-MM-DD)</p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="font-mono text-sm">
                {"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"}
              </Badge>
              <p className="text-sm text-muted-foreground">Hex color code</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

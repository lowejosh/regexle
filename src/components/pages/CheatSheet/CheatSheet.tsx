import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CHEAT_SHEET_DATA, COMMON_PATTERNS } from "./CheatSheet.consts";

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
        {CHEAT_SHEET_DATA.map((section, index) => (
          <Card key={index} className="h-full">
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
          <CardDescription>
            Frequently used regex patterns for common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {COMMON_PATTERNS.map((pattern, index) => (
              <div key={index} className="space-y-2">
                <Badge variant="outline" className="font-mono text-sm">
                  {pattern.pattern}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

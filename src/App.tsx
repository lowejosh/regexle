import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

function App() {
  const [count, setCount] = useState(0);
  const [regexInput, setRegexInput] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Regexle
          </h1>
          <p className="text-xl text-muted-foreground">
            A puzzle game focused on regular expressions
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">React + TypeScript</Badge>
            <Badge variant="secondary">Vite</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Counter Demo</CardTitle>
              <CardDescription>
                Test the Button component from shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => setCount((count) => count + 1)}
                  size="lg"
                >
                  Count is {count}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regex Input Demo</CardTitle>
              <CardDescription>
                Test input for future regex patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your regex pattern..."
                value={regexInput}
                onChange={(e) => setRegexInput(e.target.value)}
              />
              {regexInput && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    Pattern:{" "}
                    <code className="bg-background px-1 rounded">
                      {regexInput}
                    </code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Your modern stack is ready! Start building your regex puzzle game.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegexInputProps {
  userPattern: string;
  onPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTestPattern: () => void;
}

export function RegexInput({
  userPattern,
  onPatternChange,
  onTestPattern,
}: RegexInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your solution:</label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter your regex pattern..."
          value={userPattern}
          onChange={onPatternChange}
          className="font-mono"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onTestPattern();
            }
          }}
        />
        <Button onClick={onTestPattern} disabled={!userPattern.trim()}>
          Submit
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RegexInputProps {
  userPattern: string;
  onPatternChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTestPattern: () => void;
  disabled?: boolean;
}

export function RegexInput({
  userPattern,
  onPatternChange,
  onTestPattern,
  disabled = false,
}: RegexInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Your solution:</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter your regex pattern..."
          value={userPattern}
          onChange={onPatternChange}
          className="font-mono flex-1"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !disabled) {
              onTestPattern();
            }
          }}
        />
        <Button
          onClick={onTestPattern}
          disabled={disabled || !userPattern.trim()}
          className="w-full sm:w-auto"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

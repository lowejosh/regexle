import { useThemeStore } from "@/store/themeStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function ThemeToggle({ className, size = "sm" }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <svg
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-300",
            isDarkMode
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
        </svg>

        {/* Moon icon */}
        <svg
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-300",
            isDarkMode
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Optional text label for larger sizes */}
      {size !== "sm" && (
        <span className="ml-2 hidden sm:inline">
          {isDarkMode ? "Light" : "Dark"}
        </span>
      )}
    </Button>
  );
}

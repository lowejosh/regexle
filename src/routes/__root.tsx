import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { RegexTitle } from "@/components/ui/RegexTitle";
import { CircuitBoardBackground } from "@/components/ui/CircuitBoardBackground";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function RootComponent() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] relative text-gray-800 dark:text-white">
      <CircuitBoardBackground />

      <nav className="relative z-10 border-b border-border/60 bg-card/60 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-4 transition-all duration-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="group flex-shrink-0">
            <RegexTitle className="mobile-optimized" />
          </Link>
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <Link to="/">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">Daily Puzzle</span>
                  <span className="sm:hidden">Daily</span>
                </Button>
              )}
            </Link>
            <Link to="/practice">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  Practice
                </Button>
              )}
            </Link>
            <Link to="/cheatsheet">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">Cheat Sheet</span>
                  <span className="sm:hidden">Cheat</span>
                </Button>
              )}
            </Link>
            <Link to="/statistics">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">Statistics</span>
                  <span className="sm:hidden">Stats</span>
                </Button>
              )}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="relative z-10 transition-all duration-300 ease-out">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

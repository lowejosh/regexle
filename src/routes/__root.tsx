import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { RegexTitle } from "@/components/ui/RegexTitle";

function RootComponent() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-[#fff8f0] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255, 182, 153, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 244, 214, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 182, 153, 0.1) 0%, transparent 50%)`,
        }}
      />

      <nav className="relative z-10 border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="group">
            <RegexTitle />
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={
                  location.pathname === "/"
                    ? "text-primary"
                    : "hover:bg-accent hover:text-accent-foreground"
                }
              >
                Daily Puzzle
              </Button>
            </Link>
            <Link to="/random">
              <Button
                variant="ghost"
                size="sm"
                className={
                  location.pathname === "/random"
                    ? "text-primary"
                    : "hover:bg-accent hover:text-accent-foreground"
                }
              >
                Random Puzzle
              </Button>
            </Link>
            <Link to="/cheatsheet">
              <Button
                variant="ghost"
                size="sm"
                className={
                  location.pathname === "/cheatsheet"
                    ? "text-primary"
                    : "hover:bg-accent hover:text-accent-foreground"
                }
              >
                Cheat Sheet
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card px-6 py-4">
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
                Game
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
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});

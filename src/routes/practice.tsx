import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { PracticePage } from "@/components/pages/Practice";

function PracticeLayout() {
  // If we're at the exact /practice route, show the browse page
  // Otherwise, show the outlet for child routes
  const { pathname } = useRouterState().location;
  
  if (pathname === "/regexle/practice" || pathname === "/practice") {
    return <PracticePage />;
  }
  
  return <Outlet />;
}

export const Route = createFileRoute("/practice")({
  component: PracticeLayout,
});

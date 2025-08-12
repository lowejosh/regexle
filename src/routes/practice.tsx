import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { PracticePage } from "@/components/pages/Practice";

function PracticeLayout() {
  const { pathname } = useRouterState().location;
  
  if (pathname === "/regexle/practice" || pathname === "/practice") {
    return <PracticePage />;
  }
  
  return <Outlet />;
}

export const Route = createFileRoute("/practice")({
  component: PracticeLayout,
});

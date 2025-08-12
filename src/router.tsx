import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ 
  routeTree,
  basepath: "/regexle"
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Router() {
  return <RouterProvider router={router} />;
}

import { PageLayout } from "@/components/ui";
import { BrowsePractice } from "./components";

export function PracticePage() {
  return (
    <PageLayout showHeader={false}>
      <BrowsePractice />
    </PageLayout>
  );
}

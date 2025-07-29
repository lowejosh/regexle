import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { PageLayout } from "@/components/ui";
import { RandomPractice, BrowsePractice } from "./components";

export function PracticePage() {
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <PageLayout showHeader={false}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="browse" className="text-sm sm:text-base">
            Browse Puzzles
          </TabsTrigger>
          <TabsTrigger value="random" className="text-sm sm:text-base">
            Random Challenge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="random" className="mt-0">
          <RandomPractice />
        </TabsContent>

        <TabsContent value="browse" className="mt-0">
          <BrowsePractice />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { RandomPractice, BrowsePractice } from "./components";

export function PracticePage() {
  const [activeTab, setActiveTab] = useState("random");

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="random" className="text-sm sm:text-base">
            Random Challenge
          </TabsTrigger>
          <TabsTrigger value="browse" className="text-sm sm:text-base">
            Browse Puzzles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="random" className="mt-0">
          <RandomPractice />
        </TabsContent>

        <TabsContent value="browse" className="mt-0">
          <BrowsePractice />
        </TabsContent>
      </Tabs>
    </div>
  );
}

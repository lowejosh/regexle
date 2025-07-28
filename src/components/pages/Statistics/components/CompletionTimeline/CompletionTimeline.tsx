import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/Card";
import { Calendar } from "lucide-react";

export function CompletionTimeline() {
  const svgRef = useRef<SVGSVGElement>(null);
  const completedPuzzlesData = useGameStore(
    (state) => state.completedPuzzlesData
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const generateTimelineData = () => {
      const data = [];
      const today = new Date();

      const completionsByDate = new Map<string, number>();
      Array.from(completedPuzzlesData.values()).forEach((puzzle) => {
        const date = new Date(puzzle.timestamp).toDateString();
        completionsByDate.set(date, (completionsByDate.get(date) || 0) + 1);
      });

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toDateString();

        data.push({
          date: date,
          count: completionsByDate.get(dateKey) || 0,
          dayOfWeek: date.getDay(),
        });
      }

      return data;
    };

    const data = generateTimelineData();

    d3.select(svgRef.current).selectAll("*").remove();

    const cellSize = 12;
    const cellPadding = 2;
    const weekHeight = 7 * (cellSize + cellPadding);

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const height = weekHeight + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3
      .scaleSequential()
      .domain([0, d3.max(data, (d) => d.count) || 3])
      .interpolator(d3.interpolateBlues);

    const weeks = d3.groups(data, (d) => d3.timeWeek.floor(d.date));

    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    g.selectAll(".day-label")
      .data(dayLabels)
      .enter()
      .append("text")
      .attr("x", -10)
      .attr("y", (_, i) => i * (cellSize + cellPadding) + cellSize)
      .attr("text-anchor", "end")
      .attr("class", "text-xs fill-muted-foreground")
      .text((d) => d);

    weeks.forEach((week, weekIndex) => {
      const weekGroup = g
        .append("g")
        .attr(
          "transform",
          `translate(${weekIndex * (cellSize + cellPadding)}, 0)`
        );

      weekGroup
        .selectAll(".day-cell")
        .data(week[1])
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => d.dayOfWeek * (cellSize + cellPadding))
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 2)
        .attr("fill", (d) =>
          d.count > 0 ? colorScale(d.count) : "hsl(var(--muted))"
        )
        .attr("stroke", "hsl(var(--border))")
        .attr("stroke-width", 1);
    });
  }, [completedPuzzlesData]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Activity Timeline</h2>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full" />
      </div>

      <p className="text-sm text-muted-foreground mt-4">
        Your puzzle completion activity over the last 30 days
      </p>
    </Card>
  );
}

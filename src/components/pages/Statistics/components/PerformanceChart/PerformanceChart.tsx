import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { useStatisticsStore } from "../../../../../store/statisticsStore";
import { useGameStore } from "@/store/gameStore";
import { Card } from "@/components/ui/Card";

export function PerformanceChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { getTopPerformanceDays } = useStatisticsStore();
  const completedPuzzlesData = useGameStore(
    (state) => state.completedPuzzlesData
  );

  const topDays = useMemo(
    () => getTopPerformanceDays().slice(0, 5),
    [getTopPerformanceDays]
  );

  const performanceData = useMemo(() => {
    const puzzleAttempts = Array.from(completedPuzzlesData.values());
    const attemptCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5+ attempts

    puzzleAttempts.forEach((puzzle) => {
      if (puzzle.attempts === 1) attemptCounts[0]++;
      else if (puzzle.attempts === 2) attemptCounts[1]++;
      else if (puzzle.attempts === 3) attemptCounts[2]++;
      else if (puzzle.attempts === 4) attemptCounts[3]++;
      else attemptCounts[4]++; // 5+ attempts
    });

    return [
      { attempts: "1", count: attemptCounts[0] },
      { attempts: "2", count: attemptCounts[1] },
      { attempts: "3", count: attemptCounts[2] },
      { attempts: "4", count: attemptCounts[3] },
      { attempts: "5+", count: attemptCounts[4] },
    ];
  }, [completedPuzzlesData]);

  const averageAttempts = useMemo(() => {
    const puzzleAttempts = Array.from(completedPuzzlesData.values());
    if (puzzleAttempts.length === 0) return "0";

    const totalAttempts = puzzleAttempts.reduce(
      (sum, puzzle) => sum + puzzle.attempts,
      0
    );
    return (totalAttempts / puzzleAttempts.length).toFixed(1);
  }, [completedPuzzlesData]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(performanceData.map((d) => d.attempts))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(performanceData, (d) => d.count) || 10])
      .nice()
      .range([height, 0]);

    // Create and add the bars
    svg
      .selectAll(".bar")
      .data(performanceData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.attempts) || 0)
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.count))
      .attr("fill", "hsl(var(--primary))")
      .attr("rx", 4)
      .attr("ry", 4);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .attr("class", "text-xs");

    // Add Y axis
    svg.append("g").call(d3.axisLeft(yScale).ticks(5)).attr("class", "text-xs");

    // Style the axis text
    svg.selectAll(".domain, .tick line").attr("stroke", "hsl(var(--border))");

    svg.selectAll(".tick text").attr("fill", "hsl(var(--muted-foreground))");
  }, [performanceData]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Performance Analysis</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Avg. Attempts</p>
          <p className="text-2xl font-bold">{averageAttempts}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Top Performance Days */}
      {topDays.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground mb-3">
            Best Performance Days
          </h4>
          <div className="space-y-2">
            {topDays.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">#{index + 1}</span>
                  <span className="font-medium">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <span>{day.solveCount} solves</span>
                  <span>{day.averageAttempts.toFixed(1)} avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4">
        Distribution of puzzles solved by number of attempts
      </p>
    </Card>
  );
}

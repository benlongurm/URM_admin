import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { BubbleChartData } from "../dashboard/overview/analysis-view";

// Define types for the data structure

interface Dimensions {
  width: number;
  height: number;
}

const HierarchicalBubbles: React.FC<{ data: BubbleChartData }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth * 0.4; // Adjust width to 80% of the window
      const height = (width * 400) / 600; // Maintain the aspect ratio
      setDimensions({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set dimensions

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const transformedData = {
      children: data?.map((parent) => ({
        text: parent.text,
        children: parent.subgroups.map((subgroup) => ({
          ...subgroup,
        })),
      })),
    };

    const root = d3.hierarchy(transformedData as any)
      .sum((d: any) => d.value)
      .sort((a, b) => b.value! - a.value!);

    const pack = d3.pack()
      .size([dimensions.width, dimensions.height])
      .padding(10);

    pack(root);

    const nodes = root.descendants().filter((d) => d.depth > 0);

    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
      .attr("style", "font-family: Arial, sans-serif;");

    const colorParent = d3.scaleOrdinal<string>()
      .domain(data?.map(d => d.text) || []) // Set the domain to parent text
      .range([
        'rgba(42, 56, 82, 1)', 
        'rgba(42, 56, 82, 0.8)', 
        'rgba(42, 56, 82, 0.6)', 
        'rgba(42, 56, 82, 0.4)', 
        'rgba(42, 56, 82, 0.2)'
      ]);

    const colorChild = d3.scaleOrdinal<string>()
      .domain(data?.flatMap(d => d.subgroups.map(sg => sg.text)) || []) // Set the domain to child text
      .range([
        'rgba(177, 192, 207, 1)', 
        'rgba(177, 192, 207, 1)', 
        'rgba(177, 192, 207, 1)', 
        'rgba(177, 192, 207, 1)', 
        'rgba(177, 192, 207, 1)'
      ]);

    const nodeGroup = svg
      .selectAll<SVGGElement, typeof nodes[0]>("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    nodeGroup
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => (d.depth === 1 ? colorParent(d.data.text) : colorChild(d.data.text)))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (d.depth === 1 ? 0.8 : 1))
      .on("mouseover", function () {
        d3.select(this).attr("stroke-width", 4).attr("opacity", 1);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("stroke-width", 2).attr("opacity", d.depth === 1 ? 0.8 : 1);
      });

    // Add labels for parent bubbles (depth === 1)
    nodeGroup
      .filter((d) => d.depth === 1)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => `-${d.r - 10}px`) // Move text to the top inside the bubble
      .style("font-size", (d) => Math.min((2 * d.r) / d.data.text.length, 10)) // Responsive font size
      .style("fill", "#333")
      .text((d) => d.data.text);

    // Add labels for child bubbles (depth === 2)
    nodeGroup
      .filter((d) => d.depth === 2)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em") // Center vertically within the bubble
      .style("font-size", (d) => Math.min((2 * d.r) / d.data.text.length, 12)) // Responsive font size
      .style("fill", "#333")
      .text((d) => d.data.text);

    nodeGroup
      .append("title")
      .text((d) =>
        d.children
          ? `${d.data.text}\nTotal Value: ${d.value}`
          : `${d.data.text}\nValue: ${d.value}`
      );

  }, [data, dimensions]);

  return (
    <div style={{ textAlign: "center", marginLeft: '-100px' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HierarchicalBubbles;

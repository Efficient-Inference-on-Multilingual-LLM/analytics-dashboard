"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { IndividualHeatmapResponse } from "@/types/response";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface IndividualPerLayerHeatmapProps {
  data: IndividualHeatmapResponse;
  showAnnotations?: boolean;
}

const TILE_WIDTH = 60;
const TILE_HEIGHT = 50;

function textSizeForCols(numCols: number): number {
  if (numCols < 10) return 15;
  if (numCols < 20) return 13;
  if (numCols < 30) return 11;
  if (numCols < 40) return 9;
  return 7.25;
}

const IndividualPerLayerHeatmap = ({
  data,
  showAnnotations = true,
}: IndividualPerLayerHeatmapProps) => {
  const { grid, layers, value_range, method } = data;

  const plot = useMemo(() => {
    if (!grid || grid.length === 0) return null;

    const numRows = grid.length;
    const numCols = layers.length;

    const z = grid.map((row) => row.map((cell) => cell.score));
    const text = grid.map((row) =>
      row.map((cell) => {
        const scoreStr = cell.score.toExponential(2);
        if (showAnnotations) {
          return `<span style="color:${cell.color}"><b>${cell.language}</b></span><br><span>${scoreStr}</span>`;
        }
        return `<span style="color:${cell.color}"><b>${cell.language}</b></span>`;
      }),
    );
    const hover = grid.map((row) =>
      row.map(
        (cell) =>
          `Rank: ${cell.rank}<br>Language: ${cell.language}<br>Score: ${cell.score.toExponential(2)}<br>Family: ${cell.family}`,
      ),
    );
    const ranks = grid.map((row) => row[0]?.rank ?? 0);

    const width = numCols * TILE_WIDTH + 50;
    const height = numRows * TILE_HEIGHT + 100;

    const colorscale = method === "silhouette" ? "Viridis_r" : "Viridis";
    const colorbarTitle =
      method === "lape" ? "Overlap/Total" : `${method.toUpperCase()} Score`;

    return {
      z,
      text,
      hover,
      ranks,
      width,
      height,
      colorscale,
      colorbarTitle,
      textSize: textSizeForCols(numCols),
    };
  }, [grid, layers, showAnnotations, method]);

  if (!plot) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        Select at least 2 languages to visualize.
      </div>
    );
  }

  const title =
    method === "lape"
      ? "Ratio between Overlap of Language-Specific Neurons and Total Neuron per Layer"
      : `${method.toUpperCase()} Score`;

  return (
    <div className="w-full overflow-x-auto">
      <Plot
        data={[
          {
            type: "heatmap",
            z: plot.z,
            x: layers,
            y: plot.ranks,
            text: plot.text ? "%{text}" : undefined,
            texttemplate: "%{text}",
            customdata: plot.hover,
            hovertemplate: "%{customdata}<extra></extra>",
            colorscale: plot.colorscale,
            zmin: value_range[0],
            zmax: value_range[1],
            colorbar: { title: { text: plot.colorbarTitle } },
            textfont: { size: plot.textSize },
            xgap: 1,
            ygap: 1,
          },
        ]}
        layout={{
          title: {
            text: `<b>${title} (Sorted Independently per Layer)</b>`,
            xanchor: "center",
            x: 0.5,
          },
          height: plot.height,
          plot_bgcolor: "#e5e7eb",
          xaxis: {
            title: { text: "Layer Index" },
            tickmode: "linear",
            side: "bottom",
          },
          yaxis: {
            title: { text: "Rank" },
            autorange: "reversed",
            tickmode: "linear",
            dtick: 1,
          },
          font: { size: 12 },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};

export default IndividualPerLayerHeatmap;

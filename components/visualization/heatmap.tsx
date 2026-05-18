import React from "react";
import dynamic from "next/dynamic";
import type { Data, Layout, Config } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface HeatmapProps {
  z: number[][];
  x: (string | number)[];
  y: (string | number)[];
  zmin: number;
  zmax: number;
  colorScale?: string;
  hoverTemplate?: string;
  layout?: Partial<Layout>;
  showAnnotations?: boolean;
  annotationsDecimal?: number;
  height?: number;
}

const Heatmap = ({
  z,
  x,
  y,
  zmin,
  zmax,
  colorScale = "Viridis",
  hoverTemplate = "%{z}",
  layout = {},
  showAnnotations = false,
  annotationsDecimal = 2,
  height = 400,
}: HeatmapProps) => {
  const text = showAnnotations
    ? z.map((row) => row.map((value) => value.toFixed(annotationsDecimal)))
    : undefined;

  const data: Data[] = [
    {
      type: "heatmap",
      z,
      x,
      y,
      colorscale: colorScale,
      zmin,
      zmax,
      hovertemplate: hoverTemplate ?? "%{z:.4f}<extra></extra>",
      showscale: true,
      ...(text ? { text, texttemplate: "%{text}", textfont: { size: 8 } } : {}),
    } as Data,
  ];

  const baseLayout: Partial<Layout> = {
    height,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "currentColor" },
    margin: { t: 40, r: 40, b: 60, l: 60 },
    ...layout,
  };

  const config: Partial<Config> = {
    displaylogo: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    responsive: true,
  };

  return (
    <Plot
      data={data}
      layout={baseLayout}
      config={config}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Heatmap;

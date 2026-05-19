import React, { useEffect, useRef, useState } from "react";
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
  title?: string;
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
  title,
}: HeatmapProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() => 0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = Math.floor(entry.contentRect.width);
      if (w > 0) setContainerWidth(w);
    });
    obs.observe(el);
    const initial = Math.floor(el.getBoundingClientRect().width);
    if (initial > 0) setContainerWidth(initial);
    return () => obs.disconnect();
  }, []);

  const numCols = x.length;
  const numRows = y.length;

  const text = showAnnotations
    ? z.map((row) => row.map((value) => value.toFixed(annotationsDecimal)))
    : undefined;

  const plotAreaWidth =
    containerWidth - (layout.margin?.l ?? 60) - (layout.margin?.r ?? 40);
  const cellSize = plotAreaWidth / numCols;
  const plotAreaHeight = cellSize * numRows;
  const height = Math.round(
    plotAreaHeight + (layout.margin?.t ?? 40) + (layout.margin?.b ?? 60),
  );

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
    title: {
      text: title,
      font: { size: 16 },
      xref: "paper",
      x: 0.5,
    },
    width: containerWidth,
    height: height,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: { color: "currentColor" },
    margin: { t: 40, r: 40, b: 60, l: 60 },
    ...layout,
  };

  const config: Partial<Config> = {
    displaylogo: false,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
    responsive: false,
  };

  return (
    <div ref={wrapperRef} style={{ width: "100%", overflow: "hidden" }}>
      {containerWidth > 0 && (
        <Plot
          data={data}
          layout={baseLayout}
          config={config}
          useResizeHandler={false}
          style={{
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default Heatmap;

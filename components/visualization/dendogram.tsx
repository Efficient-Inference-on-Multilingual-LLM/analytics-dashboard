import dynamic from "next/dynamic";
import type { Data, Layout } from "plotly.js";
import React, { useRef, useState, useEffect } from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface DendogramProps {
  title: string;
  data: Data[];
  leafAxis: Partial<Layout["xaxis"]>;
  orientation?: "vertical" | "horizontal";
}

const MAX_LEAF_HEIGHT = 40; // max height per leaf in pixels
const MIN_LEAF_HEIGHT = 12; // min height per leaf in pixels
const MIN_HEIGHT = 200; // minimum total height of the dendogram

const Dendogram = ({ title, data, leafAxis, orientation }: DendogramProps) => {
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

  const isHorizontal = orientation === "horizontal";
  const distanceAxis: Partial<Layout["xaxis"]> = {
    showgrid: true,
    gridcolor: "rgba(128,128,128,0.2)",
  };
  const layout: Partial<Layout> = {
    xaxis: isHorizontal ? leafAxis : distanceAxis,
    yaxis: isHorizontal ? distanceAxis : { ...leafAxis, autorange: "reversed" },
    margin: isHorizontal
      ? { l: 30, r: 30, t: 10, b: 100 }
      : { l: 170, r: 30, t: 50, b: 50 },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    title: { text: title, font: { size: 16 }, xref: "paper", x: 0.5 },
    font: { color: "currentColor" },
    showlegend: false,
  };
  const plotAreaWidth =
    containerWidth - (layout.margin?.l ?? 30) - (layout.margin?.r ?? 30);
  const numLeaves = leafAxis.tickvals ? leafAxis.tickvals.length : 0;
  const leafHeight = Math.min(
    MAX_LEAF_HEIGHT,
    Math.max(MIN_LEAF_HEIGHT, plotAreaWidth / numLeaves),
  );
  const height = Math.max(
    MIN_HEIGHT,
    Math.round(
      numLeaves * leafHeight +
        (layout.margin?.t ?? 50) +
        (layout.margin?.b ?? 50),
    ),
  );

  return (
    <div ref={wrapperRef} style={{ width: "100%", overflow: "hidden" }}>
      {containerWidth > 0 && (
        <Plot
          data={data}
          layout={{
            ...layout,
            width: containerWidth,
            height: height,
          }}
          useResizeHandler={false}
          style={{ width: "100%", height: "100%" }}
          config={{
            displaylogo: false,
            modeBarButtonsToRemove: ["lasso2d", "select2d"],
            responsive: false,
          }}
        />
      )}
    </div>
  );
};

export default Dendogram;

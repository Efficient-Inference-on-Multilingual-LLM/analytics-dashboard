"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import type { IndividualHeatmapResponse } from "@/types/response";
import { useLanguageRegistry } from "@/hooks/api/languages";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface IndividualLanguagesHeatmapProps {
  data: IndividualHeatmapResponse;
  showAnnotations?: boolean;
}

const TILE_SIZE_ANNOTATED = 20;
const TILE_SIZE_PLAIN = 10;
const MARGIN_LR = 3;
const MARGIN_TB = 2;

const IndividualLanguagesHeatmap = ({
  data,
  showAnnotations = true,
}: IndividualLanguagesHeatmapProps) => {
  const { rows, layers, value_range, method, main_language } = data;
  const languageRegistry = useLanguageRegistry();

  const mainLanguageName =
    languageRegistry?.get(main_language) ?? main_language;

  const plot = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    const z = rows.map((r) => r.values);
    const MAX_LABEL = 14;

    const truncate = (s: string) =>
      s.length > MAX_LABEL ? s.slice(0, MAX_LABEL - 1) + "…" : s;

    const styledLabels = rows.map((r) => {
      const name = languageRegistry?.get(r.language) ?? r.language;
      return `<span style="color:${r.color};">${truncate(name)}</span>`;
    });

    const hoverNames = rows.map(
      (r) => languageRegistry?.get(r.language) ?? r.language,
    );
    const tickVals = rows.map((_, i) => i);

    const tileSize = showAnnotations ? TILE_SIZE_ANNOTATED : TILE_SIZE_PLAIN;
    const width = layers.length * tileSize + MARGIN_LR * 2;
    const height = rows.length * tileSize + MARGIN_TB * 2 + 30;

    const colorscale = method === "silhouette" ? "Viridis_r" : "Viridis";
    const colorbarTitle =
      method === "lape" ? "Overlap/Total" : `${method.toUpperCase()} Score`;

    const text = showAnnotations
      ? z.map((row) => row.map((v) => v.toFixed(4)))
      : undefined;

    return {
      z,
      styledLabels,
      tickVals,
      width,
      height,
      colorscale,
      colorbarTitle,
      text,
      hoverNames,
    };
  }, [rows, layers, showAnnotations, method, languageRegistry]);

  if (!plot) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        Select at least 2 languages to visualize.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Plot
        data={[
          {
            type: "heatmap",
            z: plot.z,
            x: layers,
            y: plot.tickVals,
            colorscale: plot.colorscale,
            zmin: value_range[0],
            zmax: value_range[1],
            colorbar: { title: { text: plot.colorbarTitle } },
            text: plot.text ? "%{text}" : undefined,
            texttemplate: plot.text ? "%{text}" : undefined,
            textfont: { size: 5 },
            xgap: 1,
            ygap: 1,
            customdata: plot.z.map((_, i) =>
              plot.z[i].map(() => plot.hoverNames[i]),
            ),
            hovertemplate:
              "%{customdata}<br>Layer: %{x}<br>Score: %{z:.4f}<extra></extra>",
          },
        ]}
        layout={{
          title: {
            text: `<b>${mainLanguageName} vs Other Languages (Sorted by Taxonomy)</b>`,
            xanchor: "center",
            x: 0.5,
          },
          height: plot.height,
          plot_bgcolor: "#e5e7eb",
          xaxis: {
            title: { text: "Layer Index", standoff: 20 },
            tickangle: 0,
            side: "bottom",
            tickmode: "array",
            tickvals: layers,
          },
          yaxis: {
            autorange: "reversed",
            side: "left",
            tickmode: "array",
            tickvals: plot.tickVals,
            ticktext: plot.styledLabels,
          },
          margin: { l: 120, b: 40, t: 35, r: 60 },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true, displaylogo: false }}
      />
    </div>
  );
};

export default IndividualLanguagesHeatmap;

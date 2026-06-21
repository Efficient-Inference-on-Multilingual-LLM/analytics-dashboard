"use client";
import { useMemo } from "react";
import type { Data, Layout } from "plotly.js";
import type { DifferenceResponse } from "@/types/response";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Props {
  data: DifferenceResponse;
  nameOf?: (code: string) => string;
  colorOf?: (code: string) => string;
}

const DifferenceHeatmap = ({ data, nameOf, colorOf }: Props) => {
  const labels = useMemo(() => {
    return data.languages.map((code) => {
      const name = nameOf?.(code) ?? code;
      const color = colorOf?.(code);
      return color
        ? `<span style="color:${color};font-weight:bold">${name}</span>`
        : name;
    });
  }, [data, nameOf, colorOf]);

  const tickvals = useMemo(() => data.languages.map((_, i) => i), [data]);

  const trace = useMemo<Data>(
    () => ({
      type: "heatmap",
      z: data.matrix,
      x: tickvals,
      y: tickvals,
      colorscale: "RdBu",
      zmin: data.value_range[0],
      zmax: data.value_range[1],
      colorbar: { title: { text: `${data.metric_label} Difference` } },
    }),
    [data, tickvals],
  );

  const layout = useMemo<Partial<Layout>>(
    () => ({
      title: {
        text: `${data.metric_label} Difference<br><span style="font-size: 14px; color: gray;">L${data.target.layer}/${data.target.component} - L${data.source.layer}/${data.source.component}</span>`,
        x: 0.5,
        xanchor: "center",
      },
      width: 1100,
      height: 1100,
      xaxis: {
        tickangle: -90,
        side: "bottom",
        tickmode: "array",
        tickvals,
        ticktext: labels,
        tickfont: { size: 11 },
      },
      yaxis: {
        autorange: "reversed",
        side: "left",
        tickmode: "array",
        tickvals,
        ticktext: labels,
        tickfont: { size: 11 },
      },
      margin: { l: 0, b: 10, t: 60, r: 0 },
    }),
    [data, labels, tickvals],
  );

  return (
    <Plot
      data={[trace]}
      layout={layout}
      config={{ displaylogo: false, displayModeBar: true }}
    />
  );
};

export default DifferenceHeatmap;

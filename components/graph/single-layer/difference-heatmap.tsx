"use client";
import { useMemo } from "react";
import type { Data, Layout } from "plotly.js";
import type { DifferenceResponse } from "@/types/response";
import type { LanguageGroupDto } from "@/types/dto";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Props {
  data: DifferenceResponse;
  sortGroups?: LanguageGroupDto[];
  languageRegistry?: Map<string, string>;
}

const DifferenceHeatmap = ({ data, sortGroups, languageRegistry }: Props) => {
  const languageToColor = useMemo(() => {
    const map = new Map<string, string>();
    for (const group of sortGroups ?? []) {
      for (const lang of group.languages) {
        map.set(lang, group.color);
      }
    }
    return map;
  }, [sortGroups]);

  const coloredLabels = useMemo(
    () =>
      data.languages.map((lang) => {
        const color = languageToColor.get(lang);
        const displayName = languageRegistry?.get(lang) ?? lang;
        if (!color) return displayName;
        return `<span style="color:${color}"><b>${displayName}</b></span>`;
      }),
    [data.languages, languageToColor, languageRegistry],
  );

  const trace = useMemo<Data>(
    () => ({
      type: "heatmap",
      z: data.matrix,
      x: data.languages,
      y: data.languages,
      colorscale: "RdBu",
      zmin: data.value_range[0],
      zmax: data.value_range[1],
      colorbar: { title: { text: `${data.metric_label} Difference` } },
    }),
    [data],
  );

  const layout = useMemo<Partial<Layout>>(
    () => ({
      title: {
        text: `${data.metric_label} Difference<br><span style="font-size: 14px; color: gray;">L${data.target.layer}/${data.target.component} - L${data.source.layer}/${data.source.component}</span>`,
        x: 0.5,
        xanchor: "center",
      },
      width: 1400,
      height: 1400,
      xaxis: {
        tickangle: -90,
        side: "bottom",
        tickmode: "array",
        tickvals: data.languages,
        ticktext: coloredLabels,
        tickfont: { size: 11 },
        automargin: true,
      },
      yaxis: {
        autorange: "reversed",
        side: "left",
        tickmode: "array",
        tickvals: data.languages,
        ticktext: coloredLabels,
        tickfont: { size: 11 },
        automargin: true,
      },
      margin: { l: 120, b: 140, t: 80, r: 20 },
    }),
    [data, coloredLabels],
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

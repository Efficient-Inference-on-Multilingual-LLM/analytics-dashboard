import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { LayerHeatmapDto, LanguageGroupDto } from "@/types/dto";
import Heatmap from "@/components/visualization/heatmap";

interface SingleLayerHeatmapProps {
  title: string;
  data: LayerHeatmapDto;
  sortGroups?: LanguageGroupDto[];
  languageRegistry?: Map<string, string>;
  className?: string;
  colorScale?: string;
  height?: number;
  showAxisLabels?: boolean;
}

const SingleLayerHeatmap = ({
  title,
  className,
  sortGroups,
  languageRegistry,
  data,
  colorScale = "Viridis",
  height = 400,
  showAxisLabels = false,
}: SingleLayerHeatmapProps) => {
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
        const displayName = languageRegistry?.get(lang) || lang;
        console.log(
          `Label for ${lang}: displayName=${displayName}, color=${color}`,
        );
        if (!color) return lang;
        return `<span style="color:${color}"><b>${displayName}</b></span>`;
      }),
    [data.languages, languageToColor, languageRegistry],
  );

  return (
    <>
      <Heatmap
        z={data.matrix}
        x={data.languages}
        y={data.languages}
        zmin={data.value_range[0]}
        zmax={data.value_range[1]}
        colorScale={colorScale}
        height={height}
        layout={{
          margin: {
            l: showAxisLabels ? 100 : 30,
            r: 40,
            t: 40,
            b: showAxisLabels ? 100 : 30,
          },
          xaxis: {
            tickangle: -90,
            showticklabels: showAxisLabels,
            tickmode: "array",
            tickvals: data.languages.map((_, i) => i),
            ticktext: coloredLabels,
            tickfont: { size: 8, family: "monospace" },
            automargin: true,
          },
          yaxis: {
            autorange: "reversed",
            showticklabels: showAxisLabels,
            tickmode: "array",
            tickvals: data.languages.map((_, i) => i),
            ticktext: coloredLabels,
            tickfont: { size: 8, family: "monospace" },
            automargin: true,
          },
        }}
      />
    </>
  );
};

export default SingleLayerHeatmap;

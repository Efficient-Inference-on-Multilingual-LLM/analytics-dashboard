import React, { useMemo } from "react";
import { LayerHeatmapDto, LanguageGroupDto } from "@/types/dto";
import Heatmap from "@/components/visualization/heatmap";
import { cn } from "@/lib/utils";

interface SingleLayerHeatmapProps {
  title: string;
  data: LayerHeatmapDto;
  sortGroups?: LanguageGroupDto[];
  languageRegistry?: Map<string, string>;
  className?: string;
  colorScale?: string;
  showAxisLabels?: boolean;
}

const SingleLayerHeatmap = ({
  title,
  className,
  sortGroups,
  languageRegistry,
  data,
  colorScale = "Viridis",
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
        if (!color) return lang;
        return `<span style="color:${color}"><b>${displayName}</b></span>`;
      }),
    [data.languages, languageToColor, languageRegistry],
  );

  return (
    <div className={cn("min-w-0 overflow-hidden", className)}>
      <Heatmap
        title={title}
        z={data.matrix}
        x={data.languages}
        y={data.languages}
        zmin={data.value_range[0]}
        zmax={data.value_range[1]}
        colorScale={colorScale}
        layout={{
          margin: {
            l: showAxisLabels ? 100 : 30,
            r: 40,
            t: 60,
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
            scaleanchor: "y",
            scaleratio: 1,
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
    </div>
  );
};

export default SingleLayerHeatmap;

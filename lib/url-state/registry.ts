import {
  heatmapParser,
  crossModelParser,
  layerTrendParser,
  individualHeatmapParser,
  individualHeatmapRankParser,
} from "./parser";

export const PAGE_PARSERS = {
  heatmap: heatmapParser,
  crossModel: crossModelParser,
  layerTrend: layerTrendParser,
  individualHeatmap: individualHeatmapParser,
  individualHeatmapRank: individualHeatmapRankParser,
};

export type PageKey = keyof typeof PAGE_PARSERS;

export const PAGE_ROUTES: Record<PageKey, string> = {
  heatmap: "/single/heatmap",
  individualHeatmap: "/single/clustered",
  individualHeatmapRank: "/single/ranked",

  crossModel: "/comparison/cross-model",

  layerTrend: "/trends/cluster",
};

import { heatmapParser, crossModelParser, layerTrendParser } from "./parser";

export const PAGE_PARSERS = {
  heatmap: heatmapParser,
  crossModel: crossModelParser,
  layerTrend: layerTrendParser,
};

export type PageKey = keyof typeof PAGE_PARSERS;

export const PAGE_ROUTES: Record<PageKey, string> = {
  heatmap: "/single/heatmap",

  crossModel: "/comparison/cross-model",

  layerTrend: "/trends/cluster",
};

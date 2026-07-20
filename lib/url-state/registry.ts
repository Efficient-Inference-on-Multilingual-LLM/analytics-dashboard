import {
  heatmapParser,
  crossModelParser,
  layerTrendParser,
  individualHeatmapParser,
  individualHeatmapRankParser,
  dynamicTrajectoryParser,
  differenceHeatmapParser,
  routingOverviewParser,
  logitsDynamicParser,
  logitsHeatmapParser,
  logitsSentenceParser,
} from "./parser";

export const PAGE_PARSERS = {
  heatmap: heatmapParser,
  crossModel: crossModelParser,
  layerTrend: layerTrendParser,
  individualHeatmap: individualHeatmapParser,
  individualHeatmapRank: individualHeatmapRankParser,
  dynamicTrajectory: dynamicTrajectoryParser,
  differenceHeatmap: differenceHeatmapParser,
  routingOverview: routingOverviewParser,
  logitsDynamic: logitsDynamicParser,
  logitsHeatmap: logitsHeatmapParser,
  logitsSentence: logitsSentenceParser,
};

export type PageKey = keyof typeof PAGE_PARSERS;

export const PAGE_ROUTES: Record<PageKey, string> = {
  heatmap: "/single/heatmap",
  individualHeatmap: "/single/clustered",
  individualHeatmapRank: "/single/ranked",
  dynamicTrajectory: "/single/dynamic",

  crossModel: "/comparison/cross-model",
  differenceHeatmap: "/comparison/layer-difference",

  layerTrend: "/trends/cluster",

  routingOverview: "/logits/routing",
  logitsDynamic: "/logits/dynamic",
  logitsHeatmap: "/logits/heatmap",
  logitsSentence: "/logits/sentence",
};

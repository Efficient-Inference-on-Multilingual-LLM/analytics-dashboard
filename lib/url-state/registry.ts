import { heatmapParser } from "./parser";

export const PAGE_PARSERS = {
  heatmap: heatmapParser,
};

export type PageKey = keyof typeof PAGE_PARSERS;

export const PAGE_ROUTES: Record<PageKey, string> = {
  heatmap: "/single/heatmap",
};

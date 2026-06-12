import { useQueryStates } from "nuqs";
import { heatmapParser } from "@/lib/url-state/parser";

export function useHeatmapUrlState() {
  return useQueryStates(heatmapParser);
}

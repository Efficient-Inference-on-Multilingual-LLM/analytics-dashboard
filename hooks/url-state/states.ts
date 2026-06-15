import { useQueryStates } from "nuqs";
import { heatmapParser, crossModelParser } from "@/lib/url-state/parser";

export function useHeatmapUrlState() {
  return useQueryStates(heatmapParser);
}

export function useCrossModelUrlState() {
  return useQueryStates(crossModelParser);
}

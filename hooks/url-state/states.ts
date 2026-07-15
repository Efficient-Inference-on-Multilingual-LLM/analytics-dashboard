import { useQueryStates } from "nuqs";
import {
  heatmapParser,
  crossModelParser,
  layerTrendParser,
  individualHeatmapParser,
  individualHeatmapRankParser,
  dynamicTrajectoryParser,
  differenceHeatmapParser,
  routingOverviewParser,
} from "@/lib/url-state/parser";

export function useHeatmapUrlState() {
  return useQueryStates(heatmapParser);
}

export function useCrossModelUrlState() {
  return useQueryStates(crossModelParser);
}

export function useLayerTrendUrlState() {
  return useQueryStates(layerTrendParser);
}

export function useIndividualHeatmapUrlState() {
  return useQueryStates(individualHeatmapParser);
}

export function useIndividualHeatmapRankUrlState() {
  return useQueryStates(individualHeatmapRankParser);
}

export function useDynamicTrajectoryUrlState() {
  return useQueryStates(dynamicTrajectoryParser);
}

export function useDifferenceHeatmapUrlState() {
  return useQueryStates(differenceHeatmapParser);
}

export function useRoutingOverviewUrlState() {
  return useQueryStates(routingOverviewParser);
}

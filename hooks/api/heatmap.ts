import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  LayerHeatmapRequest,
  IndividualHeatmapRequest,
} from "@/types/request";
import type {
  IndividualHeatmapResponse,
  LayerHeatmapResponse,
} from "@/types/response";

export function useHeatmap(requests: LayerHeatmapRequest | null) {
  return useQuery({
    queryKey: ["heatmap", requests],
    queryFn: () => apiClient.post<LayerHeatmapResponse>("/heatmap", requests!),
    enabled: !!requests,
    staleTime: Infinity,
  });
}

export function useIndividualHeatmap(
  requests: IndividualHeatmapRequest | null,
) {
  return useQuery({
    queryKey: ["individualHeatmap", requests],
    queryFn: () =>
      apiClient.post<IndividualHeatmapResponse>(
        "/heatmap/individual",
        requests!,
      ),
    enabled: !!requests,
    staleTime: Infinity,
  });
}

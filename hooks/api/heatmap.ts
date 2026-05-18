import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { LayerHeatmapRequest } from "@/types/request";
import type { LayerHeatmapResponse } from "@/types/response";

export function useHeatmap(requests: LayerHeatmapRequest | null) {
  return useQuery({
    queryKey: ["heatmap", requests],
    queryFn: () => apiClient.post<LayerHeatmapResponse>("/heatmap", requests!),
    enabled: !!requests,
    staleTime: Infinity,
  });
}

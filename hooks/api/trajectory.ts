import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  TrajectoryLanguageRequest,
  TrajectoryRequest,
  LayerTrendRequest,
  DynamicTrajectoryRequest,
} from "@/types/request";
import type {
  TrajectoryLanguageResponse,
  TrajectoryResponse,
  LayerTrendResponse,
  DynamicTrajectoryResponse,
} from "@/types/response";
import { useLanguages } from "@/hooks/api/languages";
import { useMemo } from "react";

export function useTrajectoryLanguages(
  request: TrajectoryLanguageRequest | null,
) {
  return useQuery({
    queryKey: ["trajectory-languages", request],
    queryFn: () =>
      apiClient.post<TrajectoryLanguageResponse>(
        "/trajectory/languages",
        request!,
      ),
    enabled: !!request && (request.method !== "lape" || request.top_k != null),
    staleTime: Infinity,
  });
}

export function useCrossModelTrajectoryLanguages(
  body: TrajectoryLanguageRequest | null,
) {
  const { data: pool } = useTrajectoryLanguages(body);
  const { data: allLanguages } = useLanguages();

  return useMemo(() => {
    if (!pool || !allLanguages) return undefined;
    const unionSet = new Set(pool.union);
    return {
      languages: allLanguages.languages.filter((lang) =>
        unionSet.has(lang.code),
      ),
    };
  }, [pool, allLanguages]);
}

export function useTrajectory(request: TrajectoryRequest | null) {
  return useQuery({
    queryKey: ["trajectory", request],
    queryFn: () => apiClient.post<TrajectoryResponse>("/trajectory", request!),
    enabled:
      !!request && (request.method_id !== "lape" || request.top_k != null),
    staleTime: Infinity,
  });
}

export function useLayerTrend(request: LayerTrendRequest | null) {
  return useQuery({
    queryKey: ["layer-trend", request],
    queryFn: () =>
      apiClient.post<LayerTrendResponse>("/trajectory/layer-trends", request!),
    enabled: !!request,
    staleTime: Infinity,
  });
}

export function useDynamicTrajectory(request: DynamicTrajectoryRequest | null) {
  return useQuery({
    queryKey: ["dynamic-trajectory", request],
    queryFn: () =>
      apiClient.post<DynamicTrajectoryResponse>(
        "/trajectory/dynamic-component",
        request!,
      ),
    enabled: !!request && (request.method !== "lape" || request.top_k != null),
    staleTime: Infinity,
  });
}

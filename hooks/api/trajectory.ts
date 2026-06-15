import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type {
  TrajectoryLanguageRequest,
  TrajectoryRequest,
} from "@/types/request";
import type {
  TrajectoryLanguageResponse,
  TrajectoryResponse,
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
    enabled: !!request,
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
    enabled: !!request,
    staleTime: Infinity,
  });
}

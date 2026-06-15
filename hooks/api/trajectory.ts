import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { TrajectoryLanguageRequest } from "@/types/request";
import type { TrajectoryLanguageResponse } from "@/types/response";

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

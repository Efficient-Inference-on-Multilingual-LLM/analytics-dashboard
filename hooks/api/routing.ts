import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { RoutingsResponse } from "@/types/response";
import type { RoutingsRequest } from "@/types/request";

export function useRoutingsOverview(request: RoutingsRequest | null) {
  return useQuery({
    queryKey: ["routings-overview", request],
    queryFn: () =>
      apiClient.post<RoutingsResponse>("/routing/aggregate", request!),
    enabled: !!request,
    staleTime: Infinity,
  });
}

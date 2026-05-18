import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { DendogramRequest } from "@/types/request";
import type { DendogramResponse } from "@/types/response";

export function useDendogram(requests: DendogramRequest | null) {
  return useQuery({
    queryKey: ["dendogram", requests],
    queryFn: () => apiClient.post<DendogramResponse>("/dendogram", requests!),
    enabled: !!requests,
    staleTime: Infinity,
  });
}

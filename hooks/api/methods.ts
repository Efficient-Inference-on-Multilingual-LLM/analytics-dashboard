import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { MethodResponse } from "@/types/response";

export function useMethods() {
  return useQuery({
    queryKey: ["methods"],
    queryFn: () => apiClient.get<MethodResponse>("/methods"),
    staleTime: Infinity,
  });
}

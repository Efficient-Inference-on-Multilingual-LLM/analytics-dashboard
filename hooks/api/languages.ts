import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { LanguageResponse } from "@/types/response";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => apiClient.get<LanguageResponse>("/languages"),
    staleTime: Infinity,
  });
}

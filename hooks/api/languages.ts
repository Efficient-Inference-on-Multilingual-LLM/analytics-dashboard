import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { LanguageResponse } from "@/types/response";
import type { LanguageResultRequest } from "@/types/request";
import { useMemo } from "react";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => apiClient.get<LanguageResponse>("/languages"),
    staleTime: Infinity,
  });
}

export function useTaxonomy() {
  return useQuery({
    queryKey: ["taxonomy"],
    queryFn: () => apiClient.get<LanguageResponse>("/languages/taxonomy"),
    staleTime: Infinity,
  });
}

export function useResultLanguages(request: LanguageResultRequest | null) {
  return useQuery({
    queryKey: ["result-languages", request],
    queryFn: () =>
      apiClient.post<LanguageResponse>("/languages/results", request!),
    enabled: !!request,
    staleTime: Infinity,
  });
}

export function useLanguageRegistry() {
  const { data } = useLanguages();

  const languageRegitry = useMemo(() => {
    if (!data) return new Map<string, string>();
    const map = new Map<string, string>();
    data.languages.forEach((lang) => {
      map.set(lang.code, lang.name);
    });
    return map;
  }, [data]);

  return languageRegitry;
}

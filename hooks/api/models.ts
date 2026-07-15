import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { ModelResponse, ComponentResponse } from "@/types/response";

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => apiClient.get<ModelResponse>("/models"),
    staleTime: Infinity,
  });
}

export function useComponents() {
  return useQuery({
    queryKey: ["components"],
    queryFn: () => apiClient.get<ComponentResponse>("/components"),
    staleTime: Infinity,
  });
}

export function useModelsRouter() {
  return useQuery({
    queryKey: ["models-router"],
    queryFn: () => apiClient.get<ModelResponse>("/routing/models"),
    staleTime: Infinity,
  });
}

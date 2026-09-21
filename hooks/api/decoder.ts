import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { DecoderRequest } from "@/types/request";
import type {
  DecoderResponse,
  SentenceDecoderResponse,
} from "@/types/response";

export function useDecoderSentences(
  lens: string | null,
  modelId: string | null,
  langCode: string | null,
) {
  const request =
    modelId && langCode
      ? {
          lens: lens,
          model_id: modelId,
          lang_code: langCode,
        }
      : null;

  return useQuery({
    queryKey: ["decoder-sentences", request],
    queryFn: () =>
      apiClient.get<SentenceDecoderResponse>(
        `/decode/${lens}/${modelId?.replace("/", "__")}/${langCode}/sentences`,
      ),
    enabled: !!request,
    staleTime: Infinity,
  });
}

export function useDecoder(request: DecoderRequest | null) {
  return useQuery({
    queryKey: ["decoder", request],
    queryFn: () => apiClient.post<DecoderResponse>(`/decode/example`, request!),
    enabled: !!request,
    staleTime: Infinity,
  });
}

export function useDecoderLanguage() {
  return useQuery({
    queryKey: ["decoder-language"],
    queryFn: () => apiClient.get<DecoderResponse>(`/decode/languages`),
    staleTime: Infinity,
  });
}

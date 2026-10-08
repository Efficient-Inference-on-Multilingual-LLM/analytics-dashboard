import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api/client";
import { APIError } from "@/lib/error-handler/api-error";
import type {
  LexiconQueueRequest,
  LexiconSaveRequest,
} from "@/types/request";
import type {
  LexiconEntryResponse,
  LexiconHistoryResponse,
  LexiconMeResponse,
  LexiconQueueResponse,
  LexiconSnapshotResponse,
  LexiconSnapshotsResponse,
} from "@/types/response";
import type { LexiconEntryStateDto } from "@/types/dto";

/** The signed-in user's Google ID token (sent as Bearer to the backend), or null. */
export function useLexiconToken() {
  const { data: session, status } = useSession();
  return {
    token: session?.idToken ?? null,
    email: session?.user?.email ?? null,
    expired: session?.error === "RefreshTokenError",
    loading: status === "loading",
  };
}

/** Who the backend thinks you are, and whether you may edit. */
export function useLexiconMe() {
  const { token, loading } = useLexiconToken();

  return useQuery({
    queryKey: ["lexicon-me", token],
    queryFn: () => apiClient.get<LexiconMeResponse>("/lexicon/me", token),
    enabled: !loading,
    staleTime: 5 * 60 * 1000,
  });
}

/** One page of the curation queue. Live data: refetched after every save. */
export function useLexiconQueue(request: LexiconQueueRequest | null) {
  return useQuery({
    queryKey: ["lexicon-queue", request],
    queryFn: () => {
      const params = new URLSearchParams({
        status: request!.status,
        offset: String(request!.offset),
        limit: String(request!.limit),
      });
      if (request!.q) params.set("q", request!.q);
      return apiClient.get<LexiconQueueResponse>(`/lexicon/queue?${params}`);
    },
    enabled: !!request,
    placeholderData: keepPreviousData, // keep the old page visible while paging
    staleTime: 30 * 1000,
  });
}

/** Full edit history of one token, newest first. */
export function useLexiconHistory(token: string | null) {
  return useQuery({
    queryKey: ["lexicon-history", token],
    queryFn: () =>
      apiClient.get<LexiconHistoryResponse>(
        `/lexicon/history?${new URLSearchParams({ token: token! })}`,
      ),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

/** Save a token's labels. Rejects with a 409 APIError if someone saved it first;
 *  use getLexiconConflict(error) to read what they saved. */
export function useSaveLexiconEntry() {
  const { token } = useLexiconToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LexiconSaveRequest) =>
      apiClient.put<LexiconEntryResponse>("/lexicon/entry", request, token),
    onSettled: (_data, _error, request) => {
      // success or conflict: either way the server state moved, so refetch
      queryClient.invalidateQueries({ queryKey: ["lexicon-queue"] });
      queryClient.invalidateQueries({
        queryKey: ["lexicon-history", request.token],
      });
    },
  });
}

export function useLexiconSnapshots() {
  return useQuery({
    queryKey: ["lexicon-snapshots"],
    queryFn: () =>
      apiClient.get<LexiconSnapshotsResponse>("/lexicon/snapshots"),
    staleTime: 30 * 1000,
  });
}

/** Freeze the current labels into gs://<bucket>/lexicon/snapshots/. Editors only. */
export function useCreateLexiconSnapshot() {
  const { token } = useLexiconToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient.post<LexiconSnapshotResponse>("/lexicon/snapshots", {}, token),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["lexicon-snapshots"] }),
  });
}

// ---- error helpers ----------------------------------------------------------

/** For a 409 from useSaveLexiconEntry: the entry someone else saved (null if they
 *  removed it). Returns undefined if the error isn't a conflict. */
export function getLexiconConflict(
  error: unknown,
): LexiconEntryStateDto | null | undefined {
  if (!(error instanceof APIError) || error.status !== 409) return undefined;
  const body = error.details as
    | { detail?: { current?: LexiconEntryStateDto | null } }
    | undefined;
  return body?.detail?.current ?? null;
}

/** A readable message for any lexicon API error. */
export function lexiconErrorMessage(error: unknown): string {
  if (!(error instanceof APIError)) return String(error);
  const detail = (error.details as { detail?: unknown } | undefined)?.detail;
  if (error.status === 401) return "Please sign in again.";
  if (error.status === 403) return "Your account isn't a lexicon editor.";
  if (error.status === 409) return "Someone else changed this token meanwhile.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return "Invalid request.";
  return `Request failed (${error.status}).`;
}

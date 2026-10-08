"use client";

/**
 * TEMPORARY check for steps 2–3: sign in, then ask the backend (through the
 * lexicon hooks) who it thinks you are. Delete once the real lexicon page exists.
 */
import { signIn, signOut } from "next-auth/react";
import {
  lexiconErrorMessage,
  useLexiconMe,
  useLexiconQueue,
  useLexiconToken,
} from "@/hooks/api/lexicon";

export default function AuthCheck() {
  const { email, expired, loading } = useLexiconToken();
  const me = useLexiconMe();
  const queue = useLexiconQueue({ status: "all", offset: 0, limit: 5 });

  if (loading) return <p>Loading…</p>;

  return (
    <div className="flex flex-col gap-2 text-sm">
      {email ? (
        <>
          <p>Signed in as {email}</p>
          <button
            className="w-fit rounded border px-3 py-1"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          className="w-fit rounded border px-3 py-1"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      )}
      {expired && (
        <p className="text-red-500">Token refresh failed, sign in again.</p>
      )}

      <p>
        /lexicon/me:{" "}
        {me.isLoading
          ? "…"
          : me.isError
            ? lexiconErrorMessage(me.error)
            : JSON.stringify(me.data)}
      </p>
      <p>
        /lexicon/queue:{" "}
        {queue.isLoading
          ? "…"
          : queue.isError
            ? lexiconErrorMessage(queue.error)
            : `${queue.data?.total} tokens, ${queue.data?.coverage.n_curated} curated; first: ${queue.data?.items
                .map((i) => i.token)
                .join(", ")}`}
      </p>
    </div>
  );
}

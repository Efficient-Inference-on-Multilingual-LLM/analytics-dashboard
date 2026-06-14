import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { PageKey } from "./registry";

interface SharePayload {
  p: PageKey;
  s: Record<string, unknown>;
}

export function encodeShareToken(
  page: PageKey,
  state: Record<string, unknown>,
): string {
  const payload: SharePayload = { p: page, s: state };
  return compressToEncodedURIComponent(JSON.stringify(payload));
}

export function decodeShareToken(token: string): SharePayload | null {
  try {
    const json = decompressFromEncodedURIComponent(token);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.error("Failed to decode share token:", e);
  }
  return null;
}

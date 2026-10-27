import { useEffect, useState } from "react";
import { useMusic } from "@/context/MusicContext";
import { customerApi } from "./customerAuth";
export async function libraryRequest(
  path: string,
  session: any,
  method = "GET",
  body?: unknown,
  version?: number,
  key?: string,
) {
  if (method !== "GET" && !session?.activeProfileId)
    throw Error("Sign in and choose your profile first.");
  if (session) {
    if (!session.activeProfileId)
      throw Error("Choose your profile to explore your music library.");
    return customerApi(path, method, body, {
      "X-Profile-Context": session.activeProfileId,
      ...(version !== undefined ? { "If-Match": `"v${version}"` } : {}),
      ...(method === "POST" || method === "DELETE"
        ? { "Idempotency-Key": key ?? crypto.randomUUID() }
        : {}),
    });
  }
  const r = await fetch("/api/v1/catalog" + path);
  const result = await r.json();
  if (!r.ok)
    throw Error(result.message ?? "This music collection is unavailable.");
  return result;
}
export function useLibraryPage(path: string, enabled = true) {
  const music = useMusic();
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    setLoading(true);
    if (!enabled || import.meta.env.VITE_API_MODE !== "connected") {
      setLoading(false);
      return;
    }
    void libraryRequest(path, music.session)
      .then((r) => {
        if (active) setData(r);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, music.audience, revision, enabled]);
  return {
    data,
    error,
    loading,
    session: music.session,
    audience: music.audience,
    reload: () => setRevision((x) => x + 1),
    request: (
      url: string,
      method = "GET",
      body?: unknown,
      version?: number,
      key?: string,
    ) => libraryRequest(url, music.session, method, body, version, key),
  };
}
export function libraryPath(kind: string, id: string, isOwn = false) {
  return (
    "/music/" +
    (kind === "artists" ? "artist" : kind === "albums" ? "album" : "playlist") +
    "/" +
    id +
    (isOwn ? "?own=1" : "")
  );
}

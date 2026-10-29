import { useEffect, useState } from "react";
import { useCustomerSession, customerApi, connectedAuth } from "./customerAuth";
export const discoveryKinds = [
  "podcast",
  "movie",
  "show",
  "episode",
  "music",
  "sports",
  "event",
  "artist",
  "album",
  "playlist",
  "news",
  "lifestyle",
];
export function useDiscovery(query: string, enabled = true) {
  const auth = useCustomerSession(),
    audience =
      auth.session?.activeProfileId ??
      (auth.session ? "choose-profile" : "guest"),
    scope = query + ":" + audience;
  const [state, setState] = useState<any>({
      scope: "",
      data: null,
      loading: connectedAuth,
      error: "",
    }),
    [attempt, setAttempt] = useState(0);
  const profileRequired = !!auth.session && !auth.session.activeProfileId;
  useEffect(() => {
    if (!connectedAuth || !enabled || auth.loading) return;
    let active = true;
    const abort = new AbortController();
    setState({ scope, data: null, loading: true, error: "" });
    if (auth.error || profileRequired) {
      setState({ scope, data: null, loading: false, error: auth.error ?? "" });
      return () => {
        active = false;
        abort.abort();
      };
    }
    const work = auth.session
      ? customerApi("/discovery/search?" + query)
      : fetch("/api/v1/catalog/discovery/search?" + query, {
          signal: abort.signal,
          cache: "no-store",
          credentials: "include",
        }).then(async (r) => {
          const b = await r.json();
          if (!r.ok) throw Error(b.message ?? "Search could not be loaded.");
          return b;
        });
    void work
      .then((data) => {
        if (active) setState({ scope, data, loading: false, error: "" });
      })
      .catch((e) => {
        if (active && e.name !== "AbortError")
          setState({ scope, data: null, loading: false, error: e.message });
      });
    return () => {
      active = false;
      abort.abort();
    };
  }, [scope, attempt, auth.loading, auth.error, enabled]);
  const current =
    state.scope === scope
      ? state
      : { data: null, loading: connectedAuth && enabled, error: "" };
  return {
    ...current,
    profileRequired,
    audience,
    retry: () => setAttempt((x) => x + 1),
  };
}
export function useDiscoveryFacets() {
  const [state, setState] = useState<any>({
      data: null,
      error: "",
      loading: true,
    }),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const abort = new AbortController();
    setState({ data: null, error: "", loading: true });
    void fetch("/api/v1/catalog/discovery/facets", {
      signal: abort.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw Error(b.message ?? "Filters could not be loaded.");
        if (active) setState({ data: b, error: "", loading: false });
      })
      .catch((e) => {
        if (active && e.name !== "AbortError")
          setState({ data: null, error: e.message, loading: false });
      });
    return () => {
      active = false;
      abort.abort();
    };
  }, [attempt]);
  return { ...state, retry: () => setAttempt((x) => x + 1) };
}

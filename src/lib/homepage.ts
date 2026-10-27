import { releaseHomeStartup, waitForHomeStartup } from "./homeStartup";
import { useEffect, useState } from "react";
import { useCustomerSession, customerApi, connectedAuth } from "./customerAuth";
import { movieItem } from "@/context/MovieContext";
import { seriesItem } from "@/context/ShowsContext";
import { musicItem } from "@/context/MusicContext";
import { sportsItem } from "@/context/SportsContext";
import { eventItem } from "@/context/EventsContext";
import { newsItem } from "./news";
import { lifestyleItem } from "./lifestyle";
import type { CatalogItem } from "@/data/mockContent";
export type HomepageEntry = { kind: string; id: string; content: any };
export function homepageItem(r: HomepageEntry): CatalogItem {
  switch (r.kind) {
    case "movie":
      return movieItem(r.content);
    case "show":
    case "episode":
      return seriesItem(r.content);
    case "music":
      return musicItem(r.content);
    case "sports":
      return sportsItem(r.content);
    case "event":
      return eventItem(r.content);
    case "news":
      return newsItem(r.content);
    case "lifestyle":
      return lifestyleItem(r.content);
    default:
      return {
        id: r.id,
        type: "artist",
        source: "api",
        title: r.content.title,
        description: r.content.description,
        genre: r.content.genre,
        thumbnail: r.content.coverUrl,
        landscapeThumbnail: r.content.coverUrl,
      };
  }
}
export function useHomepage(surface: string) {
  const auth = useCustomerSession(),
    audience =
      auth.session?.activeProfileId ??
      (auth.session ? "choose-profile" : "guest"),
    scope = surface + ":" + audience;
  const [state, setState] = useState<{
      scope: string;
      data: any;
      error: string;
      loading: boolean;
    }>({ scope: "", data: null, error: "", loading: true }),
    [revision, setRevision] = useState(0);
  const [featured, setFeatured] = useState<{ scope: string; data: any }>({
    scope: "",
    data: null,
  });
  const profileRequired = !!auth.session && !auth.session.activeProfileId;
  useEffect(() => {
    if (!connectedAuth || auth.loading) return;
    const abort = new AbortController();
    let active = true;
    setState({ scope, data: null, error: "", loading: true });
    setFeatured({ scope, data: null });
    if (auth.error || profileRequired) {
      if (surface === "home") releaseHomeStartup();
      setState({ scope, data: null, error: auth.error ?? "", loading: false });
      return () => {
        active = false;
        abort.abort();
      };
    }
    // The home hero must not wait for every below-the-fold editorial rail.
    // Use the same audience endpoint; never substitute guest picks for a profile.
    if (surface === "home") {
      const early = auth.session
        ? customerApi("/homepage/home/featured")
        : fetch("/api/v1/catalog/homepage/home/featured", {
            credentials: "include",
            cache: "no-store",
            signal: abort.signal,
          }).then(async (response) => {
            if (!response.ok)
              throw Error("Featured content could not be loaded.");
            return response.json();
          });
      void early
        .then((data) => {
          if (active) {
            setFeatured({ scope, data });
            if (!data.hero?.length) releaseHomeStartup();
          }
        })
        .catch(() => {
          if (active) releaseHomeStartup();
          /* The full response remains the authoritative fallback. */
        });
    }
    const work = (async () => {
      if (surface === "home" && !(await waitForHomeStartup(abort.signal)))
        return null;
      if (!active) return null;
      return auth.session
        ? customerApi("/homepage/" + surface + (surface === "home" ? "/structure" : ""))
        : fetch("/api/v1/catalog/homepage/" + surface + (surface === "home" ? "/structure" : ""), {
            credentials: "include",
            cache: "no-store",
            signal: abort.signal,
          }).then(async (r) => {
            const b = await r.json();
            if (!r.ok)
              throw Error(b.message ?? "Featured content could not be loaded.");
            return b;
          });
    })();
    void work
      .then((data) => {
        if (active && data)
          setState({ scope, data, error: "", loading: false });
      })
      .catch((e) => {
        if (active && e.name !== "AbortError")
          setState({ scope, data: null, error: e.message, loading: false });
      });
    return () => {
      active = false;
      abort.abort();
    };
  }, [scope, auth.loading, auth.error, revision]);
  const current =
    state.scope === scope
      ? state
      : { data: null, error: "", loading: connectedAuth };
  return {
    ...current,
    surface,
    profileRequired,
    retry: () => setRevision((x) => x + 1),
    hero: (current.data?.hero ??
      (featured.scope === scope ? featured.data?.hero : null) ??
      []) as HomepageEntry[],
  };
}

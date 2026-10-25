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
  const profileRequired = !!auth.session && !auth.session.activeProfileId;
  useEffect(() => {
    if (!connectedAuth || auth.loading) return;
    const abort = new AbortController();
    let active = true;
    setState({ scope, data: null, error: "", loading: true });
    if (auth.error || profileRequired) {
      setState({ scope, data: null, error: auth.error ?? "", loading: false });
      return () => {
        active = false;
        abort.abort();
      };
    }
    const work = auth.session
      ? customerApi("/homepage/" + surface)
      : fetch("/api/v1/catalog/homepage/" + surface, {
          credentials: "include",
          cache: "no-store",
          signal: abort.signal,
        }).then(async (r) => {
          const b = await r.json();
          if (!r.ok)
            throw Error(b.message ?? "Featured content could not be loaded.");
          return b;
        });
    void work
      .then((data) => {
        if (active) setState({ scope, data, error: "", loading: false });
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
    hero: (current.data?.hero ?? []) as HomepageEntry[],
  };
}

import { useCatalogDemand } from "@/hooks/useCatalogDemand";
import { useHomeStartupReady } from "@/lib/homeStartup";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  customerApi,
  useCustomerSession,
  connectedAuth,
} from "@/lib/customerAuth";
import type { CatalogItem } from "@/data/mockContent";
export type ApiEvent = {
  originalLabel?:string|null;
  id: string;
  title: string;
  description: string;
  format: "in_person" | "online" | "hybrid";
  venue: string;
  onlineUrl: string;
  registrationUrl: string;
  timezone: string;
  startsAt: string;
  endsAt: string;
  performers: string[];
  classification: string;
  accessTier: "free" | "premium";
  eligibleTierIds: string[];
  lifecycle: string;
  broadcast: string;
  previousStart: string | null;
  statusReason: string | null;
  artwork: { portraitUrl: string; landscapeUrl: string };
  featureUrl?:string|null;
  previewAvailable: boolean;
  replayAvailable: boolean;
  liveAvailable: false;
  interest?: { interested: boolean; version: number };
};
export const eventItem = (e: ApiEvent): CatalogItem => ({
  id: e.id,
  type: "event",
  source: "api",
  featureUrl:e.featureUrl,
  title: e.title,
  thumbnail: e.artwork.landscapeUrl,
  landscapeThumbnail: e.artwork.landscapeUrl,
  description: e.description,
  genre: e.format.replace(/_/g, " "),
  classification: e.classification,
  badge: e.accessTier === "premium" ? "premium" : "free",
});
export function eventTime(e: ApiEvent) {
  return new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: e.timezone,
  }).format(new Date(e.startsAt));
}
function useEventsValue() {
  const startupReady = useHomeStartupReady();
  const demand=useCatalogDemand("events");
  const {
    session,
    loading: authLoading,
    error: authError,
  } = useCustomerSession();
  const audience =
    session?.activeProfileId ?? (session ? "choose-profile" : "guest");
  const [items, setItems] = useState<ApiEvent[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(connectedAuth),
    [revision, setRevision] = useState(0);
  const profileRequired = !!session && !session.activeProfileId;
  const request = useCallback(
    async (path: string) => {
      if (authError) throw Error(authError);
      if (profileRequired)
        throw Error("Choose your profile to explore events.");
      if (session) return customerApi("/events" + path);
      const r = await fetch("/api/v1/catalog/events" + path);
      const b = await r.json().catch(() => {
        throw Error("MGTV could not be reached. Try again in a moment.");
      });
      if (!r.ok) throw Error(b.message ?? "Events could not be loaded.");
      return b;
    },
    [audience, authError, session],
  );
  useEffect(() => {
    if (!connectedAuth || authLoading || !startupReady) return;
    if(demand!=="full"){setItems([]);setError("");setBusy(false);return;}
    let active = true;
    setItems([]);
    setError("");
    setBusy(true);
    if (profileRequired) {
      setBusy(false);
      return;
    }
    void (async () => {
      let next = "?limit=100";
      const found: ApiEvent[] = [];
      do {
        const page = await request(next);
        found.push(...page.items);
        next = page.nextCursor
          ? "?limit=100&cursor=" + encodeURIComponent(page.nextCursor)
          : "";
      } while (next);
      if (active) setItems(found);
    })()
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [request, revision, authLoading, startupReady, demand]);
  return {
    items,
    error: error || authError,
    busy: busy || authLoading,
    session,
    profileRequired,
    audience,
    request,
    refresh: () => setRevision((x) => x + 1),
  };
}
const EventsContext = createContext<ReturnType<typeof useEventsValue> | null>(
  null,
);
export function EventsProvider({ children }: { children: ReactNode }) {
  return (
    <EventsContext.Provider value={useEventsValue()}>
      {children}
    </EventsContext.Provider>
  );
}
export function useEvents() {
  const c = useContext(EventsContext);
  if (!c) throw Error("EventsProvider is required");
  return c;
}

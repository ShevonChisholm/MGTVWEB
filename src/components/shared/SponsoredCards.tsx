import { useHomeStartupReady } from "@/lib/homeStartup";
import { useEffect, useState } from "react";
import {
  customerApi,
  useCustomerSession,
  connectedAuth,
} from "@/lib/customerAuth";
export function SponsoredCards({
  kind,
  targetId,
}: {
  kind: string;
  targetId: string;
}) {
  const startupReady = useHomeStartupReady();
  const { session, loading } = useCustomerSession(),
    [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    setItems([]);
    if (!connectedAuth || loading || !startupReady) return;
    const query = "?" + new URLSearchParams({ kind, targetId });
    const work = session
      ? customerApi("/advertising/cards" + query)
      : fetch("/api/v1/catalog/advertising/cards" + query).then(async (r) => {
          if (!r.ok) throw Error();
          return r.json();
        });
    void work
      .then((r) => {
        if (active) setItems(r.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [kind, targetId, session?.activeProfileId, !!session, loading, startupReady]);
  if (!connectedAuth || !items.length) return null;
  return (
    <section
      aria-label="Sponsored"
      className="mx-auto my-8 max-w-[1760px] px-6 md:px-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.destinationUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group flex min-w-0 overflow-hidden rounded-xl border border-border bg-bg-surface"
          >
            <img
              src={item.imageUrl}
              alt=""
              className="aspect-video w-2/5 object-cover"
            />
            <div className="min-w-0 p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Sponsored
              </span>
              <p className="mt-2 break-words font-display text-xl text-text-primary">
                {item.headline}
              </p>
              <span className="mt-3 inline-block text-xs text-text-secondary">
                Discover more ↗
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import { useSports } from "@/context/SportsContext";
import type { ContentItem } from "@/data/mockContent";
// Preserve the prototype landscape Sports card with profile-owned server state.
export function ApiSportsCard({
  item,
  fluid = false,
  continuing = false,
}: {
  item: ContentItem;
  fluid?: boolean;
  continuing?: boolean;
}) {
  const sports = useSports(),
    coverage = { id: item.id, preference: item.sportsPreference };
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const saved = coverage ? sports.preference(coverage).saved : false;
  return (
    <article
      data-content-id={item.id}
      data-content-type="sports"
      className={`group flex flex-1 shrink-0 flex-col min-w-0 ${fluid ? "w-full" : continuing ? "w-64 md:w-72" : "w-64 md:w-72"}`}
    >
      <Link
        to={`/sports/${item.id}`}
        aria-label={`Open ${item.title}`}
        className={`relative block overflow-hidden bg-bg-elevated rounded-xl ${continuing ? "aspect-video" : "aspect-video"}`}
      >
        <img
          src={continuing ? item.landscapeThumbnail : item.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base/70 via-transparent to-transparent" />
        {item.badge && (
          <Badge variant={item.badge} className="absolute left-2 top-2" />
        )}
      </Link>
      {continuing && (
        <progress
          className="media-progress mt-2"
          max={100}
          value={item.progress ?? 0}
          aria-label={`${item.title}: ${Math.round(item.progress ?? 0)}% watched`}
        />
      )}
      <div className="flex flex-1 flex-col gap-2 pt-3">
        <Link
          to={`/sports/${item.id}`}
          className="text-sm font-semibold leading-snug text-text-primary hover:text-gold"
        >
          {item.title}
        </Link>
        <div className="space-y-1 text-xs text-text-secondary">
          <Text>
            {item.year} · {item.duration}
          </Text>
          <Text>
            {item.classification} · {item.genre}
          </Text>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <Link
            to={continuing ? `/sports/${item.id}/watch` : `/sports/${item.id}`}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            {continuing ? "Resume" : "View replay"}{" "}
            <span aria-hidden="true">›</span>
          </Link>
          {sports.session && coverage ? (
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 px-2"
              disabled={busy}
              aria-pressed={saved}
              aria-label={`${saved ? "Remove" : "Save"} ${item.title} ${saved ? "from" : "to"} My List`}
              onClick={() => {
                setBusy(true);
                setError("");
                void sports
                  .save(coverage, { saved: !saved })
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            >
              {saved ? "✓ Saved" : "+ Save"}
            </Button>
          ) : (
            <Link
              to={sports.session ? "/profiles" : "/auth/sign-in"}
              className="inline-flex min-h-11 items-center px-2 text-xs text-text-secondary"
              aria-label={`Sign in to save ${item.title}`}
            >
              + Save
            </Link>
          )}
        </div>
        {error && (
          <p role="alert" className="text-xs text-rose-300">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

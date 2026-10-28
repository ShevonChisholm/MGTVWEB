import { EngagementIcon } from "@/components/shared/EngagementIcon";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import SportsArtwork from "@/components/sports/SportsArtwork";
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
      className={`group sports-card ${fluid ? "w-full" : "w-64 md:w-72"}`}
    >
      <Link
        to={`/sports/${item.id}`}
        aria-label={`Open ${item.title}`}
        className="relative block overflow-hidden bg-bg-elevated aspect-video sports-card__art"
      >
        <SportsArtwork
          key={item.landscapeThumbnail ?? item.thumbnail}
          src={item.landscapeThumbnail ?? item.thumbnail}
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
      <div className="sports-card__body">
        <p className="sports-card__format">
          {item.sport ?? item.genre ?? "MGTV Sports"}{" "}
          <span aria-hidden="true">/</span>{" "}
          {item.sportsCoverage === "highlight"
            ? "Highlights"
            : item.sportsCoverage === "replay"
              ? "Full replay"
              : "Archive"}
        </p>
        <Link to={`/sports/${item.id}`} className="sports-card__title">
          {item.title}
        </Link>
        <div className="sports-card__meta">
          <p title={item.competition}>{item.competition ?? item.genre}</p>
          <p>
            {item.duration} · {item.classification}
            {item.year ? ` · ${item.year}` : ""}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <Link
            to={continuing ? `/sports/${item.id}/watch` : `/sports/${item.id}`}
            className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-gold hover:text-gold-light"
          >
            {continuing
              ? "Resume"
              : item.sportsCoverage === "highlight"
                ? "View highlights"
                : "View replay"}{" "}
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
              <EngagementIcon name="save" active={saved}/>
            </Button>
          ) : (
            <Link
              to={sports.session ? "/profiles" : "/auth/sign-in"}
              className="inline-flex min-h-11 items-center px-2 text-xs text-text-secondary"
              aria-label={`Sign in to save ${item.title}`}
            >
              <EngagementIcon name="save"/>
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

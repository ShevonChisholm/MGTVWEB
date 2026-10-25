import { useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { ContentRail } from "@/components/home/ContentRail";
import { ContentUnavailable } from "@/components/shared/ContentUnavailable";
import { Text } from "@/components/ui/Text";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  catalogById,
  allShowDetails,
  episodes,
  contentPath,
} from "@/data/mockContent";
import { usePlayback, mediaFor } from "@/context/MediaPlaybackContext";
import { useAppState } from "@/context/AppStateContext";
import { useCatalog } from "@/hooks/useCatalog";
import { useViewing } from "@/hooks/useViewing";
import { MovieWatchPage } from "./MovieWatchPage";

export function WatchPage() {
  return import.meta.env.VITE_API_MODE === "connected" ? (
    <MovieWatchPage />
  ) : (
    <PrototypeWatchPage />
  );
}
function PrototypeWatchPage() {
  const app = useAppState();
  const { watchPath } = useViewing();
  const { popularMovies, sportsHighlights } = useCatalog();
  const { id } = useParams();
  const navigate = useNavigate();
  const [guestAutoplay, setGuestAutoplay] = useState(true);
  const autoplay = app.profile?.preferences.autoplay ?? guestAutoplay;
  const setAutoplay = (change: (value: boolean) => boolean) =>
    app.profile
      ? app.execute({
          type: "preferences",
          preferences: {
            ...app.profile.preferences,
            autoplay: change(autoplay),
          },
        })
      : setGuestAutoplay(change);
  const { dispatch } = usePlayback();
  const item = id ? catalogById[id] : undefined;
  if (!item) return <ContentUnavailable kind="Video" />;
  if (item.type === "show") return <Navigate to={watchPath(item)!} replace />;
  if (item.type === "musicVideo")
    return <Navigate to={contentPath(item)} replace />;
  if (!["episode", "movie", "sports"].includes(item.type))
    return <ContentUnavailable kind="Video" />;
  const show = item.showId ? allShowDetails[item.showId] : undefined;
  const allEpisodes = episodes
    .filter(
      (ep) => ep.showId === item.showId && !!item.showId && app.allowed(ep),
    )
    .sort(
      (a, b) =>
        a.seasonNumber! - b.seasonNumber! ||
        a.episodeNumber! - b.episodeNumber!,
    );
  const index = allEpisodes.findIndex((ep) => ep.id === item.id);
  const next = index >= 0 ? allEpisodes[index + 1] : undefined;
  const title = show
    ? `${show.title} — S${item.seasonNumber} E${item.episodeNumber}: ${item.title}`
    : item.title;
  const related = item.type === "sports" ? sportsHighlights : popularMovies;
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-[1760px] px-4 py-6 md:px-8">
        <ButtonLink
          to={show ? `/shows/${show.id}` : contentPath(item)}
          variant="ghost"
          className="mb-5"
        >
          Back to {show ? "series" : "details"}
        </ButtonLink>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <VideoPlayer
              key={item.id}
              mediaId={item.id}
              title={title}
              thumbnail={item.thumbnail}
              onEnded={() => {
                if (autoplay && next) {
                  dispatch({ type: "prepareVideo", media: mediaFor(next.id) });
                  dispatch({ type: "play", owner: "video" });
                  navigate(watchPath(next)!);
                }
              }}
            />
            <Text
              as="h1"
              className="mt-6 font-display text-3xl text-text-primary"
            >
              {title}
            </Text>
            <Text className="mt-3 text-sm text-text-secondary">
              {item.duration}{" "}
              {item.classification ? `· ${item.classification}` : ""}
            </Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              {item.description}
            </Text>
            {next && (
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-bg-surface p-4">
                <Button
                  variant="ghost"
                  aria-pressed={autoplay}
                  onClick={() => setAutoplay((value) => !value)}
                >
                  Auto-play next: {autoplay ? "On" : "Off"}
                </Button>
                <ButtonLink to={watchPath(next)!} variant="outline">
                  Next: E{next.episodeNumber} · {next.title}
                </ButtonLink>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Text as="h2" className="mb-4 font-display text-2xl">
              {show ? "Episodes" : "More to Watch"}
            </Text>
            <div className="space-y-3">
              {(show
                ? allEpisodes
                : related.filter((other) => other.id !== item.id).slice(0, 5)
              ).map((other) => (
                <Link
                  key={other.id}
                  to={watchPath(other)!}
                  aria-current={other.id === item.id ? "page" : undefined}
                  className={`flex gap-3 rounded-xl p-3 ${
                    other.id === item.id
                      ? "bg-gold-dim"
                      : "bg-bg-surface hover:bg-bg-elevated"
                  }`}
                >
                  <img
                    src={other.thumbnail}
                    alt=""
                    className="aspect-video w-24 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <Text className="text-sm font-semibold">
                      {other.type === "episode"
                        ? `S${other.seasonNumber} E${other.episodeNumber} · `
                        : ""}
                      {other.title}
                    </Text>
                    <Text className="mt-1 text-xs text-text-secondary">
                      {other.duration}
                    </Text>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <ContentRail
          title="More to Discover"
          items={related.filter((other) => other.id !== item.id)}
          seeAllHref={item.type === "sports" ? "/sports" : "/movies"}
          seeAllLabel={item.type === "sports" ? "All sports" : "All movies"}
        />
      </div>
    </main>
  );
}

import {SponsorStrip} from "@/components/shared/SponsorStrip";
import { useLocation } from "react-router";
import { ReportContent } from "@/components/moderation/ReportContent";
import { AdaptiveVideo } from "@/components/player/AdaptiveVideo";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { customerApi } from "@/lib/customerAuth";
import { useShows, seriesItem, type ApiSeries } from "@/context/ShowsContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ContentRail } from "@/components/home/ContentRail";
export function EpisodeWatchPage() {
  const location = useLocation();
  const returnTo = encodeURIComponent(location.pathname + location.search);
  const { id } = useParams(),
    [params] = useSearchParams(),
    movies = useShows();
  const preview = params.get("preview") === "1";
  const navigate = useNavigate();
  const [movie, setMovie] = useState<ApiSeries | null>(null),
    [source, setSource] = useState(""),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [loading, setLoading] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const [playback, setPlayback] = useState<any>(null),
    [progressNotice, setProgressNotice] = useState("");
  const progressState = useRef<any>(null);
  function persist(seconds: number, force = false) {
    const state = progressState.current;
    if (!state || preview || !movies.session || !Number.isFinite(seconds))
      return;
    if (!force && Math.abs(seconds - state.lastSeconds) < 10) return;
    state.pending = seconds;
    if (state.saving) return state.work;
    state.saving = true;
    state.work = (async () => {
      try {
        while (state.pending !== null && progressState.current === state) {
          const position = state.pending;
          state.pending = null;
          const saved = await customerApi(
            "/episodes/" + id + "/progress",
            "PUT",
            { mediaVersionId: state.mediaVersionId, seconds: position },
            {
              "If-Match": `"v${state.version}"`,
              "X-Profile-Context": state.profileId,
            },
          );
          state.version = saved.version;
          state.lastSeconds = position;
          if (progressState.current === state) {
            setProgressNotice("Progress saved.");
            if (movie) movies.recordProgress(movie, saved, state.profileId);
          }
        }
      } catch (e) {
        if (progressState.current === state)
          setProgressNotice(
            e instanceof Error ? e.message : "Progress could not be saved.",
          );
      } finally {
        state.saving = false;
      }
    })();
    return state.work;
  }

  useEffect(() => {
    let active = true;
    setSource("");
    setMovie(null);
    setError("");
    setLoading(true);
    setPlayback(null);
    setProgressNotice("");
    progressState.current = null;
    const work = async () => {
      if (!id) throw Error("Episode not found.");
      if (preview) {
        const response = await fetch(
          "/api/v1/catalog/episodes/" + encodeURIComponent(id),
        );
        const body = await response.json();
        if (!response.ok) throw Error(body.message);
        if (!body.previewAvailable)
          throw Error("No preview is available for this episode.");
        if (active) {
          setMovie(body);
          setSource("/api/v1/catalog/episodes/" + id + "/preview");
        }
      } else {
        if (!movies.session)
          throw Error(
            "Sign in with a customer account to watch the full episode.",
          );
        if (movies.profileRequired)
          throw Error("Choose who’s watching before starting this episode.");
        const [detail, playback] = await Promise.all([
          movies.requestEpisode(id),
          customerApi("/episodes/" + encodeURIComponent(id) + "/playback"),
        ]);
        if (active) {
          setMovie(detail);
          setPlayback(playback);
          progressState.current = {
            mediaVersionId: playback.mediaVersionId,
            version: playback.progress.version,
            profileId: movies.session.activeProfileId,
            lastSeconds: playback.progress.seconds,
            pending: null,
            saving: false,
          };
          setSource(playback.url);
        }
      }
    };
    if (!movies.busy)
      void work()
        .catch((e) => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
      progressState.current = null;
      video.current?.pause();
    };
  }, [id, preview, movies.audience, movies.busy, revision]);
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-[1760px] px-6 pb-12 md:px-8">
        <ButtonLink
          to={movie ? `/shows/${movie.showId}` : "/shows"}
          variant="ghost"
          className="mb-5"
        >
          Back to details
        </ButtonLink>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <div className="overflow-hidden rounded-xl bg-bg-surface">
              <div className="relative aspect-video bg-bg-base">
                {source ? (
                  <AdaptiveVideo
                    src={source}
                    ref={video}
                    key={source + revision + movies.audience}
                    autoPlay={
                      !preview &&
                      params.get("autoplay") === "1" &&
                      playback?.autoplay === true
                    }
                    controls
                    playsInline
                    preload="metadata"
                    poster={movie?.artwork.landscapeUrl}
                    onLoadedMetadata={() => {
                      if (
                        video.current &&
                        playback &&
                        !playback.progress.completed &&
                        playback.progress.seconds > 0
                      )
                        video.current.currentTime = Math.min(
                          playback.progress.seconds,
                          video.current.duration || 0,
                        );
                    }}
                    onTimeUpdate={() => {
                      if (video.current) persist(video.current.currentTime);
                    }}
                    onPause={() => {
                      if (video.current)
                        persist(video.current.currentTime, true);
                    }}
                    onEnded={() => {
                      if (video.current)
                        void Promise.resolve(
                          persist(video.current.duration, true),
                        ).finally(() => {
                          if (
                            !preview &&
                            playback?.autoplay &&
                            movie?.nextEpisode
                          )
                            navigate(
                              `/watch/episodes/${movie.nextEpisode.id}?autoplay=1`,
                            );
                        });
                    }}
                    onSeeked={() => {
                      if (video.current)
                        persist(video.current.currentTime, true);
                    }}
                    aria-label={`${preview ? "Preview: " : ""}${movie?.title}`}
                    className="h-full w-full"
                    onError={() => {
                      setError(
                        "The video could not be loaded. It may have become unavailable. Reload to check access and try again.",
                      );
                      setSource("");
                    }}
                  ></AdaptiveVideo>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <p role={error ? "alert" : "status"}>
                      {loading ? "Checking episode access…" : error}
                    </p>
                  </div>
                )}
              </div>
              {error && (
                <div className="flex flex-wrap gap-3 p-4">
                  <Button onClick={() => setRevision((x) => x + 1)}>
                    Try again
                  </Button>
                  {!movies.session && (
                    <ButtonLink
                      to={"/auth/sign-in?returnTo=" + returnTo}
                      variant="outline"
                    >
                      Sign in
                    </ButtonLink>
                  )}
                  {movies.profileRequired && (
                    <ButtonLink
                      to={"/profiles?returnTo=" + returnTo}
                      variant="outline"
                    >
                      Choose profile
                    </ButtonLink>
                  )}
                  <ButtonLink to="/account" variant="ghost">
                    Account & subscriptions
                  </ButtonLink>
                </div>
              )}
            </div>
            <p role="status" className="mt-3 text-xs text-text-secondary">
              {progressNotice}
            </p>
            {movie && (
              <div className="mt-5 flex flex-wrap gap-3">
                {movie.previousEpisode && (
                  <ButtonLink
                    variant="outline"
                    to={`/watch/episodes/${movie.previousEpisode.id}`}
                  >
                    Previous episode
                  </ButtonLink>
                )}
                {movie.nextEpisode && (
                  <ButtonLink
                    variant="outline"
                    to={`/watch/episodes/${movie.nextEpisode.id}`}
                  >
                    Next episode · {movie.nextEpisode.title}
                  </ButtonLink>
                )}
              </div>
            )}
            <Text as="h1" className="mt-6 font-display text-3xl">
              {movie ? movie.title : "Episode playback"}
              {preview ? " · Preview" : ""}
            </Text>
            <Text className="mt-3 text-sm text-text-secondary">
              {movie
                ? `${movie.classification} · ${preview ? "Free preview" : Math.max(1, Math.ceil(movie.durationSeconds / 60)) + " min"}`
                : ""}
            </Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              {movie?.synopsis}
            </Text>
            {movie && <ReportContent kind="episode" contentId={movie.id} />}
            {movie?.showId&&<SponsorStrip key={movie.showId} kind="shows" id={movie.showId} compact context="This series"/>}
          </div>
          <aside className="min-w-0">
            <ContentRail
              title="More to Watch"
              layout="contained"
              items={movies.items.map(seriesItem)}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

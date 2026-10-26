import { PlaybackAccess } from "@/components/player/PlaybackAccess";
import { PlayerRecommendations } from "@/components/player/PlayerRecommendations";
import { useLocation } from "react-router";
import { AdaptiveVideo } from "@/components/player/AdaptiveVideo";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { customerApi } from "@/lib/customerAuth";
import { useSports, sportsItem, type ApiSports } from "@/context/SportsContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
export function SportsWatchPage() {
  const location = useLocation();
  const returnTo = encodeURIComponent(location.pathname + location.search);
  const { id } = useParams(),
    [params] = useSearchParams(),
    sports = useSports();
  const preview = params.get("preview") === "1";
  const [coverage, setSports] = useState<ApiSports | null>(null),
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
    if (!state || preview || !sports.session || !Number.isFinite(seconds))
      return;
    if (!force && Math.abs(seconds - state.lastSeconds) < 10) return;
    state.pending = seconds;
    if (state.saving) return;
    state.saving = true;
    void (async () => {
      try {
        while (state.pending !== null && progressState.current === state) {
          const position = state.pending;
          state.pending = null;
          const saved = await customerApi(
            "/sports/" + id + "/progress",
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
            if (coverage)
              sports.recordProgress(coverage, saved, state.profileId);
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
  }

  useEffect(() => {
    let active = true;
    setSource("");
    setSports(null);
    setError("");
    setLoading(true);
    setPlayback(null);
    setProgressNotice("");
    progressState.current = null;
    const work = async () => {
      if (!id) throw Error("Sports not found.");
      if (preview) {
        const response = await fetch(
          "/api/v1/catalog/sports/" + encodeURIComponent(id),
        );
        const body = await response.json();
        if (!response.ok) throw Error(body.message);
        if (!body.previewAvailable)
          throw Error("No preview is available for this sports video.");
        if (active) {
          setSports(body);
          setSource("/api/v1/catalog/sports/" + id + "/preview");
        }
      } else {
        if (!sports.session) {
          const response = await fetch(
            "/api/v1/catalog/sports/" + encodeURIComponent(id),
          );
          if (response.ok) {
            const detail = await response.json();
            if (active) setSports(detail);
          }
          throw Error(
            "Sign in with a customer account to watch the full sports video.",
          );
        }
        if (sports.profileRequired)
          throw Error(
            "Choose who’s watching before starting this sports video.",
          );
        const [detail, playback] = await Promise.all([
          sports.request("/" + encodeURIComponent(id)).then((detail) => {
            if (active) setSports(detail);
            return detail;
          }),
          customerApi("/sports/" + encodeURIComponent(id) + "/playback"),
        ]);
        if (active) {
          setSports(detail);
          setPlayback(playback);
          progressState.current = {
            mediaVersionId: playback.mediaVersionId,
            version: playback.progress.version,
            profileId: sports.session.activeProfileId,
            lastSeconds: playback.progress.seconds,
            pending: null,
            saving: false,
          };
          setSource(playback.url);
        }
      }
    };
    if (!sports.busy)
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
  }, [id, preview, sports.audience, sports.busy, revision]);
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-[1760px] px-6 pb-12 md:px-8">
        <ButtonLink to={`/sports/${id}`} variant="ghost" className="mb-5">
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
                    key={source + revision + sports.audience}
                    controls
                    playsInline
                    preload="metadata"
                    poster={coverage?.artwork.landscapeUrl}
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
                      if (video.current) persist(video.current.duration, true);
                    }}
                    onSeeked={() => {
                      if (video.current)
                        persist(video.current.currentTime, true);
                    }}
                    aria-label={`${preview ? "Preview: " : ""}${coverage?.title}`}
                    className="h-full w-full"
                    onError={() => {
                      setError(
                        "The video could not be loaded. It may have become unavailable. Reload to check access and try again.",
                      );
                      setSource("");
                    }}
                  ></AdaptiveVideo>
                ) : (
                  <PlaybackAccess
                    poster={coverage?.artwork.landscapeUrl}
                    title={coverage?.title}
                    message={error}
                    loading={loading}
                    signedIn={!!sports.session}
                    needsProfile={sports.profileRequired}
                    onRetry={() => setRevision((value) => value + 1)}
                  />
                )}
              </div>
              {error && (
                <div className="flex flex-wrap gap-3 p-4">
                  <Button onClick={() => setRevision((x) => x + 1)}>
                    Try again
                  </Button>
                  {!sports.session && (
                    <ButtonLink
                      to={"/auth/sign-in?returnTo=" + returnTo}
                      variant="outline"
                    >
                      Sign in
                    </ButtonLink>
                  )}
                  {sports.profileRequired && (
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
            <Text as="h1" className="mt-6 font-display text-3xl">
              {coverage ? coverage.title : "Sports playback"}
              {preview ? " · Preview" : ""}
            </Text>
            <Text className="mt-3 text-sm text-text-secondary">
              {coverage
                ? `${coverage.classification} · ${preview ? "Free preview" : Math.max(1, Math.ceil(coverage.durationSeconds / 60)) + " min"}`
                : ""}
            </Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              {coverage?.synopsis}
            </Text>
          </div>
          <aside className="min-w-0">
            <PlayerRecommendations
              title="Keep the stories coming"
              items={sports.items.filter((m) => m.id !== id).map(sportsItem)}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

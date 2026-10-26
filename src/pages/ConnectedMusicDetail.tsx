import {OriginalLabel} from "@/components/shared/OriginalLabel";
import { PlaybackAccess } from "@/components/player/PlaybackAccess";
import { PlayerRecommendations } from "@/components/player/PlayerRecommendations";
import { MusicCollectionCredits } from "@/components/music/MusicCollectionCredits";
import { CollectionVideoNavigation } from "@/components/music/CollectionVideoNavigation";
import { ConnectedPlaylistMenu } from "@/components/music/ConnectedPlaylistMenu";
import { ReportContent } from "@/components/moderation/ReportContent";
import { SponsoredCards } from "@/components/shared/SponsoredCards";
import { AdaptiveVideo } from "@/components/player/AdaptiveVideo";
import { ShareBar } from "@/components/shared/ShareBar";
import { ApiMusicCard } from "@/components/home/ApiMusicCard";
import { useMusicAudio } from "@/context/MusicAudioContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { customerApi } from "@/lib/customerAuth";
import { useMusic, musicItem, type ApiMusic } from "@/context/MusicContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
export function ConnectedMusicDetail() {
  const { id } = useParams(),
    [params] = useSearchParams(),
    library = useMusic();
  const preview = params.get("preview") === "1";
  const audio = useMusicAudio();
  const [music, setMusic] = useState<ApiMusic | null>(null),
    [source, setSource] = useState(""),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [loading, setLoading] = useState(true);
  const video = useRef<HTMLMediaElement>(null);
  const [playback, setPlayback] = useState<any>(null),
    [progressNotice, setProgressNotice] = useState("");
  const progressState = useRef<any>(null);
  function persist(seconds: number, force = false) {
    const state = progressState.current;
    if (!state || preview || !library.session || !Number.isFinite(seconds))
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
            "/music/" +
              (music?.kind === "track" ? "track/" : "video/") +
              id +
              "/progress",
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
            if (music) library.recordProgress(music, saved, state.profileId);
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
    setMusic(null);
    setError("");
    setLoading(true);
    setPlayback(null);
    setProgressNotice("");
    progressState.current = null;
    const work = async () => {
      if (!id) throw Error("Music not found.");
      if (preview) {
        const response = await fetch(
          "/api/v1/catalog/music/" + encodeURIComponent(id),
        );
        const body = await response.json();
        if (!response.ok) throw Error(body.message);
        if (!body.previewAvailable)
          throw Error("No preview is available for this release.");
        if (active) {
          setMusic(body);
          setSource("/api/v1/catalog/music/" + id + "/preview");
        }
      } else {
        const item = await library.request("/" + encodeURIComponent(id));
        if (active) setMusic(item);
        if (item.kind === "track") return;
        if (!library.session)
          throw Error(
            "Sign in with a customer account to watch the full release.",
          );
        if (library.profileRequired)
          throw Error("Choose who’s watching before starting this release.");
        const [detail, playback] = await Promise.all([
          library.request("/" + encodeURIComponent(id)),
          customerApi("/music/" + encodeURIComponent(id) + "/playback"),
        ]);
        if (active) {
          setMusic(detail);
          setPlayback(playback);
          progressState.current = {
            mediaVersionId: playback.mediaVersionId,
            version: playback.progress.version,
            profileId: library.session.activeProfileId,
            lastSeconds: playback.progress.seconds,
            pending: null,
            saving: false,
          };
          setSource(playback.url);
        }
      }
    };
    if (!library.busy)
      void work()
        .catch((e) => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
      if (video.current) persist(video.current.currentTime, true);
      video.current?.pause();
      progressState.current = null;
    };
  }, [id, preview, library.audience, library.busy, revision]);
  if (music?.kind === "track")
    return (
      <main className="min-h-screen bg-bg-base pt-24">
        <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-8">
          <ButtonLink to="/music?view=tracks" variant="ghost" className="mb-8">
            Back to tracks
          </ButtonLink>
          <div className="grid items-center gap-10 md:grid-cols-[1fr_2fr]">
            <img
              src={music.artwork.portraitUrl}
              alt={`${music.title} artwork`}
              className="aspect-square w-full rounded-xl object-cover"
            />
            <div>
              <Text className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
                Audio track · {Math.ceil(music.durationSeconds)} sec ·{" "}
                {music.genreNames.join(" · ")}
              </Text>
              <Text
                as="h1"
                className="font-display text-5xl leading-none md:text-7xl"
              >
                {music.title}
                {preview ? " · Preview" : ""}
              </Text>
              <Text className="mt-4 text-lg text-gold">{music.artist}</Text>
              <Text className="my-6 max-w-lg text-sm leading-relaxed text-text-secondary">
                {music.synopsis}
                {music.album ? " · " + music.album : ""}
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() =>
                    void audio
                      .start(music, preview)
                      .catch((e) => setError(e.message))
                  }
                >
                  {preview ? "Play preview" : "Play track"}
                </Button>
                {music.previewAvailable && !preview && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      void audio
                        .start(music, true)
                        .catch((e) => setError(e.message))
                    }
                  >
                    Play free preview
                  </Button>
                )}
                <ShareBar title={music.title} compact />
              </div>
              <MusicActions item={music} />
              {error && (
                <p role="alert" className="mt-4 text-sm text-rose-300">
                  {error}{" "}
                  <ButtonLink
                    variant="ghost"
                    to={library.session ? "/profiles" : "/auth/sign-in"}
                  >
                    {library.session ? "Choose profile" : "Sign in"}
                  </ButtonLink>
                </p>
              )}
            </div>
          </div>
          <MusicCollectionCredits musicId={music.id} />
          <ConnectedPlaylistMenu musicId={music.id} format="audio" />
          <ReportContent kind="music" contentId={music.id} />
          <SponsoredCards kind="music" targetId={music.id} />
          <Text as="h2" className="mb-6 mt-14 font-display text-3xl">
            More tracks to discover
          </Text>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {library.items
              .filter((i) => i.kind === "track" && i.id !== music.id)
              .slice(0, 4)
              .map((i) => (
                <ApiMusicCard key={i.id} item={musicItem(i)} fluid />
              ))}
          </div>
        </div>
      </main>
    );
  const Player = AdaptiveVideo;
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <div className="mx-auto max-w-[1760px] px-6 pb-12 md:px-8">
        <ButtonLink to="/music" variant="ghost" className="mb-5">
          Back to Music
        </ButtonLink>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl bg-bg-surface">
              <div className="relative aspect-video bg-bg-base">
                {source ? (
                  <Player
                    src={source}
                    ref={video as any}
                    key={source + revision + library.audience}
                    controls
                    autoPlay={params.get("autoplay") === "1"}
                    onPlay={() => audio.stop()}
                    playsInline
                    preload="metadata"
                    poster={music?.artwork.landscapeUrl}
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
                      if (!preview)
                        window.dispatchEvent(
                          new CustomEvent("mgtv-library-video-ended", {
                            detail: id,
                          }),
                        );
                    }}
                    onSeeked={() => {
                      if (video.current)
                        persist(video.current.currentTime, true);
                    }}
                    aria-label={`${music?.originalLabel ? music.originalLabel + " · " : ""}${preview ? "Preview: " : ""}${music?.title}`}
                    className="h-full w-full"
                    onError={() => {
                      setError(
                        "The media could not be loaded. It may have become unavailable. Reload to check access and try again.",
                      );
                      setSource("");
                    }}
                  ></Player>
                ) : (
                  <PlaybackAccess
                    poster={music?.artwork.landscapeUrl}
                    title={music?.title}
                    message={error}
                    loading={loading}
                    signedIn={!!library.session}
                    needsProfile={library.profileRequired}
                    onRetry={() => setRevision((value) => value + 1)}
                  />
                )}
              </div>
              {error && (
                <div className="flex flex-wrap gap-3 p-4">
                  <Button onClick={() => setRevision((x) => x + 1)}>
                    Try again
                  </Button>
                  {!library.session && (
                    <ButtonLink to="/auth/sign-in" variant="outline">
                      Sign in
                    </ButtonLink>
                  )}
                  {library.profileRequired && (
                    <ButtonLink to="/profiles" variant="outline">
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
            {music && <MusicActions item={music} />}
            <Text as="h1" className="mt-6 font-display text-3xl">
              {music ? music.title : "Music playback"}
              {preview ? " · Preview" : ""}
            </Text>
            <OriginalLabel label={music?.originalLabel}/>
            <Text className="mt-3 text-sm text-text-secondary">
              {music
                ? `${music.classification} · ${preview ? "Free preview" : Math.max(1, Math.ceil(music.durationSeconds / 60)) + " min"}`
                : ""}
            </Text>
            <Text className="mt-4 text-sm leading-relaxed text-text-secondary">
              {music?.artist}
              {music?.album ? " · " + music.album : ""}
              <br />
              {music?.synopsis}
            </Text>
          </div>
          <aside className="min-w-0">
            <PlayerRecommendations
              title="Keep the stories coming"
              items={library.items
                .filter((m) => m.id !== id && m.kind === "music-video")
                .map(musicItem)}
            />
          </aside>
        </div>
        <MusicCollectionCredits musicId={id!} />
        <CollectionVideoNavigation currentId={id!} />
        <ConnectedPlaylistMenu musicId={id!} format="video" />
        <ReportContent kind="music" contentId={music?.id ?? id!} />
        <SponsoredCards kind="music" targetId={music?.id ?? id!} />
      </div>
    </main>
  );
}

function MusicActions({ item }: { item: ApiMusic }) {
  const library = useMusic();
  const [error, setError] = useState("");
  const pref = library.preference(item);
  async function save(patch: any) {
    try {
      await library.save(item, patch);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    }
  }
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Button
        aria-pressed={pref.saved}
        onClick={() => void save({ saved: !pref.saved })}
      >
        {pref.saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="outline"
        aria-pressed={pref.liked}
        onClick={() => void save({ liked: !pref.liked })}
      >
        {pref.liked ? "Liked" : "Like"}
      </Button>
      {item.previewAvailable && (
        <ButtonLink
          variant="ghost"
          to={
            "/music/" +
            (item.kind === "track" ? "track/" : "video/") +
            item.id +
            "?preview=1"
          }
        >
          Free preview
        </ButtonLink>
      )}
      <label className="text-sm text-text-secondary">
        Rate this release
        <select
          aria-label="Rate this release"
          className="ml-2 rounded bg-bg-surface p-2"
          value={pref.rating ?? ""}
          onChange={(e) =>
            void save({
              rating: e.target.value ? Number(e.target.value) : null,
            })
          }
        >
          <option value="">Not rated</option>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}/10
            </option>
          ))}
        </select>
      </label>
      <span role="alert">{error}</span>
    </div>
  );
}

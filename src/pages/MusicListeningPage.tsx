import { ErrorState } from "@/components/shared/LoadingSkeleton";
import { MusicArtwork } from "@/components/music/MusicArtwork";
import { useState } from "react";
import { Link } from "react-router";
import { useMusicAudio } from "@/context/MusicAudioContext";
import { useMusic } from "@/context/MusicContext";
import { Button, ButtonLink } from "@/components/ui/Button";
export default function MusicListeningPage() {
  const audio = useMusicAudio(),
    music = useMusic(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function act(work: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await work();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const saved = audio.saved,
    current = saved?.current;
  const listeningNow=audio.isPlaying&&audio.activeTrackId===current?.id;
  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-6 pb-40 pt-28 md:px-8">
      <Link className="text-sm text-gold" to="/music">
        ‹ Back to Music
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[.2em] text-gold">
        In your rhythm
      </p>
      <h1 className="mt-3 font-display text-5xl md:text-7xl">
        Your soundtrack, waiting.
      </h1>
      <p className="mt-4 max-w-xl text-text-secondary">
        Your track, your place, your queue. Press resume when you’re ready.
      </p>
      {!music.session ? (
        <div className="mt-8">
          <ButtonLink to="/auth/sign-in?returnTo=%2Fmusic%2Fplayer">
            Sign in to listen
          </ButtonLink>
        </div>
      ) : music.profileRequired ? (
        <ButtonLink to="/profiles">Choose your profile</ButtonLink>
      ) : audio.restoring ? (
        <div
          role="status"
          className="mt-10 grid gap-8 md:grid-cols-[20rem_1fr]"
        >
          <div className="aspect-square mgtv-skeleton" />
          <div className="h-40 mgtv-skeleton" />
          <span className="sr-only">Restoring your soundtrack</span>
        </div>
      ) : audio.restorationError ? (
        <ErrorState
          message={audio.restorationError}
          onRetry={() => void audio.refreshListening()}
        />
      ) : saved?.queueIds.length ? (
        <section
          aria-label="Saved listening session"
          className="mt-10 grid items-start gap-8 rounded-[2rem_0_2rem_0] border border-gold/20 bg-bg-surface p-5 shadow-2xl md:grid-cols-[20rem_1fr] md:p-8"
        >
          {current ? (
            <MusicArtwork
              key={current.id}
              src={current.artwork.portraitUrl}
              hero
            />
          ) : (
            <div className="grid aspect-square place-items-center rounded-xl bg-bg-elevated font-display text-3xl text-gold">
              Track unavailable
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-gold">
              {saved.source?.title ?? "Your listening queue"}
            </p>
            <h2 className="mt-3 break-words font-display text-4xl">
              {current?.title ?? "A change in the soundtrack"}
            </h2>
            {current && (
              <p className="mt-3 text-text-secondary">{current.artist}</p>
            )}
            <p className="mt-5 text-sm text-text-secondary">
              Track {saved.index + 1} of {saved.queueIds.length}
              {current?.progress?.completed?" · Ready to replay":current?.progress
                ? ` · ${Math.floor(current.progress.seconds / 60)}:${String(Math.floor(current.progress.seconds % 60)).padStart(2, "0")} saved`
                : ""}
            </p>
            {(saved.otherSession || audio.handoff) && (
              <p className="mt-5 text-sm text-gold">
                This profile is listening in another session. Continue here to
                move your listening session.
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {current && (
                <Button
                  disabled={busy || listeningNow}
                  onClick={() =>
                    void act(() =>
                      audio.resumeListening(
                        saved.otherSession || audio.handoff,
                      ),
                    )
                  }
                >
                  {listeningNow
                    ? "Listening now"
                    : saved.otherSession || audio.handoff
                      ? "Continue here"
                      : "Resume listening"}
                </Button>
              )}
              {saved.index + 1 < saved.queueIds.length && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => void act(audio.skipListening)}
                >
                  Next available track
                </Button>
              )}
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => void act(audio.refreshListening)}
              >
                Refresh queue
              </Button>
            </div>
            <p className="mt-6 text-sm text-text-secondary">
              Opening this page never starts playback automatically. New
              playback checks your current access.
            </p>
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-xl border border-gold/20 bg-bg-surface p-8">
          <h2 className="font-display text-3xl">Find your first repeat.</h2>
          <p className="my-5 text-text-secondary">
            Play a track or an album. Your listening session will be waiting
            here next time.
          </p>
          <ButtonLink to="/music?view=tracks">Explore tracks</ButtonLink>
        </section>
      )}
      {error && (
        <p role="alert" className="mt-5 text-rose-200">
          {error}
        </p>
      )}
      {audio.notice && (
        <p role="status" className="mt-5 text-sm text-text-secondary">
          {audio.notice}
        </p>
      )}
    </main>
  );
}

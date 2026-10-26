import { useEffect, type RefObject } from "react";
import { customerApi, getCustomerSession } from "./customerAuth";
export function usePlaybackAnalytics(
  ref: RefObject<HTMLMediaElement | null>,
  src?: string,
) {
  useEffect(() => {
    if (import.meta.env.VITE_API_MODE !== "connected") return;
    const match =
      /^\/api\/v1\/customer\/(movies|episodes|music|events|sports)\/([a-f0-9-]{36})\/(video|audio)(?:\?|$)/i.exec(
        src ?? "",
      );
    const media = ref.current;
    if (!match || !media) return;
    let disposed = false,
      id = "",
      profile = "",
      busy = false,
      starting = false,
      disabled = false;
    const key = crypto.randomUUID();
    const kind = (
      {
        movies: "movie",
        episodes: "episode",
        music: "music",
        events: "event",
        sports: "sports",
      } as Record<string, string>
    )[match[1]];
    async function begin() {
      if (id || starting || disabled || disposed) return;
      starting = true;
      try {
        const identity = await getCustomerSession();
        if (!identity?.activeProfileId) return;
        profile = identity.activeProfileId;
        const device =
          window.innerWidth < 600
            ? "mobile"
            : window.innerWidth < 1024
              ? "tablet"
              : "desktop";
        const result = await customerApi(
          "/analytics/sessions",
          "POST",
          { kind, targetId: match![2], device },
          { "X-Profile-Context": profile, "Idempotency-Key": key },
        );
        if (!disposed) {
          id = result.sessionId;
          await tick();
        }
      } catch {
        disabled = true;
      } finally {
        starting = false;
      }
    }
    async function tick(reset = false) {
      if (!id || busy || disposed) return;
      busy = true;
      try {
        await customerApi(
          "/analytics/sessions/" + id + "/tick",
          "POST",
          {
            position: media!.currentTime,
            playing:
              !reset && !media!.seeking && (!media!.paused || media!.ended),
          },
          { "X-Profile-Context": profile },
        );
      } catch {
        disabled = true;
        id = "";
      } finally {
        busy = false;
      }
    }
    const onPlay = () => {
      if (!id) void begin();
      else void tick();
    };
    const reset = () => void tick(!media!.ended);
    const ended = () => void tick(false);
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", reset);
    media.addEventListener("seeking", reset);
    media.addEventListener("seeked", reset);
    media.addEventListener("ended", ended);
    const timer = setInterval(() => {
      if (!media!.paused && !media!.seeking) {
        if (!id) void begin();
        else void tick();
      }
    }, 5000);
    return () => {
      disposed = true;
      clearInterval(timer);
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", reset);
      media.removeEventListener("seeking", reset);
      media.removeEventListener("seeked", reset);
      media.removeEventListener("ended", ended);
    };
  }, [src]);
}

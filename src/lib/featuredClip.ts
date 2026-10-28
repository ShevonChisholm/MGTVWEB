/** Browser-local, explicit preference only; a policy fallback is never persisted. */
export const FEATURED_SOUND_KEY = "mgtv.featured-muted.v1";
export function readFeaturedMuted(): boolean {
  try {
    return localStorage.getItem(FEATURED_SOUND_KEY) === "true";
  } catch {
    return false;
  }
}
export function saveFeaturedMuted(muted: boolean): void {
  try {
    localStorage.setItem(FEATURED_SOUND_KEY, String(muted));
  } catch {
    /* Private storage may be unavailable. */
  }
}

type ClipMedia = Pick<HTMLMediaElement, "muted" | "play" | "pause">;
/** Deduplicate readiness events; never let an old rejected play override a newer gesture. */
export class FeaturedClipPlayback {
  private generation = 0;
  private pending = false;
  private blockedSound = false;
  constructor(
    private media: ClipMedia,
    private wanted: () => boolean,
    private onMuted: (muted: boolean) => void,
    private onFailure: () => void,
  ) {}
  stop() {
    this.generation++;
    this.pending = false;
    this.media.pause();
  }
  async play(preferredMuted: boolean, gesture = false): Promise<void> {
    if (!this.wanted() || (this.pending && !gesture)) return;
    if (gesture) this.blockedSound = false;
    const generation = ++this.generation;
    const current = () => generation === this.generation && this.wanted();
    this.pending = true;
    this.media.muted = preferredMuted || this.blockedSound;
    this.onMuted(this.media.muted);
    try {
      await this.media.play();
    } catch (error) {
      if (!current()) return;
      const name = (error as { name?: string })?.name;
      if (name === "NotAllowedError" && !this.media.muted) {
        this.blockedSound = true;
        this.media.muted = true;
        this.onMuted(true);
        try {
          await this.media.play();
        } catch (fallback) {
          if (
            current() &&
            !["NotAllowedError", "AbortError"].includes(
              (fallback as { name?: string })?.name ?? "",
            )
          )
            this.onFailure();
        }
      } else if (name !== "AbortError" && name !== "NotAllowedError")
        this.onFailure();
    } finally {
      if (generation === this.generation) {
        this.pending = false;
        if (!this.wanted()) this.media.pause();
      }
    }
  }
}

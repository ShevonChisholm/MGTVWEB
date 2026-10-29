import { getCustomerSession } from "@/lib/customerAuth";
import { MGTVPlayer } from "./MGTVPlayer";
import { usePlaybackAnalytics } from "@/lib/playbackAnalytics";
import AdvertisingVideo, { advertisingSource } from "./AdvertisingVideo";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type VideoHTMLAttributes,
  type AudioHTMLAttributes,
  type RefObject,
} from "react";
import type Hls from "hls.js";

/** Resolve protected media delivery while retaining MGTV playback and advertising behavior. */
function useMediaDelivery(
  node: RefObject<HTMLMediaElement | null>,
  src?: string,
  suspended = false,
  autoplay = false,
) {
  const suspendedRef = useRef(suspended);
  suspendedRef.current = suspended;
  const autoplayRef = useRef(autoplay);
  autoplayRef.current = autoplay;
  useEffect(() => {
    node.current?.dispatchEvent(new Event("mgtv:budget-state"));
  }, [suspended]);
  useEffect(() => {
    const video = node.current;
    if (!video || !src) return;
    let disposed = false,
      hls: Hls | undefined,
      current = "",
      expires = 0,
      limited = false,
      pending = false,
      waiting = false,
      bookmark = 0,
      requestedPlay = false;
    let requestId: string | undefined,
      requestStarted = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const abort = new AbortController();
    const managedTracks = new Map<string, HTMLTrackElement>();
    function placeCaptions() {
      if (disposed || video!.dataset.mgtvCustomControls !== "true") return;
      const height = video!.clientHeight || 360;
      const line = Math.max(20, Math.min(88, (100 * (height - 100)) / height));
      for (const track of managedTracks.values()) {
        for (const raw of Array.from(track.track.cues ?? [])) {
          const cue = raw as VTTCue;
          if ("snapToLines" in cue && "line" in cue) {
            cue.snapToLines = false;
            cue.line = line;
            cue.lineAlign = "end";
            cue.position = 50;
            cue.size = 90;
            cue.align = "center";
          }
        }
      }
    }
    const captionResize = new ResizeObserver(placeCaptions);
    captionResize.observe(video);
    video.addEventListener("loadedmetadata", placeCaptions);
    function captions(items: any[]) {
      if (video!.tagName !== "VIDEO") return;
      const ids = new Set<string>();
      for (const item of items) {
        if (
          !item ||
          typeof item.id !== "string" ||
          typeof item.url !== "string" ||
          !["captions", "subtitles"].includes(item.kind)
        )
          continue;
        const url = new URL(item.url, location.origin);
        if (
          url.origin !== location.origin ||
          !url.pathname.startsWith("/api/v1/catalog/captions/")
        )
          continue;
        ids.add(item.id);
        let track = managedTracks.get(item.id);
        if (!track) {
          track = document.createElement("track");
          track.kind = item.kind;
          track.label = String(item.label);
          track.srclang = String(item.language);
          track.dataset.mgtvCaptionId = item.id;
          track.addEventListener("load", placeCaptions);
          track.src = url.href;
          managedTracks.set(item.id, track);
          video!.appendChild(track);
        } else if (track.src !== url.href) {
          const showing = track.track.mode === "showing";
          track.src = url.href;
          if (showing) track.track.mode = "showing";
        }
      }
      for (const [id, track] of managedTracks)
        if (!ids.has(id)) {
          track.remove();
          managedTracks.delete(id);
        }
      placeCaptions();
      video!.dispatchEvent(new Event("mgtv:captions"));
    }
    function budgetEvent(budget: any, message?: string) {
      video!.dispatchEvent(
        new CustomEvent("mgtv:viewing-budget", {
          detail: { ...budget, message },
        }),
      );
    }
    function clearSource() {
      bookmark = video!.currentTime || bookmark;
      hls?.destroy();
      hls = undefined;
      video!.pause();
      video!.removeAttribute("src");
      video!.load();

      current = "";
    }
    function defer() {
      clearTimeout(timer);
      video!.dataset.mgtvBudgetDeferred = "true";
      clearSource();
    }
    function schedule() {
      clearTimeout(timer);
      if (!expires) return;
      timer = setTimeout(
        () => {
          if (limited) {
            if (
              video!.paused ||
              video!.ended ||
              waiting ||
              video!.seeking ||
              suspendedRef.current
            ) {
              defer();
              return;
            }
            void resolve(true);
          } else void resolve(false);
        },
        limited ? Math.max(1, expires - Date.now()) : 60000,
      );
    }
    async function resolve(start = false) {
      if (disposed || pending) return;
      pending = true;
      try {
        const api = new URL(src!, location.origin),
          descriptor =
            api.origin === location.origin &&
            api.pathname.startsWith("/api/v1/");
        let delivery: any = { url: src, type: "file", expiresAt: null };
        const wantsWindow = start && !suspendedRef.current;
        if (descriptor) {
          const headers: Record<string, string> = {
            "X-MGTV-Playback": "descriptor",
          };
          if (api.pathname.startsWith("/api/v1/customer/podcast-episodes/")) {
            const session = await getCustomerSession();
            if (session?.activeProfileId) headers["X-Profile-Context"] = session.activeProfileId;
          }
          if (wantsWindow) {
            if (
              !requestId ||
              (expires && expires <= Date.now()) ||
              Date.now() - requestStarted >= 15000
            ) {
              requestId = crypto.randomUUID();
              requestStarted = Date.now();
            }
            headers["X-MGTV-Viewing-Window"] = requestId;
          } else headers["X-MGTV-Viewing-Intent"] = "inspect";
          const response = await fetch(api.pathname + api.search, {
            headers,
            credentials: "include",
            cache: "no-store",
            signal: abort.signal,
          });
          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            if (error.code?.startsWith("VIEWING_")) {
              limited = true;
              defer();
              budgetEvent(
                null,
                error.message ?? "Your viewing time is unavailable.",
              );
              return;
            }
            throw Error("Playback authorization failed");
          }
          delivery = await response.json();
        }
        if (disposed) return;
        const budget = delivery.viewingBudget;
        limited = !!budget?.limited;
        if (budget) budgetEvent(budget);
        if (budget?.deferred) {
          video!.dataset.mgtvBudgetDeferred = "true";
          if ((autoplayRef.current || requestedPlay) && !suspendedRef.current) {
            queueMicrotask(() => void resolve(true));
          }
          return;
        }
        captions(delivery.captionTracks ?? []);
        delete video!.dataset.mgtvBudgetDeferred;
        const url = new URL(delivery.url, location.origin);
        if (url.origin !== location.origin && url.protocol !== "https:")
          throw Error("Invalid media URL");
        if (
          current !== delivery.url &&
          (!expires || limited || expires - Date.now() < 90000)
        ) {
          const position = video!.currentTime || bookmark,
            resume = wantsWindow || requestedPlay || !video!.paused;
          if (delivery.type === "hls") {
            const { default: Hls } = await import("hls.js");
            if (disposed) return;
            if (Hls.isSupported()) {
              hls?.destroy();
              hls = new Hls(
                limited ? { maxBufferLength: 8, maxMaxBufferLength: 12 } : {},
              );
              hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal && !disposed) {
                  clearSource();
                  video!.dispatchEvent(new Event("error"));
                }
              });
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (position > 0) video!.currentTime = position;
                if (resume) void video!.play().catch(() => {});
              });
              hls.attachMedia(video!);
              hls.loadSource(delivery.url);
            } else {
              if (!video!.canPlayType("application/vnd.apple.mpegurl"))
                throw Error("Adaptive playback unavailable");
              video!.src = delivery.url;
              video!.addEventListener(
                "loadedmetadata",
                () => {
                  if (position > 0) video!.currentTime = position;
                  if (resume) void video!.play().catch(() => {});
                },
                { once: true },
              );
            }
          } else {
            hls?.destroy();
            hls = undefined;
            video!.src = delivery.url;
            video!.addEventListener(
              "loadedmetadata",
              () => {
                if (position > 0) video!.currentTime = position;
                if (resume) void video!.play().catch(() => {});
              },
              { once: true },
            );
          }
          current = delivery.url;
        }
        expires = delivery.expiresAt ? Date.parse(delivery.expiresAt) : 0;
        schedule();
      } catch (error) {
        if (!disposed) {
          console.warn("MGTV media authorization/delivery failed");
          clearSource();
          video!.dispatchEvent(new Event("error"));
        }
      } finally {
        pending = false;
      }
    }
    const request = () => {
      requestedPlay = true;
      if (
        !expires ||
        expires <= Date.now() ||
        video.dataset.mgtvBudgetDeferred === "true"
      )
        void resolve(true);
    };
    const restart = () => {
      bookmark = 0;
    };
    const state = () => {
      if (limited) {
        if (suspendedRef.current) {
          clearTimeout(timer);
          video.pause();
        } else if (
          autoplayRef.current ||
          video.dataset.mgtvBudgetResume === "true"
        ) {
          delete video.dataset.mgtvBudgetResume;
          request();
        }
      }
    };
    const playing = () => {
        waiting = false;
        schedule();
      },
      buffering = () => {
        waiting = true;
      };
    if (
      video.tagName === "VIDEO" &&
      /\/customer\/(movies|episodes|music|sports|events)\/[a-f0-9-]+\/video(?:\?|$)/i.test(
        src,
      )
    )
      video.dataset.mgtvBudgetDeferred = "true";
    video.addEventListener("mgtv:budget-restart", restart);
    video.addEventListener("mgtv:budget-play", request);
    video.addEventListener("mgtv:budget-state", state);
    video.addEventListener("playing", playing);
    video.addEventListener("waiting", buffering);
    void resolve(false);
    return () => {
      disposed = true;
      abort.abort();
      clearTimeout(timer);
      video.removeEventListener("mgtv:budget-restart", restart);
      video.removeEventListener("mgtv:budget-play", request);
      video.removeEventListener("mgtv:budget-state", state);
      video.removeEventListener("playing", playing);
      video.removeEventListener("waiting", buffering);
      delete video.dataset.mgtvBudgetDeferred;
      clearSource();
      for (const track of managedTracks.values()) track.remove();
      managedTracks.clear();
      captionResize.disconnect();
      video.removeEventListener("loadedmetadata", placeCaptions);
    };
  }, [src]);
}
const NativeAdaptiveVideo = forwardRef<
  HTMLVideoElement,
  VideoHTMLAttributes<HTMLVideoElement>
>(function AdaptiveVideo({ src, children, ...props }, forwardedRef) {
  const node = useRef<HTMLVideoElement | null>(null);
  useMediaDelivery(
    node,
    src,
    !!(props as any)["data-mgtv-budget-suspended"],
    !!props.autoPlay,
  );
  usePlaybackAnalytics(node, src);
  const attach = useCallback(
    (element: HTMLVideoElement | null) => {
      node.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef],
  );
  return (
    <video
      {...props}
      crossOrigin="anonymous"
      onError={(event) => {
        console.warn(
          "MGTV native video error: " + event.currentTarget.error?.code,
        );
        props.onError?.(event);
      }}
      ref={attach}
    >
      {children}
    </video>
  );
});
const DeliveryVideo = forwardRef<
  HTMLVideoElement,
  VideoHTMLAttributes<HTMLVideoElement>
>(function DeliveryVideo(props, forwarded) {
  return import.meta.env.VITE_API_MODE === "connected" &&
    advertisingSource(props.src) ? (
    <AdvertisingVideo
      {...props}
      base={NativeAdaptiveVideo}
      forwarded={forwarded}
    />
  ) : (
    <NativeAdaptiveVideo {...props} ref={forwarded} />
  );
});
export const AdaptiveVideo = forwardRef<
  HTMLVideoElement,
  VideoHTMLAttributes<HTMLVideoElement>
>(function AdaptiveVideo(props, forwarded) {
  return props.controls ? (
    <MGTVPlayer {...props} base={DeliveryVideo} forwarded={forwarded} />
  ) : (
    <DeliveryVideo {...props} ref={forwarded} />
  );
});
export const AdaptiveAudio = forwardRef<
  HTMLAudioElement,
  AudioHTMLAttributes<HTMLAudioElement>
>(function AdaptiveAudio({ src, children, ...props }, forwardedRef) {
  const node = useRef<HTMLAudioElement | null>(null);
  useMediaDelivery(node, src);
  usePlaybackAnalytics(node, src);
  return (
    <audio
      {...props}
      ref={(element) => {
        node.current = element;
        if (typeof forwardedRef === "function") forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
    />
  );
});

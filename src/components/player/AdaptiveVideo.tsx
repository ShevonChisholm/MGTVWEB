import { MGTVPlayer } from "./MGTVPlayer";
import { usePlaybackAnalytics } from "@/lib/playbackAnalytics";
import AdvertisingVideo, { advertisingSource } from "./AdvertisingVideo";
import {
  forwardRef,
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
) {
  useEffect(() => {
    const video = node.current;
    if (!video || !src) return;
    let disposed = false,
      hls: Hls | undefined,
      current = "",
      currentExpiry = 0,
      timer: ReturnType<typeof setTimeout> | undefined;
    const abort = new AbortController();
    const fail = () => {
      if (!disposed) {
        video.pause();
        hls?.destroy();
        video.removeAttribute("src");
        video.load();
        video.dispatchEvent(new Event("error"));
      }
    };
    async function resolve() {
      let stage = "authorization";
      try {
        const apiUrl = new URL(src!, location.origin);
        // Only MGTV endpoints may receive a descriptor request with session credentials.
        const descriptor =
          (apiUrl.origin === location.origin ||
            apiUrl.hostname === location.hostname) &&
          apiUrl.pathname.startsWith("/api/v1/");
        let delivery = {
          url: src!,
          type: "file",
          expiresAt: null as string | null,
        };
        if (descriptor) {
          const response = await fetch(apiUrl.pathname + apiUrl.search, {
            headers: { "X-MGTV-Playback": "descriptor" },
            credentials: "include",
            cache: "no-store",
            signal: abort.signal,
          });
          if (!response.ok) throw Error("Playback authorization failed");
          delivery = await response.json();
        }
        if (disposed) return;
        stage = "delivery URL";
        const url = new URL(delivery.url, location.origin);
        if (url.origin !== location.origin && url.protocol !== "https:")
          throw Error("Invalid media URL");
        if (
          current !== delivery.url &&
          (!currentExpiry || currentExpiry - Date.now() < 90000)
        ) {
          const position = video!.currentTime,
            resume = !video!.paused;
          if (delivery.type === "hls") {
            stage = "HLS library";
            const { default: Hls } = await import("hls.js");
            if (disposed) return;
            if (!Hls.isSupported()) {
              if (!video!.canPlayType("application/vnd.apple.mpegurl"))
                throw Error("Adaptive playback unavailable");
              video!.src = delivery.url;
              current = delivery.url;
              currentExpiry = Date.parse(delivery.expiresAt!);
              timer = setTimeout(() => void resolve(), 60000);
              return;
            }
            hls?.destroy();
            stage = "HLS initialization";
            hls = new Hls();
            hls.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) {
                console.warn("MGTV HLS failure: " + data.details);
                fail();
              }
            });
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (position > 0) video!.currentTime = position;
              if (resume) void video!.play().catch(() => {});
            });
            if (position > 0)
              video!.addEventListener(
                "loadedmetadata",
                () => {
                  video!.currentTime = position;
                },
                { once: true },
              );
            hls.attachMedia(video!);
            hls.loadSource(delivery.url);
          } else {
            hls?.destroy();
            hls = undefined;
            video!.src = delivery.url;
            if (position > 0)
              video!.addEventListener(
                "loadedmetadata",
                () => {
                  video!.currentTime = position;
                  if (resume) void video!.play().catch(() => {});
                },
                { once: true },
              );
          }
          current = delivery.url;
          currentExpiry = delivery.expiresAt
            ? Date.parse(delivery.expiresAt)
            : 0;
        }
        // Reauthorize periodically. Tokens expire in five minutes even if the page disappears.
        if (descriptor && delivery.expiresAt)
          timer = setTimeout(() => void resolve(), 60000);
      } catch (error) {
        if (!disposed) {
          console.warn(
            "MGTV media initialization failed at " +
              stage +
              " (" +
              (error instanceof Error ? error.name : "Error") +
              ")",
          );
          fail();
        }
      }
    }
    void resolve();
    return () => {
      disposed = true;
      abort.abort();
      clearTimeout(timer);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);
}
const NativeAdaptiveVideo = forwardRef<
  HTMLVideoElement,
  VideoHTMLAttributes<HTMLVideoElement>
>(function AdaptiveVideo({ src, children, ...props }, forwardedRef) {
  const node = useRef<HTMLVideoElement | null>(null);
  useMediaDelivery(node, src);
  usePlaybackAnalytics(node, src);
  return (
    <video
      {...props}
      onError={(event) => {
        console.warn(
          "MGTV native video error: " + event.currentTarget.error?.code,
        );
        props.onError?.(event);
      }}
      ref={(element) => {
        node.current = element;
        if (typeof forwardedRef === "function") forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      }}
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

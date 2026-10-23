import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { catalogById, mediaPreviews } from "@/data/mockContent"
import {
  initialPlayback,
  playbackReducer,
  isRunning,
  type Media,
  type Action,
  type PlaybackState,
} from "@/lib/playback"
import { activeProfile } from "@/lib/appState"
import { useAppState } from "./AppStateContext"
import { useToast } from "./ToastContext"
import { reconcilePlayback, actionReason } from "@/lib/playbackAccess"

export function mediaFor(id: string): Media {
  const item = catalogById[id]
  const preview = mediaPreviews[id]
  return {
    id,
    duration: item?.durationSeconds,
    initial: 0,
    ...(preview?.mode === "simulated" ? { behavior: preview.behavior } : {}),
    ...(preview?.mode === "unavailable"
      ? { unavailable: preview.reason, retryable: preview.retryable }
      : {}),
  }
}
interface VideoSequence {
  playlistId: string
  ids: string[]
}
interface PlaybackContext {
  state: PlaybackState
  dispatch: React.Dispatch<Action>
  playTracks: (ids: string[], index?: number, origin?: string) => void
  toggleTrack: (id: string, ids?: string[], origin?: string) => void
  enqueue: (id: string, next?: boolean) => void
  videoSequence: VideoSequence | null
  setVideoSequence: (value: VideoSequence | null) => void
}
const Context = createContext<PlaybackContext | null>(null)
export function MediaPlaybackProvider({ children }: { children: ReactNode }) {
  const app = useAppState()
  return <PlaybackRuntime key={app.state.revision}>{children}</PlaybackRuntime>
}
function PlaybackRuntime({ children }: { children: ReactNode }) {
  const app = useAppState()
  const { addToast } = useToast()
  const profileId = app.profile?.id
  const [runtime, setRuntime] = useState<PlaybackState>(() => ({
    ...initialPlayback,
    positions: Object.fromEntries(
      Object.entries(app.data.viewing).map(([id, view]) => [id, view.seconds]),
    ),
  }))
  const runtimeRef = useRef(runtime)
  const pendingUsed = useRef(0)
  const [videoSequence, setVideoSequence] = useState<VideoSequence | null>(null)
  const sanitize = useCallback(
    (value: PlaybackState): PlaybackState => {
      return reconcilePlayback(value, app.ref.current)
    },
    [app.ref],
  )
  const state = sanitize(runtime)
  useEffect(() => {
    const previous = runtimeRef.current
    const next = sanitize(previous)
    if (
      next.owner !== previous.owner ||
      next.queue.length !== previous.queue.length ||
      next.audio?.status !== previous.audio?.status ||
      next.video?.status !== previous.video?.status ||
      next.video?.reason !== previous.video?.reason ||
      next.autoplay !== previous.autoplay
    ) {
      runtimeRef.current = next
      setRuntime(next)
    }
  }, [app.state.profiles, app.state.session, app.data.usedSeconds, sanitize])
  useEffect(() => {
    const flush = () => {
      const account = app.ref.current
      const profile = activeProfile(account)
      const video = runtimeRef.current.video
      if (!profile || profile.id !== profileId || !video) return
      if (video.media.live) {
        if (pendingUsed.current > 0)
          app.execute(
            {
              type: "usage",
              seconds:
                account.profileData[profile.id].usedSeconds +
                pendingUsed.current,
            },
            true,
          )
      } else {
        const remembered =
          account.profileData[profile.id].viewing[video.media.id]
        if (
          (video.elapsed > 0 || remembered) &&
          (pendingUsed.current > 0 ||
            remembered?.seconds !== video.elapsed ||
            remembered?.completed !== (video.status === "ended"))
        )
          app.execute(
            {
              type: "view",
              profileId: profile.id,
              id: video.media.id,
              viewing: {
                seconds: video.elapsed,
                completed: video.status === "ended",
                updated: Date.now(),
              },
              used: pendingUsed.current,
            },
            true,
          )
      }
      pendingUsed.current = 0
    }
    app.beforeTransition.current = flush
    return () => {
      if (app.beforeTransition.current === flush)
        app.beforeTransition.current = null
    }
  }, [profileId, app.ref, app.beforeTransition, app.execute])
  const dispatch = useCallback(
    (action: Action) => {
      const currentApp = app.ref.current
      const currentProfile = activeProfile(currentApp)
      let previous = sanitize(runtimeRef.current)
      const previousVideo = previous.video
      if (action.type === "prepareVideo")
        action = {
          ...action,
          media: {
            ...action.media,
            initial: currentProfile
              ? (currentApp.profileData[currentProfile.id].viewing[
                  action.media.id
                ]?.seconds ?? 0)
              : 0,
          },
        }
      const reason = actionReason(previous, action, currentApp)
      if (reason) {
        addToast(reason, "info")
        return
      }
      if (
        action.type === "tick" &&
        previous.owner === "video" &&
        previousVideo?.status === "playing" &&
        currentProfile?.controls.dailyLimit
      ) {
        const remaining =
          currentProfile.controls.dailyLimit -
          currentApp.profileData[currentProfile.id].usedSeconds -
          pendingUsed.current
        action = {
          ...action,
          seconds: Math.max(0, Math.min(action.seconds, remaining)),
        }
      }
      let next = playbackReducer(previous, action)
      if (
        action.type === "tick" &&
        previous.owner === "video" &&
        previousVideo?.status === "playing"
      )
        pendingUsed.current += Math.max(
          0,
          Math.min(
            2,
            action.seconds,
            previousVideo.media.live
              ? 2
              : (previousVideo.media.duration ?? 0) - previousVideo.elapsed,
          ),
        )
      const video = next.video
      const budgetReached =
        currentProfile?.controls.dailyLimit &&
        currentApp.profileData[currentProfile.id].usedSeconds +
          pendingUsed.current >=
          currentProfile.controls.dailyLimit - 0.000001
      const flushNow =
        pendingUsed.current >= 1 ||
        action.type !== "tick" ||
        budgetReached ||
        video?.status === "ended"
      const remembered =
        currentProfile && video
          ? currentApp.profileData[currentProfile.id].viewing[video.media.id]
          : undefined
      const changed =
        video &&
        (pendingUsed.current > 0 ||
          remembered?.seconds !== video.elapsed ||
          remembered?.completed !== (video.status === "ended"))
      if (
        currentProfile &&
        profileId === currentProfile.id &&
        video &&
        !video.media.live &&
        flushNow &&
        changed &&
        (video.elapsed > 0 || remembered)
      ) {
        app.execute(
          {
            type: "view",
            profileId: currentProfile.id,
            id: video.media.id,
            viewing: {
              seconds: video.elapsed,
              completed: video.status === "ended",
              updated: Date.now(),
            },
            used: pendingUsed.current,
          },
          true,
        )
        pendingUsed.current = 0
      } else if (currentProfile && pendingUsed.current > 0 && flushNow) {
        app.execute(
          {
            type: "usage",
            seconds:
              currentApp.profileData[currentProfile.id].usedSeconds +
              pendingUsed.current,
          },
          true,
        )
        pendingUsed.current = 0
      }
      next = sanitize(next)
      runtimeRef.current = next
      setRuntime(next)
    },
    [app.ref, app.execute, addToast, profileId, sanitize],
  )
  const owner = state.owner
  const session = owner ? state[owner] : null
  const generation = session?.generation
  const status = session?.status
  useEffect(() => {
    if (
      !owner ||
      generation === undefined ||
      !["loading", "buffering"].includes(status ?? "")
    )
      return
    const timer = setTimeout(
      () => dispatch({ type: "ready", owner, generation }),
      status === "loading" ? 500 : 1000,
    )
    return () => clearTimeout(timer)
  }, [owner, generation, status, dispatch])
  useEffect(() => {
    if (!owner || status !== "playing") return
    let previous = performance.now()
    const timer = setInterval(() => {
      const now = performance.now()
      dispatch({ type: "tick", seconds: (now - previous) / 1000 })
      previous = now
    }, 250)
    return () => clearInterval(timer)
  }, [owner, status, generation, dispatch])
  const playTracks = (ids: string[], index = 0, origin = "Tracks") => {
    if (ids.some((id) => catalogById[id]?.type !== "track")) return
    dispatch({ type: "audioContext", media: ids.map(mediaFor), index, origin })
  }
  return (
    <Context.Provider
      value={{
        state,
        dispatch,
        playTracks,
        toggleTrack: (id, ids = [id], origin = "Tracks") =>
          state.audio?.media.id === id
            ? dispatch({
                type: isRunning(state.audio) ? "pause" : "play",
                owner: "audio",
              })
            : playTracks(ids, Math.max(0, ids.indexOf(id)), origin),
        enqueue: (id, next = false) => {
          if (catalogById[id]?.type === "track")
            dispatch({ type: "enqueue", media: mediaFor(id), next })
        },
        videoSequence,
        setVideoSequence,
      }}
    >
      {children}
    </Context.Provider>
  )
}
export function usePlayback() {
  const value = useContext(Context)
  if (!value) throw new Error("usePlayback requires MediaPlaybackProvider")
  return value
}

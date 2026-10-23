export type Status = "paused" | "loading" | "playing" | "buffering" | "ended" | "unavailable"
export type Owner = "audio" | "video"
export interface Media {
  id: string
  duration?: number
  live?: boolean
  initial?: number
  behavior?: "buffer-once" | "fail-first-attempt"
  unavailable?: string
  retryable?: boolean
}
export interface Session {
  media: Media
  elapsed: number
  status: Status
  generation: number
  reason?: string
  retryable?: boolean
  completed?: boolean
  policyBlocked?: boolean
}
export interface Entry {
  key: string
  media: Media
}
export interface PlaybackState {
  owner: Owner | null
  audio: Session | null
  video: Session | null
  queue: Entry[]
  index: number
  origin: string
  positions: Record<string, number>
  attempts: Record<string, number>
  buffered: Record<string, boolean>
  serial: number
  audioPausedForVideo: boolean
  autoplay?: boolean
}
export const initialPlayback: PlaybackState = {
  owner: null,
  audio: null,
  video: null,
  queue: [],
  index: -1,
  origin: "",
  positions: {},
  attempts: {},
  buffered: {},
  serial: 0,
  audioPausedForVideo: false,
}
export type Action = {
  type: "audioContext"
  media: Media[]
  index: number
  origin: string
} | {
  type: "prepareVideo"
  media: Media
} | {
  type: "play" | "pause" | "finish" | "buffer" | "fail"
  owner: Owner
} | {
  type: "release"
  owner: Owner
  id?: string
} | {
  type: "seek"
  owner: Owner
  elapsed: number
} | {
  type: "ready"
  owner: Owner
  generation: number
} | {
  type: "tick"
  seconds: number
} | {
  type: "enqueue"
  media: Media
  next: boolean
} | {
  type: "select"
  index: number
} | { type: "next" | "replay" | "clear" } | {
  type: "remove"
  key: string
} | {
  type: "move"
  key: string
  direction: -1 | 1
}

const busy = (session: Session | null) =>
  !!session && ["loading", "playing", "buffering"].includes(session.status)
const valid = (media: Media) =>
  media.live || (Number.isFinite(media.duration) && media.duration! > 0)
const clamp = (value: number, max: number) =>
  Math.max(0, Math.min(Number.isFinite(value) ? value : 0, max))
function session(state: PlaybackState, media: Media, elapsed = 0): Session {
  const reason =
    media.unavailable ??
    (!valid(media)
      ? "This preview has no valid duration or media source."
      : undefined)
  return {
    media,
    elapsed: media.live ? 0 : clamp(elapsed, media.duration ?? 0),
    status: reason ? "unavailable" : "paused",
    generation: state.serial + 1,
    reason,
    retryable: media.retryable ?? false,
  }
}
function remember(state: PlaybackState, value: Session | null) {
  return value
    ? { ...state.positions, [value.media.id]: value.elapsed }
    : state.positions
}
function start(state: PlaybackState, owner: Owner): PlaybackState {
  const current = state[owner]
  if (
    !current ||
    current.media.unavailable ||
    !valid(current.media) ||
    (current.status === "unavailable" && !current.retryable)
  )
    return state
  const other: Owner = owner === "audio" ? "video" : "audio"
  const attempts = (state.attempts[current.media.id] ?? 0) + 1
  return {
    ...state,
    owner,
    serial: state.serial + 1,
    audioPausedForVideo:
      owner === "video"
        ? state.audioPausedForVideo || busy(state.audio)
        : false,
    [other]: state[other]
      ? {
          ...state[other],
          status: busy(state[other]) ? "paused" : state[other]!.status,
          generation: state.serial + 1,
        }
      : null,
    [owner]: {
      ...current,
      elapsed:
        current.status === "ended" ||
        (!current.media.live && current.elapsed >= current.media.duration!)
          ? 0
          : current.elapsed,
      status: "loading",
      generation: state.serial + 1,
      reason: undefined,
      completed: false,
    },
    attempts: { ...state.attempts, [current.media.id]: attempts },
  }
}
function select(
  state: PlaybackState,
  index: number,
  play = true,
): PlaybackState {
  const entry = state.queue[index]
  if (!entry) return state
  const next = {
    ...state,
    positions: remember(state, state.audio),
    index,
    serial: state.serial + 1,
    audio: session(state, entry.media),
    audioPausedForVideo: false,
  }
  return play
    ? start(next, "audio")
    : { ...next, owner: state.owner === "audio" ? null : state.owner }
}
function complete(state: PlaybackState, owner: Owner): PlaybackState {
  const current = state[owner]
  if (!current || current.media.live || current.status === "ended") return state
  const next: PlaybackState = {
    ...state,
    owner: state.owner === owner ? null : state.owner,
    [owner]: {
      ...current,
      elapsed: current.media.duration ?? 0,
      status: "ended",
      completed: true,
      generation: state.serial + 1,
    },
    serial: state.serial + 1,
  }
  next.positions = remember(next, next[owner])
  return owner === "audio" &&
    state.autoplay !== false &&
    state.index + 1 < state.queue.length
    ? select(next, state.index + 1)
    : next
}
export function playbackReducer(
  state: PlaybackState,
  action: Action,
): PlaybackState {
  switch (action.type) {
    case "audioContext": {
      if (
        !action.media.length ||
        !action.media[action.index] ||
        action.media.some((media) => !valid(media))
      )
        return state
      const queue = action.media.map((media, i) => ({
        key: `${state.serial + 1}-${i}`,
        media: { ...media },
      }))
      return select({ ...state, queue, origin: action.origin }, action.index)
    }
    case "prepareVideo": {
      if (state.video?.media.id === action.media.id) {
        return state.video.completed
          ? { ...state, video: { ...state.video, completed: false } }
          : state
      }
      const positions = remember(state, state.video)
      return {
        ...state,
        positions,
        video: session(
          state,
          action.media,
          positions[action.media.id] ?? action.media.initial ?? 0,
        ),
        serial: state.serial + 1,
        owner: state.owner === "video" ? null : state.owner,
      }
    }
    case "play":
      return start(state, action.owner)
    case "pause":
    case "release": {
      const current = state[action.owner]
      if (!current) return state
      if (
        action.type === "release" &&
        action.id &&
        current.media.id !== action.id
      )
        return state
      return {
        ...state,
        positions: remember(state, current),
        owner: state.owner === action.owner ? null : state.owner,
        serial: state.serial + 1,
        [action.owner]: {
          ...current,
          status: busy(current) ? "paused" : current.status,
          generation: state.serial + 1,
        },
      }
    }
    case "ready": {
      const current = state[action.owner]
      if (
        !current ||
        state.owner !== action.owner ||
        current.generation !== action.generation ||
        !["loading", "buffering"].includes(current.status)
      )
        return state
      const fail =
        current.status === "loading" &&
        current.media.behavior === "fail-first-attempt" &&
        state.attempts[current.media.id] === 1
      return {
        ...state,
        owner: fail ? null : state.owner,
        [action.owner]: {
          ...current,
          status: fail ? "unavailable" : "playing",
          reason: fail
            ? "Simulated first-load failure. Retry to continue this preview."
            : undefined,
          retryable: fail,
        },
      }
    }
    case "tick": {
      const owner = state.owner
      if (!owner) return state
      const current = state[owner]
      if (!current || current.status !== "playing") return state
      const elapsed = current.elapsed + clamp(action.seconds, 2)
      const next = {
        ...state,
        [owner]: {
          ...current,
          elapsed: current.media.live
            ? elapsed
            : Math.min(elapsed, current.media.duration!),
        },
      }
      if (!current.media.live && elapsed >= current.media.duration!)
        return complete(next, owner)
      if (
        current.media.behavior === "buffer-once" &&
        elapsed >= 10 &&
        !state.buffered[current.media.id]
      ) {
        return {
          ...next,
          serial: state.serial + 1,
          buffered: { ...state.buffered, [current.media.id]: true },
          [owner]: {
            ...next[owner]!,
            status: "buffering",
            generation: state.serial + 1,
          },
        }
      }
      return next
    }
    case "seek": {
      const current = state[action.owner]
      if (!current || current.media.live || current.status === "unavailable")
        return state
      const elapsed = clamp(action.elapsed, current.media.duration!)
      const atEnd = elapsed === current.media.duration
      const next = {
        ...state,
        serial: state.serial + 1,
        [action.owner]: {
          ...current,
          elapsed,
          generation: state.serial + 1,
          completed: false,
          status: atEnd
            ? "ended" as const
            : current.status === "ended"
              ? "paused" as const
              : current.status,
        },
      }
      return {
        ...next,
        owner: atEnd && state.owner === action.owner ? null : state.owner,
        positions: remember(next, next[action.owner]),
      }
    }
    case "finish":
      return complete(state, action.owner)
    case "buffer": {
      const current = state[action.owner]
      if (!current || current.media.unavailable || !valid(current.media))
        return state
      const next = start(state, action.owner)
      return {
        ...next,
        [action.owner]: { ...next[action.owner]!, status: "buffering" },
      }
    }
    case "fail": {
      const current = state[action.owner]
      if (!current || current.media.unavailable) return state
      return {
        ...state,
        owner: state.owner === action.owner ? null : state.owner,
        serial: state.serial + 1,
        [action.owner]: {
          ...current,
          status: "unavailable",
          reason: "Simulated connection failure. Retry to resume.",
          retryable: true,
          generation: state.serial + 1,
        },
      }
    }
    case "next":
      return select(state, state.index + 1)
    case "replay":
      return select(state, 0)
    case "select":
      return select(state, action.index)
    case "clear":
      return {
        ...state,
        positions: remember(state, state.audio),
        audio: null,
        queue: [],
        index: -1,
        origin: "",
        audioPausedForVideo: false,
        owner: state.owner === "audio" ? null : state.owner,
        serial: state.serial + 1,
      }
    case "enqueue": {
      if (!valid(action.media)) return state
      if (!state.audio)
        return {
          ...state,
          queue: [{ key: `${state.serial + 1}-add`, media: action.media }],
          audio: session(state, action.media),
          index: 0,
          origin: "Your queue",
          serial: state.serial + 1,
        }
      const queue = [...state.queue]
      queue.splice(action.next ? state.index + 1 : queue.length, 0, {
        key: `${state.serial + 1}-add`,
        media: { ...action.media },
      })
      return { ...state, queue, serial: state.serial + 1 }
    }
    case "remove": {
      const index = state.queue.findIndex((entry) => entry.key === action.key)
      if (index < 0) return state
      const queue = state.queue.filter((entry) => entry.key !== action.key)
      if (index === state.index) {
        if (!queue[index]) return playbackReducer(state, { type: "clear" })
        return select({ ...state, queue }, index, busy(state.audio))
      }
      return {
        ...state,
        queue,
        index: index < state.index ? state.index - 1 : state.index,
      }
    }
    case "move": {
      const index = state.queue.findIndex((entry) => entry.key === action.key)
      const target = index + action.direction
      if (
        index <= state.index ||
        target <= state.index ||
        target >= state.queue.length
      )
        return state
      const queue = [...state.queue]
      ;[queue[index], queue[target]] = [queue[target], queue[index]]
      return { ...state, queue }
    }
  }
}
export const isRunning = busy
export function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}
export function statusLabel(session: Session | null) {
  return !session
    ? "Not selected"
    : {
        paused: "Paused",
        loading: "Loading simulated preview…",
        playing: "Preview running (no sound)",
        buffering: "Simulated buffering…",
        ended: "Preview ended",
        unavailable: "Preview unavailable",
      }[session.status]
}

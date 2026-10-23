import type { Playlist } from "../data/mockContent"
import { awardCategories } from "../data/mockAwards"
import {
  allEventDetails,
  broadcasts,
  catalogById,
  products,
} from "../data/mockContent"
import { canDiscover, ceiling } from "./accessPolicy"
import { getEventPresentation } from "./eventPresentation"
export { ceiling } from "./accessPolicy"

export type ProfileType = "adult" | "teen" | "child"
export type SessionStatus = "guest" | "signedIn" | "expired"
export type Phase = "open" | "closed" | "resultsPending"
export const MAX_PROFILES = 5
export const avatarStyles = {
  gold: "bg-gold-dim text-gold",
  blue: "bg-sky-950 text-sky-300",
  coral: "bg-rose-950 text-rose-300",
  jade: "bg-emerald-950 text-emerald-300",
  purple: "bg-violet-950 text-violet-300",
}
export type Avatar = keyof typeof avatarStyles
export interface Preferences {
  language: string
  genres: string[]
  regions: string[]
  autoplay: boolean
  notifications: Record<string, boolean>
}
export interface Controls {
  maxRating: number
  requirePin: boolean
  dailyLimit: number
  purchasePin: boolean
}
export interface Profile {
  id: string
  name: string
  type: ProfileType
  avatar: Avatar
  isMain?: boolean
  preferences: Preferences
  controls: Controls
}
export interface Viewing {
  seconds: number
  completed: boolean
  updated: number
}
export interface NotificationRecord {
  id: string
  title: string
  body: string
  category: string
  contentId?: string
  to?: string
  read: boolean
  source: "fixture" | "reminder" | "mockVote" | "session"
}
export interface ProfileData {
  saved: string[]
  likes: string[]
  following: string[]
  ratings: Record<string, {
    rating: number
    timestamp: number
  }>
  reminders: string[]
  recentlyViewed: string[]
  viewing: Record<string, Viewing>
  usedSeconds: number
  playlists: Playlist[]
  notifications: NotificationRecord[]
}
export interface AppState {
  revision: number
  session: SessionStatus
  account: {
    id: string
    name: string
    email: string
    country: string
    pin: string
    communications: boolean
  }
  profiles: Profile[]
  activeProfileId: string | null
  profileData: Record<string, ProfileData>
  accountNotifications: NotificationRecord[]
  votes: Record<string, {
    nomineeId: string
    nomineeName: string
  }>
  phase: Phase
}
export const defaultPreferences = (): Preferences => ({
  language: "English",
  genres: [],
  regions: [],
  autoplay: true,
  notifications: {
    Shows: true,
    Music: true,
    Sports: true,
    Events: true,
    Awards: true,
    Newsletter: true,
  },
})
export const newProfile = (
  id: string,
  name: string,
  type: ProfileType,
  avatar: Avatar = "gold",
): Profile => ({
  id,
  name: name.trim(),
  type,
  avatar,
  preferences: defaultPreferences(),
  controls: {
    maxRating: ceiling(type),
    requirePin: true,
    dailyLimit: 0,
    purchasePin: true,
  },
})
export const emptyProfileData = (): ProfileData => ({
  saved: [],
  likes: [],
  following: [],
  ratings: {},
  reminders: [],
  recentlyViewed: [],
  viewing: {},
  usedSeconds: 0,
  playlists: [],
  notifications: [],
})
export type Result = { ok: true } | {
  ok: false
  reason: string
}
export type Action = {
  type: "scenario"
  session: SessionStatus
  profileId?: string
} | { type: "signIn" } | {
  type: "select"
  id: string
  pin?: string
} | {
  type: "create"
  profile: Profile
  pin?: string
} | {
  type: "edit"
  profile: Profile
  pin?: string
} | {
  type: "delete"
  id: string
  pin?: string
} | {
  type: "controls"
  id: string
  controls: Controls
  pin?: string
} | {
  type: "data"
  id: string
  data: Partial<ProfileData>
} | {
  type: "preferences"
  preferences: Preferences
} | {
  type: "account"
  account: Partial<AppState["account"]>
} | {
  type: "read"
  ids: string[]
} | {
  type: "vote"
  category: string
  nomineeId: string
  nomineeName: string
} | {
  type: "phase"
  phase: Phase
} | {
  type: "usage"
  seconds: number
} | {
  type: "view"
  profileId: string
  id: string
  viewing: Viewing
  used: number
} | {
  type: "register"
  name: string
  email: string
} | {
  type: "reminder"
  id: string
}

export const activeProfile = (state: AppState) =>
  state.session === "signedIn"
    ? state.profiles.find((p) => p.id === state.activeProfileId)
    : undefined
export const isAdult = (state: AppState) =>
  activeProfile(state)?.type === "adult"
export const safeReturnTo = (value: string | null) =>
  value?.startsWith("/") &&
  !value.startsWith("//") &&
  !value.includes("\\") &&
  !value.startsWith("/auth")
    ? value
    : "/"

export function transition(state: AppState, action: Action): {
  state: AppState
  result: Result
} {
  const fail = (reason: string) => ({
    state,
    result: { ok: false, reason } as Result,
  })
  const done = (patch: Partial<AppState>) => ({
    state: { ...state, ...patch },
    result: { ok: true } as Result,
  })
  const profile = activeProfile(state)
  const parentCheck = (target?: Profile, pin?: string) =>
    !isAdult(state)
      ? "An adult profile is required."
      : (target?.controls.requirePin ?? true) && pin !== state.account.pin
        ? "Enter the correct four-digit demo PIN."
        : ""
  if (action.type === "scenario")
    return done({
      session: action.session,
      activeProfileId: action.profileId ?? state.activeProfileId,
      revision: state.revision + 1,
    })
  if (action.type === "signIn")
    return done({
      session: "signedIn",
      activeProfileId: null,
      revision: state.revision + 1,
    })
  if (action.type === "phase") return done({ phase: action.phase })
  if (action.type === "usage") {
    if (!profile) return fail("Select a profile first.")
    return done({
      profileData: {
        ...state.profileData,
        [profile.id]: {
          ...state.profileData[profile.id],
          usedSeconds: action.seconds,
        },
      },
    })
  }
  if (action.type === "register") {
    if (!action.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.email))
      return fail("Enter valid demo account details.")
    return done({
      account: {
        ...state.account,
        id: `demo-${state.revision + 1}`,
        name: action.name,
        email: action.email,
      },
      session: "signedIn",
      profiles: [],
      profileData: {},
      activeProfileId: null,
      votes: {},
      accountNotifications: [],
      revision: state.revision + 1,
    })
  }
  if (state.session !== "signedIn")
    return fail("Sign in to the demo account to use this action.")
  if (action.type === "select") {
    const target = state.profiles.find((p) => p.id === action.id)
    if (!target) return fail("This profile no longer exists.")
    if (
      profile &&
      profile.type !== "adult" &&
      target.type === "adult" &&
      target.controls.requirePin &&
      action.pin !== state.account.pin
    )
      return fail(
        "Enter the correct four-digit demo PIN to switch to an adult.",
      )
    return done({ activeProfileId: target.id, revision: state.revision + 1 })
  }
  if (action.type === "create") {
    if (state.profiles.length && !isAdult(state))
      return fail("An adult profile is required to add profiles.")
    if (state.profiles.length >= MAX_PROFILES)
      return fail("The demo limit is five total profiles.")
    if (!action.profile.name.trim() || action.profile.name.trim().length > 20)
      return fail("Enter a profile name of 1–20 characters.")
    if (state.profiles.some((p) => p.id === action.profile.id))
      return fail("This profile was already created.")
    if (!state.profiles.length && action.profile.type !== "adult")
      return fail("The first main profile must be an adult.")
    const created = {
      ...action.profile,
      name: action.profile.name.trim(),
      isMain: !state.profiles.length,
      controls: {
        ...action.profile.controls,
        maxRating: Math.min(
          ceiling(action.profile.type),
          action.profile.controls.maxRating,
        ),
      },
    }
    return done({
      profiles: [...state.profiles, created],
      profileData: { ...state.profileData, [created.id]: emptyProfileData() },
    })
  }
  if (
    action.type === "edit" ||
    action.type === "controls" ||
    action.type === "delete"
  ) {
    const id = action.type === "edit" ? action.profile.id : action.id
    const target = state.profiles.find((p) => p.id === id)
    if (!target) return fail("This profile no longer exists.")
    const needsPin =
      action.type !== "edit" || action.profile.type !== target.type
    const error = needsPin
      ? parentCheck(target, action.pin)
      : !isAdult(state)
        ? "An adult profile is required."
        : ""
    if (error) return fail(error)
    if (action.type === "delete") {
      if (target.isMain) return fail("The main profile cannot be deleted.")
      const data = { ...state.profileData }
      delete data[id]
      return done({
        profiles: state.profiles.filter((p) => p.id !== id),
        profileData: data,
        activeProfileId:
          state.activeProfileId === id ? null : state.activeProfileId,
        revision: state.revision + 1,
      })
    }
    if (
      action.type === "edit" &&
      (!action.profile.name.trim() || action.profile.name.trim().length > 20)
    )
      return fail("Enter a name of 1–20 characters.")
    if (
      action.type === "edit" &&
      target.isMain &&
      action.profile.type !== "adult"
    )
      return fail("The main account profile must remain an adult.")
    const updated =
      action.type === "controls"
        ? { ...target, controls: action.controls }
        : { ...action.profile, isMain: target.isMain }
    updated.controls = {
      ...updated.controls,
      maxRating: Math.max(
        0,
        Math.min(ceiling(updated.type), updated.controls.maxRating),
      ),
      dailyLimit: Math.max(0, Math.min(28800, updated.controls.dailyLimit)),
    }
    return done({
      profiles: state.profiles.map((p) => (p.id === id ? updated : p)),
    })
  }
  if (action.type === "account") {
    if (!isAdult(state))
      return fail("Account changes require an adult profile.")
    if (action.account.pin && !/^\d{4}$/.test(action.account.pin))
      return fail("Use a four-digit demo PIN.")
    if (action.account.name !== undefined && !action.account.name.trim())
      return fail("Enter an account name.")
    if (
      action.account.email !== undefined &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.account.email)
    )
      return fail("Enter a valid email address.")
    return done({ account: { ...state.account, ...action.account } })
  }
  if (!profile) return fail("Choose a profile first.")
  if (action.type === "preferences")
    return done({
      profiles: state.profiles.map((p) =>
        p.id === profile.id ? { ...p, preferences: action.preferences } : p,
      ),
    })
  if (action.type === "data") {
    if (action.id !== profile.id)
      return fail("Only the active profile can change this data.")
    const validContent = (id: string) =>
      canDiscover(state, catalogById[id]) ||
      products.some((product) => product.id === id)
    for (const field of [
      "saved",
      "likes",
      "following",
      "recentlyViewed",
    ] as const)
      if (
        action.data[field]?.some(
          (id) =>
            !state.profileData[profile.id][field].includes(id) &&
            !validContent(id),
        )
      )
        return fail("Not available for this profile.")
    if (
      action.data.ratings &&
      Object.entries(action.data.ratings).some(
        ([id, rating]) =>
          (!validContent(id) &&
            state.profileData[profile.id].ratings[id] !== rating) ||
          !Number.isInteger(rating.rating) ||
          rating.rating < 1 ||
          rating.rating > 10,
      )
    )
      return fail("Choose a rating from 1–10 for available content.")
    if (
      action.data.playlists?.some(
        (playlist) =>
          !playlist.isOwn ||
          playlist.itemIds.some(
            (id) =>
              catalogById[id]?.type !==
              (playlist.kind === "audio" ? "track" : "musicVideo"),
          ),
      )
    )
      return fail("Playlist format must match every item.")
    return done({
      profileData: {
        ...state.profileData,
        [profile.id]: { ...state.profileData[profile.id], ...action.data },
      },
    })
  }
  if (action.type === "reminder") {
    const data = state.profileData[profile.id]
    const event = allEventDetails[action.id]
    if (!event || !canDiscover(state, catalogById[action.id]))
      return fail("Not available for this profile.")
    const marked = data.reminders.includes(action.id)
    if (
      !marked &&
      !getEventPresentation(event, broadcasts[event.broadcastId ?? ""])
        .canRemind
    )
      return fail("A reminder cannot be set for this event state.")
    const id = `reminder:${profile.id}:${action.id}`
    const remaining = data.notifications.filter((n) => n.id !== id)
    return done({
      profileData: {
        ...state.profileData,
        [profile.id]: {
          ...data,
          reminders: marked
            ? data.reminders.filter((value) => value !== action.id)
            : [...data.reminders, action.id],
          notifications: marked
            ? remaining
            : [
                {
                  id,
                  title: "Demo reminder saved",
                  body: "Saved for this session only. No alert will be sent.",
                  category: "Events",
                  source: "reminder",
                  contentId: action.id,
                  read: false,
                },
                ...remaining,
              ],
        },
      },
    })
  }
  if (action.type === "view") {
    if (action.profileId !== profile.id)
      return fail("The viewing profile changed.")
    const data = state.profileData[profile.id]
    return done({
      profileData: {
        ...state.profileData,
        [profile.id]: {
          ...data,
          usedSeconds: data.usedSeconds + Math.max(0, action.used),
          viewing: { ...data.viewing, [action.id]: action.viewing },
        },
      },
    })
  }
  if (action.type === "read")
    return done({
      profileData: {
        ...state.profileData,
        [profile.id]: {
          ...state.profileData[profile.id],
          notifications: state.profileData[profile.id].notifications.map((n) =>
            action.ids.includes(n.id) ? { ...n, read: true } : n,
          ),
        },
      },
      accountNotifications: isAdult(state)
        ? state.accountNotifications.map((n) =>
            action.ids.includes(n.id) ? { ...n, read: true } : n,
          )
        : state.accountNotifications,
    })
  if (action.type === "vote") {
    if (!isAdult(state))
      return fail("Mock voting is available to adult profiles only.")
    if (state.phase !== "open") return fail("Mock voting is closed.")
    if (state.votes[action.category])
      return fail("This account has already voted in this category.")
    if (
      !awardCategories
        .find((c) => c.id === action.category)
        ?.nominees.some((n) => n.id === action.nomineeId)
    )
      return fail("This nominee is not in this category.")
    const nomineeName = awardCategories
      .find((c) => c.id === action.category)!
      .nominees.find((n) => n.id === action.nomineeId)!.name
    return done({
      votes: {
        ...state.votes,
        [action.category]: { nomineeId: action.nomineeId, nomineeName },
      },
      profileData: {
        ...state.profileData,
        [profile.id]: {
          ...state.profileData[profile.id],
          notifications: [
            {
              id: `vote:${action.category}`,
              title: "Mock vote recorded",
              body: `Your demo choice: ${action.nomineeName}. No real submission.`,
              category: "Awards",
              to: "/awards",
              read: false,
              source: "mockVote",
            },
            ...state.profileData[profile.id].notifications,
          ],
        },
      },
    })
  }
  return fail("This action is unavailable.")
}

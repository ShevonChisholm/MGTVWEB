import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { initialAppState } from "@/data/mockAccount"
import { catalogById, contentPath, type CatalogItem } from "@/data/mockContent"
import {
  activeProfile,
  emptyProfileData,
  transition,
  type Action,
  type ProfileData,
} from "@/lib/appState"
import { canDiscover, playbackReason } from "@/lib/accessPolicy"
import { useToast } from "./ToastContext"

function useAppValue() {
  const [state, setState] = useState(initialAppState)
  const ref = useRef(state)
  const beforeTransition = useRef<(() => void) | null>(null)
  const [signInRequested, setSignInRequested] = useState(false)
  const { addToast } = useToast()
  const execute = useCallback(
    (action: Action, quiet = false) => {
      if (
        [
          "scenario",
          "select",
          "delete",
          "signIn",
          "register",
          "controls",
        ].includes(action.type)
      )
        beforeTransition.current?.()
      const next = transition(ref.current, action)
      if (next.result.ok) {
        ref.current = next.state
        setState(next.state)
        if (["scenario", "select", "signIn", "register"].includes(action.type))
          setSignInRequested(false)
      } else if (!quiet) addToast(next.result.reason, "info")
      return next.result
    },
    [addToast],
  )
  const reset = () => {
    const next = initialAppState()
    next.revision = ref.current.revision + 1
    ref.current = next
    setState(next)
    setSignInRequested(false)
  }
  const profile = activeProfile(state)
  const data = profile ? state.profileData[profile.id] : emptyProfileData()
  const updateData = (patch: Partial<ProfileData>) =>
    execute({ type: "data", id: profile?.id ?? "", data: patch })
  const notifications = profile
    ? [
        ...data.notifications,
        ...(profile.type === "adult" ? state.accountNotifications : []),
      ].filter(
        (n) =>
          (!n.contentId || canDiscover(state, catalogById[n.contentId])) &&
          (n.category === "System" ||
            profile.preferences.notifications[n.category] !== false),
      )
    : []
  return {
    state,
    ref,
    beforeTransition,
    execute,
    reset,
    profile,
    data,
    updateData,
    notifications,
    signInRequested,
    setSignInRequested,
    unread: notifications.filter((n) => !n.read).length,
    allowed: (item?: CatalogItem) => canDiscover(state, item),
    visible: (items: CatalogItem[]) =>
      items.filter((item) => canDiscover(state, item)),
    reason: (id: string) => playbackReason(state, id),
    notificationPath: (id?: string, to?: string) =>
      id && catalogById[id]
        ? contentPath(catalogById[id])
        : (to ?? "/notifications"),
    requirePersonal: (id?: string) => {
      if (!activeProfile(ref.current)) {
        setSignInRequested(true)
        addToast("Sign in and choose a profile to use this action.", "info")
        return false
      }
      if (id && catalogById[id] && !canDiscover(ref.current, catalogById[id])) {
        addToast("Not available for this profile.", "info")
        return false
      }
      return true
    },
  }
}
const Context = createContext<ReturnType<typeof useAppValue> | null>(null)
export function AppStateProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useAppValue()}>{children}</Context.Provider>
}
export function useAppState() {
  const value = useContext(Context)
  if (!value) throw new Error("useAppState requires AppStateProvider")
  return value
}

import { createContext, useContext, type ReactNode } from "react"
import { useAppState } from "./AppStateContext"

interface SavedContextValue {
  saved: Set<string>
  toggle: (id: string) => void
  isSaved: (id: string) => boolean
}

const SavedContext = createContext<SavedContextValue | null>(null)

export function SavedProvider({ children }: { children: ReactNode }) {
  const { data, updateData, requirePersonal } = useAppState()
  const saved = new Set(data.saved)

  const toggle = (id: string) => {
    if (!requirePersonal(id)) return
    updateData({
      saved: data.saved.includes(id)
        ? data.saved.filter((value) => value !== id)
        : [...data.saved, id],
    })
  }

  const isSaved = (id: string) => saved.has(id)

  return (
    <SavedContext.Provider value={{ saved, toggle, isSaved }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved() {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider")
  return ctx
}

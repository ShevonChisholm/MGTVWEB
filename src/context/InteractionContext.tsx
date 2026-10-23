import { createContext, useContext, useState, type ReactNode } from "react"
import { catalogById, type Product } from "@/data/mockContent"
import { useAppState } from "./AppStateContext"
export interface CartItem {
  product: Product
  qty: number
}

function useInteractionValue() {
  const app = useAppState()
  const { data, updateData, requirePersonal } = app
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const toggle = (field: "likes" | "following", id: string) => {
    if (requirePersonal(id))
      updateData({
        [field]: data[field].includes(id)
          ? data[field].filter((v) => v !== id)
          : [...data[field], id],
      })
  }
  const toggleReminder = (id: string) => {
    if (!requirePersonal(id)) return
    app.execute({ type: "reminder", id })
  }
  return {
    ratings: data.ratings,
    rateItem: (id: string, rating: number) => {
      if (requirePersonal(id) && rating >= 1 && rating <= 10)
        updateData({
          ratings: { ...data.ratings, [id]: { rating, timestamp: Date.now() } },
        })
    },
    getRating: (id: string) => data.ratings[id]?.rating ?? null,
    likes: new Set(data.likes),
    toggleLike: (id: string) => toggle("likes", id),
    isLiked: (id: string) => data.likes.includes(id),
    getLikeCount: (id: string, base: number) =>
      base + Number(data.likes.includes(id)),
    following: new Set(data.following),
    toggleFollow: (id: string) => toggle("following", id),
    isFollowing: (id: string) => data.following.includes(id),
    reminders: new Set(data.reminders),
    toggleReminder,
    hasReminder: (id: string) => data.reminders.includes(id),
    cart,
    cartOpen,
    setCartOpen,
    addToCart: (product: Product, qty: number) => {
      setCart((previous) =>
        previous.some((i) => i.product.id === product.id)
          ? previous.map((i) =>
              i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
            )
          : [...previous, { product, qty }],
      )
      setCartOpen(true)
    },
    removeFromCart: (id: string) =>
      setCart((previous) => previous.filter((i) => i.product.id !== id)),
    updateCartQty: (id: string, qty: number) => {
      if (qty >= 1)
        setCart((previous) =>
          previous.map((i) => (i.product.id === id ? { ...i, qty } : i)),
        )
    },
    cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
    cartTotal: cart.reduce((sum, i) => sum + i.qty * i.product.price, 0),
    recentlyViewed: data.recentlyViewed,
    trackView: (id: string) => {
      if (
        !app.profile ||
        !app.allowed(catalogById[id]) ||
        data.recentlyViewed[0] === id
      )
        return
      updateData({
        recentlyViewed: [
          id,
          ...data.recentlyViewed.filter((v) => v !== id),
        ].slice(0, 6),
      })
    },
  }
}
const Context = createContext<ReturnType<typeof useInteractionValue> | null>(
  null,
)
export function InteractionProvider({ children }: { children: ReactNode }) {
  return (
    <Context.Provider value={useInteractionValue()}>
      {children}
    </Context.Provider>
  )
}
export function useInteraction() {
  const value = useContext(Context)
  if (!value) throw new Error("useInteraction requires InteractionProvider")
  return value
}

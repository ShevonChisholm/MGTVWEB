import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '@/data/mockContent'

export interface CartItem {
  product: Product
  qty: number
}

interface UserRating {
  rating: number
  timestamp: number
}

interface InteractionContextValue {
  // Ratings (1–10)
  ratings: Record<string, UserRating>
  rateItem: (id: string, rating: number) => void
  getRating: (id: string) => number | null

  // Likes
  likes: Set<string>
  toggleLike: (id: string) => void
  isLiked: (id: string) => boolean
  getLikeCount: (id: string, base: number) => number

  // Follow (artists)
  following: Set<string>
  toggleFollow: (id: string) => void
  isFollowing: (id: string) => boolean

  // Event reminders
  reminders: Set<string>
  toggleReminder: (id: string) => void
  hasReminder: (id: string) => boolean

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, qty: number) => void
  removeFromCart: (id: string) => void
  updateCartQty: (id: string, qty: number) => void
  cartCount: number
  cartTotal: number

  // Cart drawer
  cartOpen: boolean
  setCartOpen: (open: boolean) => void

  // Recently viewed
  recentlyViewed: string[]
  trackView: (id: string) => void
}

const InteractionContext = createContext<InteractionContextValue | null>(null)

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Record<string, UserRating>>({})
  const [likes, setLikes] = useState<Set<string>>(new Set())
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [reminders, setReminders] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])

  const rateItem = useCallback((id: string, rating: number) => {
    setRatings(prev => ({ ...prev, [id]: { rating, timestamp: Date.now() } }))
  }, [])

  const getRating = useCallback((id: string) => {
    return ratings[id]?.rating ?? null
  }, [ratings])

  const toggleLike = useCallback((id: string) => {
    setLikes(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const isLiked = useCallback((id: string) => likes.has(id), [likes])

  const getLikeCount = useCallback((id: string, base: number) => {
    return likes.has(id) ? base + 1 : base
  }, [likes])

  const toggleFollow = useCallback((id: string) => {
    setFollowing(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const isFollowing = useCallback((id: string) => following.has(id), [following])

  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }, [])

  const hasReminder = useCallback((id: string) => reminders.has(id), [reminders])

  const addToCart = useCallback((product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
      }
      return [...prev, { product, qty }]
    })
    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(i => i.product.id !== id))
  }, [])

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }, [])

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  const trackView = useCallback((id: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(v => v !== id)
      return [id, ...filtered].slice(0, 6)
    })
  }, [])

  return (
    <InteractionContext.Provider value={{
      ratings, rateItem, getRating,
      likes, toggleLike, isLiked, getLikeCount,
      following, toggleFollow, isFollowing,
      reminders, toggleReminder, hasReminder,
      cart, addToCart, removeFromCart, updateCartQty,
      cartCount, cartTotal, cartOpen, setCartOpen,
      recentlyViewed, trackView,
    }}>
      {children}
    </InteractionContext.Provider>
  )
}

export function useInteraction() {
  const ctx = useContext(InteractionContext)
  if (!ctx) throw new Error('useInteraction must be used within InteractionProvider')
  return ctx
}

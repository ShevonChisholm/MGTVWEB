import { useInteraction } from "@/context/InteractionContext"
import { Button } from "@/components/ui/Button"

interface LikeButtonProps {
  id: string
  label?: string
}

export function LikeButton({ id, label }: LikeButtonProps) {
  const { toggleLike, isLiked } = useInteraction()
  const liked = isLiked(id)

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-pressed={liked}
      aria-label={
        label
          ? `${label}: ${liked ? "selected" : "not selected"}`
          : liked
            ? "Unlike this item"
            : "Like this item"
      }
      onClick={() => toggleLike(id)}
      className={`flex items-center gap-1.5 px-3 py-2 border transition-all duration-200 cursor-pointer ${
        liked
          ? "bg-[#C9A84C]/10 border-[#C9A84C]/40 text-[#C9A84C]"
          : "border-white/12 text-text-secondary hover:border-white/20 hover:text-text-primary"
      }`}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-200 ${
          liked ? "scale-110" : ""
        }`}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {label
        ? `${label}${liked ? " · Selected" : ""}`
        : liked
          ? "Liked"
          : "Like"}
    </Button>
  )
}

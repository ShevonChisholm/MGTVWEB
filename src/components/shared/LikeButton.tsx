import { EngagementIcon } from "./EngagementIcon";
import { useInteraction } from "@/context/InteractionContext";
import { Button } from "@/components/ui/Button";

interface LikeButtonProps {
  id: string;
  label?: string;
  remote?: { value: boolean; busy: boolean; onToggle: () => void };
}

export function LikeButton({ id, label, remote }: LikeButtonProps) {
  const { toggleLike, isLiked } = useInteraction();
  const liked = remote ? remote.value : isLiked(id);

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
      title={
        label
          ? `${label}${liked ? ": selected" : ""}`
          : liked
            ? "Unlike this item"
            : "Like this item"
      }
      disabled={remote?.busy}
      onClick={() => (remote ? remote.onToggle() : toggleLike(id))}
      className={`min-h-11 min-w-11 flex items-center justify-center gap-1.5 px-3 py-2 border-0 transition-colors duration-200 cursor-pointer ${
        liked
          ? "bg-[#C9A84C]/10 border-[#C9A84C]/40 text-[#C9A84C]"
          : "border-white/12 text-text-secondary hover:border-white/20 hover:text-text-primary"
      }`}
    >
      <EngagementIcon
        name={
          label === "Wishlist"
            ? "save"
            : label === "Interested"
              ? "calendar"
              : "like"
        }
        active={liked}
      />
    </Button>
  );
}

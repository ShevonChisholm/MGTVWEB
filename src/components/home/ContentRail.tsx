import { MediaCard } from "./MediaCard";
import { RailViewport, type RailFormat } from "./RailViewport";
import type { ContentItem } from "@/data/mockContent";
import { useViewing } from "@/hooks/useViewing";
interface ContentRailProps {
  title: string;
  items: ContentItem[];
  cardType?:
    | "default"
    | "video"
    | "artist"
    | "news"
    | "event"
    | "movie"
    | "music"
    | "continueWatching";
  seeAllHref?: string;
  seeAllLabel?: string;
  layout?: "page" | "contained";
  goldBorder?: boolean;
  linkPrefix?: string;
  context?: string;
}
export function ContentRail({
  title,
  items: provided,
  cardType,
  seeAllHref,
  seeAllLabel,
  layout = "page",
  goldBorder,
  context,
}: ContentRailProps) {
  const { visibleItems } = useViewing(),
    items = visibleItems(provided);
  if (!items.length) return null;
  const format: RailFormat =
    cardType === "continueWatching"
      ? "landscape"
      : items.every((item) => ["movie", "show"].includes(item.type ?? ""))
        ? "poster"
        : items.every((item) =>
              ["track", "musicVideo"].includes(item.type ?? ""),
            )
          ? "music"
          : items.every((item) => item.type === "artist")
            ? "artist"
            : "landscape";
  const tracks = items
    .filter((item) => item.type === "track")
    .map((item) => item.id);
  return (
    <div className={goldBorder ? "border-t border-gold/20" : ""}>
      <RailViewport
        title={title}
        description={context}
        format={format}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
        contained={layout === "contained"}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="mgtv-rail-item relative flex shrink-0 snap-start flex-col"
          >
            <MediaCard
              item={item}
              fluid
              railFormat={format}
              mode={cardType === "continueWatching" ? "continue" : "standard"}
              trackIds={tracks}
              trackOrigin={title}
            />
          </div>
        ))}
      </RailViewport>
    </div>
  );
}

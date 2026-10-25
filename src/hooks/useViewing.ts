import {
  catalogById,
  episodes,
  type CatalogItem,
  type ContentItem,
  contentPath,
} from "@/data/mockContent";
import { useAppState } from "@/context/AppStateContext";
export function useViewing() {
  const app = useAppState();
  const itemWithProgress = (item: CatalogItem): CatalogItem => ({
    ...item,
    progress: item.durationSeconds
      ? Math.min(
          100,
          ((app.data.viewing[item.id]?.seconds ?? 0) / item.durationSeconds) *
            100,
        )
      : 0,
  });
  const playable = (item: CatalogItem) => {
    if (item.type !== "show")
      return ["movie", "episode", "sports", "musicVideo"].includes(item.type)
        ? itemWithProgress(item)
        : undefined;
    const series = episodes
      .filter((ep) => ep.showId === item.id && app.allowed(ep))
      .sort(
        (a, b) =>
          a.seasonNumber! - b.seasonNumber! ||
          a.episodeNumber! - b.episodeNumber!,
      );
    const recent = series
      .filter(
        (ep) =>
          (app.data.viewing[ep.id]?.seconds ?? 0) > 0 &&
          !app.data.viewing[ep.id]?.completed,
      )
      .sort(
        (a, b) =>
          app.data.viewing[b.id].updated - app.data.viewing[a.id].updated,
      )[0];
    const next =
      recent ??
      series.find((ep) => !app.data.viewing[ep.id]?.completed) ??
      series[0];
    return next ? itemWithProgress(next) : undefined;
  };
  const watchPath = (item: CatalogItem) => {
    if(item.source==="api"&&item.type==="sports")return `/sports/${item.id}/watch`;
    const next = playable(item);
    return next
      ? next.type === "musicVideo"
        ? contentPath(next)
        : `/watch/${next.id}`
      : undefined;
  };
  const continuing = Object.entries(app.data.viewing)
    .filter(
      ([id, view]) =>
        !view.completed &&
        view.seconds > 0 &&
        catalogById[id]?.durationSeconds &&
        catalogById[id]?.type !== "track" &&
        app.allowed(catalogById[id]),
    )
    .sort((a, b) => b[1].updated - a[1].updated)
    .map(([id]) => itemWithProgress(catalogById[id]));
  return {
    itemWithProgress,
    playableItem: playable,
    watchPath,
    continuing,
    visibleItems: (items: ContentItem[]) =>
      items
        .map((i) =>
          i.source === "api" ? (i as CatalogItem) : catalogById[i.id],
        )
        .filter((i) => i?.source === "api" || app.allowed(i)),
  };
}

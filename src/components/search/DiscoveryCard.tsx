import {PodcastCard} from "@/components/podcasts/PodcastCard";
import { MediaCard } from "@/components/home/MediaCard";
import { ApiEventCard } from "@/components/home/ApiEventCard";
import { LibraryCard } from "@/components/music/LibraryCard";
import { homepageItem, type HomepageEntry } from "@/lib/homepage";
export default function DiscoveryCard({ entry }: { entry: HomepageEntry }) {
  if(entry.kind==="podcast")return <PodcastCard item={entry.content}/>;
  if (["artist", "album", "playlist"].includes(entry.kind))
    return <LibraryCard kind={entry.kind + "s"} item={entry.content} />;
  if (entry.kind === "event")
    return (
      <ApiEventCard event={entry.content} item={homepageItem(entry)} fluid />
    );
  return <MediaCard item={homepageItem(entry)} fluid />;
}

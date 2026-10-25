import {useSports,sportsItem} from "@/context/SportsContext";
import {useLifestyle,lifestyleItem,lifestyleArticle} from "@/lib/lifestyle";
import {useNews,newsItem} from "@/lib/news";
import {useLibraryPage} from "@/lib/musicLibrary";
import { useEvents, eventItem } from "@/context/EventsContext";
import { useMusic, musicItem } from "@/context/MusicContext";
import { useShows, seriesItem } from "@/context/ShowsContext";
import * as fixtures from "@/data/mockContent";
import { useAppState } from "@/context/AppStateContext";
import { useViewing } from "./useViewing";
import { movieItem, useMovies } from "@/context/MovieContext";
export function useCatalog() {
  const app = useAppState();
  const sports=useSports();
  const news=useNews();
  const lifestyle=useLifestyle();
  const lifestyleItems:fixtures.CatalogItem[]=(lifestyle.data?.items??[]).map(lifestyleItem);
  const lifestyleStories:fixtures.LifestyleArticle[]=(lifestyle.data?.items??[]).map(lifestyleArticle);
  const newsItems:fixtures.CatalogItem[]=(news.data?.items??[]).map(newsItem);
  const viewing = useViewing();
  const remote = useMovies(),
    series = useShows(),
    music = useMusic();
  const events=useEvents();
  const artistLibrary=useLibraryPage("/artists?limit=24");
  const artists:fixtures.CatalogItem[]=(artistLibrary.data?.items??[]).map((a:any)=>({id:a.id,type:"artist" as const,source:"api" as const,title:a.title,thumbnail:a.coverUrl,description:a.description,genre:a.genre}));
  const connected = import.meta.env.VITE_API_MODE === "connected";
  const movies = remote.items.map(movieItem);
  const original = app
    .visible(fixtures.originals)
    .filter(
      (i) =>
        !connected ||
        !["movie", "show", "episode", "musicVideo", "track", "event", "artist", "news", "lifestyle", "sports"].includes(i.type),
    );
  return {
    catalog: [
      ...app
        .visible(fixtures.catalog)
        .filter(
          (i) =>
            !connected ||
            !["movie", "show", "episode", "musicVideo", "track", "event", "artist", "news", "lifestyle", "sports"].includes(
              i.type,
            ),
        ),
      ...(connected
        ? [
            ...movies,
            ...sports.items.map(sportsItem),
            ...series.items.map(seriesItem),
            ...music.items.map(musicItem),
            ...events.items.map(eventItem),
            ...artists,
            ...newsItems,
            ...lifestyleItems,
          ]
        : []),
    ],
    featuredShows: connected
      ? series.items.map(seriesItem)
      : app.visible(fixtures.featuredShows),
    popularMovies: connected ? movies : app.visible(fixtures.popularMovies),
    musicVideos: connected
      ? music.items.filter((i) => i.kind === "music-video").map(musicItem)
      : app.visible(fixtures.musicVideos),
    tracks: connected
      ? music.items.filter((i) => i.kind === "track").map(musicItem)
      : app.visible(fixtures.tracks),
    featuredArtists: connected?artists:app.visible(fixtures.featuredArtists),
    sportsHighlights: connected?sports.items.map(sportsItem):app.visible(fixtures.sportsHighlights),
    latestNews: connected?newsItems:app.visible(fixtures.latestNews),
    upcomingEvents: connected ? events.items.filter(e=>["scheduled","postponed"].includes(e.lifecycle)).map(eventItem) : app.visible(fixtures.upcomingEvents),
    lifestyleContent: connected?lifestyleItems:app.visible(fixtures.lifestyleContent),
    lifestyleArticles: connected?lifestyleStories:fixtures.lifestyleArticles.filter((item) =>
      app.allowed(fixtures.catalogById[item.id]),
    ),
    originals: original,
    trending: app
      .visible(fixtures.trending)
      .filter(
        (i) =>
          !connected ||
          !["movie", "show", "episode", "musicVideo", "track", "event", "artist", "news", "lifestyle", "sports"].includes(i.type),
      ),
    continueWatching: [
      ...viewing.continuing.filter(
        (i) =>
          !connected ||
          !["movie", "show", "episode", "musicVideo", "track", "event", "artist", "news", "lifestyle", "sports"].includes(i.type),
      ),
      ...(connected
        ? [
            ...remote.continuing.map(movieItem),
            ...sports.continuing.map(sportsItem),
            ...series.continuing.map(seriesItem),
          ]
        : []),
    ],
  };
}

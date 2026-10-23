import * as fixtures from "@/data/mockContent"
import { useAppState } from "@/context/AppStateContext"
import { useViewing } from "./useViewing"
export function useCatalog() {
  const app = useAppState()
  const viewing = useViewing()
  return {
    catalog: app.visible(fixtures.catalog),
    featuredShows: app.visible(fixtures.featuredShows),
    popularMovies: app.visible(fixtures.popularMovies),
    musicVideos: app.visible(fixtures.musicVideos),
    tracks: app.visible(fixtures.tracks),
    featuredArtists: app.visible(fixtures.featuredArtists),
    sportsHighlights: app.visible(fixtures.sportsHighlights),
    latestNews: app.visible(fixtures.latestNews),
    upcomingEvents: app.visible(fixtures.upcomingEvents),
    lifestyleContent: app.visible(fixtures.lifestyleContent),
    lifestyleArticles: fixtures.lifestyleArticles.filter((item) =>
      app.allowed(fixtures.catalogById[item.id]),
    ),
    originals: app.visible(fixtures.originals),
    trending: app.visible(fixtures.trending),
    continueWatching: viewing.continuing,
  }
}

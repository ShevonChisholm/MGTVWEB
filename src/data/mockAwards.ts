import { featuredArtists, sportsHighlights } from "./mockContent"
const artist = (index: number) => ({
  id: featuredArtists[index].id,
  name: featuredArtists[index].title,
  image: featuredArtists[index].thumbnail,
  description: featuredArtists[index].genre ?? "Music",
})
export const awardCategories = [
  {
    id: "best-reggae",
    title: "Best Reggae Artist",
    section: "Music",
    nominees: [artist(0), artist(1), artist(2)],
  },
  {
    id: "best-soca",
    title: "Best Soca Performance",
    section: "Music",
    nominees: [artist(3), artist(5), artist(4)],
  },
  {
    id: "best-new",
    title: "Best New Artist",
    section: "Music",
    nominees: [artist(0), artist(3), artist(2)],
  },
  {
    id: "peoples-choice",
    title: "People's Choice Award",
    section: "Music",
    nominees: [artist(0), artist(1), artist(5)],
  },
  {
    id: "outstanding-athlete",
    title: "Outstanding Athlete",
    section: "Sports",
    nominees: [
      {
        id: "demo-athlete-1",
        name: "Alicia Morgan",
        image: sportsHighlights[0].thumbnail,
        description: "Track & Field · Demo nominee",
      },
      {
        id: "demo-athlete-2",
        name: "Devonte Reid",
        image: sportsHighlights[2].thumbnail,
        description: "Athletics · Demo nominee",
      },
      {
        id: "demo-athlete-3",
        name: "Marcus Brown",
        image: sportsHighlights[4].thumbnail,
        description: "Athletics · Demo nominee",
      },
    ],
  },
  {
    id: "youth-dev",
    title: "Youth Development Award",
    section: "Sports",
    nominees: [
      {
        id: "demo-athlete-4",
        name: "Kyle James",
        image: sportsHighlights[1].thumbnail,
        description: "Youth development · Demo nominee",
      },
      {
        id: "demo-athlete-5",
        name: "Jade Francis",
        image: sportsHighlights[3].thumbnail,
        description: "Athletics · Demo nominee",
      },
    ],
  },
]

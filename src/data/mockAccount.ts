import { newProfile, emptyProfileData, type AppState } from "../lib/appState"
import { continueWatching, playlists } from "./mockContent"

export function initialAppState(): AppState {
  const profiles = [
    { ...newProfile("p1", "Alex", "adult", "gold"), isMain: true },
    newProfile("p2", "Jordan", "teen", "blue"),
    newProfile("p3", "Kids", "child", "jade"),
  ]
  const profileData = Object.fromEntries(
    profiles.map((p) => [p.id, emptyProfileData()]),
  )
  profileData.p1.viewing = Object.fromEntries(
    continueWatching.map((item) => [
      item.id,
      {
        seconds: ((item.durationSeconds ?? 0) * (item.progress ?? 0)) / 100,
        completed: false,
        updated: 1,
      },
    ]),
  )
  profileData.p1.playlists = playlists
    .filter((p) => p.isOwn)
    .map((p) => ({ ...p }))
  for (const profile of profiles)
    profileData[profile.id].notifications = [
      {
        id: "fixture:episode",
        title: "Explore Island Chronicles",
        body: "Sample episode available in the demo catalog.",
        contentId: "t1",
        category: "Shows",
        source: "fixture",
        read: false,
      },
      {
        id: "fixture:music",
        title: "Discover Empress Nia",
        body: "Sample tracks and videos. Playback is simulated, with no sound.",
        contentId: "a1",
        category: "Music",
        source: "fixture",
        read: false,
      },
      {
        id: "fixture:awards",
        title: "MGTV Awards demonstration",
        body: "Explore mock voting. No real submissions or published results.",
        category: "Awards",
        to: "/awards",
        source: "fixture",
        read: false,
      },
    ]
  return {
    revision: 0,
    session: "signedIn",
    account: {
      id: "mgtv-demo",
      name: "Alex Morgan",
      email: "alex.morgan@example.com",
      country: "Jamaica",
      pin: "1234",
      communications: true,
    },
    profiles,
    activeProfileId: "p1",
    profileData,
    phase: "open",
    votes: {},
    accountNotifications: [
      {
        id: "system:demo",
        title: "Your local demo account",
        body: "No billing, emails, or real account activity is connected. Reload resets this prototype.",
        category: "System",
        to: "/account",
        source: "session",
        read: true,
      },
    ],
  }
}

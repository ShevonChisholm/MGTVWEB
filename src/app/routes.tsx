import ScreenTransition from "@/components/shared/ScreenTransition";
import { lazy, Suspense, type ComponentType } from "react";

import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

import RouteErrorView from "@/components/shared/RouteErrorView";

import { SportsProvider } from "@/context/SportsContext";

import { EventsProvider } from "@/context/EventsContext";

import { MusicAudioProvider } from "@/context/MusicAudioContext";

import { MusicProvider } from "@/context/MusicContext";

import { ShowsProvider } from "@/context/ShowsContext";

import { MovieProvider } from "@/context/MovieContext";

import { connectedAuth } from "@/lib/customerAuth";

import { createBrowserRouter, Outlet, useLocation } from "react-router";

import { Navbar } from "@/components/layout/Navbar";

import { Footer } from "@/components/layout/Footer";

import { AuthLayout } from "@/components/auth/AuthLayout";

import { PlaybackLayout } from "@/components/player/AudioMiniPlayer";

import { ContentBoundary } from "@/components/shared/ContentBoundary";

import { PersonalActionNotice } from "@/components/shared/PersonalActionNotice";

// Main app pages
import { HomePage } from "@/pages/HomePage";

function deferredPage(load: () => Promise<{ default: ComponentType<any> }>) {
  const Screen = lazy(load);
  return function DeferredScreen(props: any) {
    return (
      <Suspense
        fallback={
          <div
            className="min-h-[70vh] px-6 py-12"
            role="status"
            aria-label="Loading page"
          >
            <LoadingSkeleton variant="detail" />
          </div>
        }
      >
        <Screen {...props} />
      </Suspense>
    );
  };
}

const PodcastsPage = deferredPage(() => import("@/pages/PodcastsPage"));
const PodcastEpisodePage = deferredPage(() => import("@/pages/PodcastEpisodePage"));
const CareersPage = deferredPage(() => import("@/pages/CareersPage"));

const ComingSoonPage = deferredPage(() => import("@/pages/ComingSoonPage"));

const ConnectedContact = deferredPage(() =>
  import("@/pages/ConnectedContact").then((m) => ({
    default: m.ConnectedContact,
  })),
);

const NewsletterAction = deferredPage(() =>
  import("@/pages/NewsletterAction").then((m) => ({
    default: m.NewsletterAction,
  })),
);

const CommerceOrders = deferredPage(() =>
  import("@/pages/CommerceOrders").then((m) => ({ default: m.CommerceOrders })),
);

const SportsWatchPage = deferredPage(() =>
  import("@/pages/SportsWatchPage").then((m) => ({
    default: m.SportsWatchPage,
  })),
);

const ConnectedLibraryDetail = deferredPage(() =>
  import("@/pages/ConnectedMusicLibrary").then((m) => ({
    default: m.ConnectedLibraryDetail,
  })),
);

const EpisodeWatchPage = deferredPage(() =>
  import("@/pages/EpisodeWatchPage").then((m) => ({
    default: m.EpisodeWatchPage,
  })),
);

const ConnectedAuth = deferredPage(() => import("@/pages/auth/ConnectedAuth"));

const ConnectedProfiles = deferredPage(
  () => import("@/pages/auth/ConnectedProfiles"),
);

const ConnectedAccount = deferredPage(
  () => import("@/pages/auth/ConnectedAccount"),
);

const TrackDetailPage = deferredPage(() =>
  import("@/pages/TrackDetailPage").then((m) => ({
    default: m.TrackDetailPage,
  })),
);

const EventWatchPage = deferredPage(() =>
  import("@/pages/EventWatchPage").then((m) => ({ default: m.EventWatchPage })),
);

const ShowsPage = deferredPage(() =>
  import("@/pages/ShowsPage").then((m) => ({ default: m.ShowsPage })),
);

const ShowDetailPage = deferredPage(() =>
  import("@/pages/ShowDetailPage").then((m) => ({ default: m.ShowDetailPage })),
);

const MoviesPage = deferredPage(() =>
  import("@/pages/MoviesPage").then((m) => ({ default: m.MoviesPage })),
);

const MovieDetailPage = deferredPage(() =>
  import("@/pages/MovieDetailPage").then((m) => ({
    default: m.MovieDetailPage,
  })),
);

const MusicListeningPage = deferredPage(
  () => import("@/pages/MusicListeningPage"),
);
const MusicPage = deferredPage(() =>
  import("@/pages/MusicPage").then((m) => ({ default: m.MusicPage })),
);

const ArtistProfilePage = deferredPage(() =>
  import("@/pages/ArtistProfilePage").then((m) => ({
    default: m.ArtistProfilePage,
  })),
);

const MusicVideoPage = deferredPage(() =>
  import("@/pages/MusicVideoPage").then((m) => ({ default: m.MusicVideoPage })),
);

const PlaylistPage = deferredPage(() =>
  import("@/pages/PlaylistPage").then((m) => ({ default: m.PlaylistPage })),
);

const SportsPage = deferredPage(() =>
  import("@/pages/SportsPage").then((m) => ({ default: m.SportsPage })),
);

const SportsDetailPage = deferredPage(() =>
  import("@/pages/SportsDetailPage").then((m) => ({
    default: m.SportsDetailPage,
  })),
);

const LifestyleArticlePage = deferredPage(() =>
  import("@/pages/LifestyleArticlePage").then((m) => ({
    default: m.LifestyleArticlePage,
  })),
);

const NewsPage = deferredPage(() =>
  import("@/pages/NewsPage").then((m) => ({ default: m.NewsPage })),
);

const NewsArticlePage = deferredPage(() =>
  import("@/pages/NewsArticlePage").then((m) => ({
    default: m.NewsArticlePage,
  })),
);

const EventsPage = deferredPage(() =>
  import("@/pages/EventsPage").then((m) => ({ default: m.EventsPage })),
);

const EventDetailPage = deferredPage(() =>
  import("@/pages/EventDetailPage").then((m) => ({
    default: m.EventDetailPage,
  })),
);

const MGTVPlusPage = deferredPage(() =>
  import("@/pages/MGTVPlusPage").then((m) => ({ default: m.MGTVPlusPage })),
);

const AccountPage = deferredPage(() =>
  import("@/pages/AccountPage").then((m) => ({ default: m.AccountPage })),
);

const ProfilesPage = deferredPage(() =>
  import("@/pages/ProfilesPage").then((m) => ({ default: m.ProfilesPage })),
);

const ParentalControlsPage = deferredPage(() =>
  import("@/pages/ParentalControlsPage").then((m) => ({
    default: m.ParentalControlsPage,
  })),
);

const SearchPage = deferredPage(() =>
  import("@/pages/SearchPage").then((m) => ({ default: m.SearchPage })),
);

const WatchPage = deferredPage(() =>
  import("@/pages/WatchPage").then((m) => ({ default: m.WatchPage })),
);

const MyListPage = deferredPage(() =>
  import("@/pages/MyListPage").then((m) => ({ default: m.MyListPage })),
);

const AwardsPage = deferredPage(() =>
  import("@/pages/AwardsPage").then((m) => ({ default: m.AwardsPage })),
);

const NotificationsPage = deferredPage(() =>
  import("@/pages/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);

const ShopPage = deferredPage(() =>
  import("@/pages/ShopPage").then((m) => ({ default: m.ShopPage })),
);

const ProductDetailPage = deferredPage(() =>
  import("@/pages/ProductDetailPage").then((m) => ({
    default: m.ProductDetailPage,
  })),
);

const LifestylePage = deferredPage(() =>
  import("@/pages/LifestylePage").then((m) => ({ default: m.LifestylePage })),
);

const StaticPage = deferredPage(() =>
  import("@/pages/StaticPage").then((m) => ({ default: m.StaticPage })),
);

const NotFoundPage = deferredPage(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

const AuthLandingPage = deferredPage(() =>
  import("@/pages/auth/AuthLandingPage").then((m) => ({
    default: m.AuthLandingPage,
  })),
);

const SignInPage = deferredPage(() =>
  import("@/pages/auth/SignInPage").then((m) => ({ default: m.SignInPage })),
);

const RegisterPage = deferredPage(() =>
  import("@/pages/auth/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  })),
);

const VerifyEmailPage = deferredPage(() =>
  import("@/pages/auth/VerifyEmailPage").then((m) => ({
    default: m.VerifyEmailPage,
  })),
);

const ForgotPasswordPage = deferredPage(() =>
  import("@/pages/auth/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

const ResetPasswordPage = deferredPage(() =>
  import("@/pages/auth/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);

const CreateProfilePage = deferredPage(() =>
  import("@/pages/profiles/CreateProfilePage").then((m) => ({
    default: m.CreateProfilePage,
  })),
);

// Auth pages

// Profile creation

function MainLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-full bg-[#0A0A0A]">
      <Navbar />
      <PersonalActionNotice />
      <ContentBoundary>
        <ScreenTransition screenKey={pathname}>
          <Outlet />
        </ScreenTransition>
      </ContentBoundary>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorView />,

    Component: () => (
      <SportsProvider>
        <MovieProvider>
          <ShowsProvider>
            <MusicProvider>
              <EventsProvider>
                <MusicAudioProvider>
                  <PlaybackLayout />
                </MusicAudioProvider>
              </EventsProvider>
            </MusicProvider>
          </ShowsProvider>
        </MovieProvider>
      </SportsProvider>
    ),
    children: [
      // Auth routes — cinematic split layout, no Navbar/Footer
      {
        path: "/auth",
        Component: AuthLayout,
        children: [
          {
            index: true,
            Component: connectedAuth
              ? () => <ConnectedAuth action="sign-in" />
              : AuthLandingPage,
          },
          {
            path: "sign-in",
            Component: connectedAuth
              ? () => <ConnectedAuth action="sign-in" />
              : SignInPage,
          },
          {
            path: "register",
            Component: connectedAuth
              ? () => <ConnectedAuth action="register" />
              : RegisterPage,
          },
          {
            path: "verify-email",
            Component: connectedAuth
              ? () => <ConnectedAuth action="verify-email" />
              : VerifyEmailPage,
          },
          {
            path: "forgot-password",
            Component: connectedAuth
              ? () => <ConnectedAuth action="forgot-password" />
              : ForgotPasswordPage,
          },
          {
            path: "reset-password",
            Component: connectedAuth
              ? () => <ConnectedAuth action="reset-password" />
              : ResetPasswordPage,
          },
        ],
      },

      // Profile creation — standalone (no footer, minimal chrome)
      {
        path: "/profiles/create",
        Component: connectedAuth ? ConnectedProfiles : CreateProfilePage,
      },

      {
        path: "/profiles/*",
        Component: connectedAuth ? ConnectedProfiles : ProfilesPage,
      },

      {
        path: "/parental-controls",
        Component: connectedAuth ? ConnectedProfiles : ParentalControlsPage,
      },

      // Main app — Navbar + Footer wrapper
      {
        path: "/",
        Component: MainLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "coming-soon/:kind/:id", Component: ComingSoonPage },
          { path: "watch/episodes/:id", Component: EpisodeWatchPage },
          { path: "shows", Component: ShowsPage },
          { path: "shows/:id", Component: ShowDetailPage },
          { path: "movies", Component: MoviesPage },
          { path: "movies/:id", Component: MovieDetailPage },
          { path: "music", Component: MusicPage },
          { path: "music/player", Component: MusicListeningPage },
          { path: "music/artist/:id", Component: ArtistProfilePage },
          {
            path: "music/album/:id",
            Component: () => <ConnectedLibraryDetail kind="albums" />,
          },
          { path: "music/video/:id", Component: MusicVideoPage },
          { path: "music/track/:id", Component: TrackDetailPage },
          { path: "music/playlist/:id", Component: PlaylistPage },
          { path: "podcasts", Component: PodcastsPage },
          { path: "podcasts/episodes/:id", Component: PodcastEpisodePage },
          { path: "podcasts/:id", Component: PodcastsPage },
          { path: "sports", Component: SportsPage },
          { path: "sports/:id/watch", Component: SportsWatchPage },
          { path: "sports/:id", Component: SportsDetailPage },
          { path: "careers", Component: CareersPage },
          { path: "careers/:id", Component: CareersPage },
          { path: "news", Component: NewsPage },
          { path: "news/:id", Component: NewsArticlePage },
          { path: "events", Component: EventsPage },
          { path: "events/:id", Component: EventDetailPage },
          { path: "events/:id/watch", Component: EventWatchPage },
          { path: "mgtv-plus", Component: MGTVPlusPage },
          { path: "search", Component: SearchPage },
          { path: "watch/:id", Component: WatchPage },
          { path: "my-list", Component: MyListPage },
          { path: "awards", Component: AwardsPage },
          {
            path: "account",
            Component: connectedAuth ? ConnectedAccount : AccountPage,
          },

          { path: "notifications", Component: NotificationsPage },
          { path: "shop", Component: ShopPage },
          { path: "shop/orders", element: <CommerceOrders /> },
          { path: "shop/:id", Component: ProductDetailPage },
          { path: "lifestyle", Component: LifestylePage },
          { path: "lifestyle/:id", Component: LifestyleArticlePage },
          { path: "about", Component: StaticPage },
          { path: "newsletter/confirm", Component: NewsletterAction },
          { path: "newsletter/unsubscribe", Component: NewsletterAction },
          {
            path: "contact",
            Component:
              import.meta.env.VITE_API_MODE === "connected"
                ? ConnectedContact
                : StaticPage,
          },
          { path: "privacy", Component: StaticPage },
          { path: "terms", Component: StaticPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);

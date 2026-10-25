import CareersPage from "@/pages/CareersPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import RouteErrorView from "@/components/shared/RouteErrorView";
import {ConnectedContact} from "@/pages/ConnectedContact";
import {NewsletterAction} from "@/pages/NewsletterAction";
import {CommerceOrders} from "@/pages/CommerceOrders";
import {SportsProvider} from "@/context/SportsContext";
import {SportsWatchPage} from "@/pages/SportsWatchPage";
import {ConnectedLibraryDetail} from "@/pages/ConnectedMusicLibrary";
import { EventsProvider } from "@/context/EventsContext";
import { MusicAudioProvider } from "@/context/MusicAudioContext";
import { MusicProvider } from "@/context/MusicContext";
import { ShowsProvider } from "@/context/ShowsContext";
import { EpisodeWatchPage } from "@/pages/EpisodeWatchPage";
import ConnectedAuth from "@/pages/auth/ConnectedAuth";
import { MovieProvider } from "@/context/MovieContext";
import ConnectedAccount from "@/pages/auth/ConnectedAccount";
import { connectedAuth } from "@/lib/customerAuth";
import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PlaybackLayout } from "@/components/player/AudioMiniPlayer";
import { TrackDetailPage } from "@/pages/TrackDetailPage";
import { EventWatchPage } from "@/pages/EventWatchPage";
import { ContentBoundary } from "@/components/shared/ContentBoundary";
import { PersonalActionNotice } from "@/components/shared/PersonalActionNotice";

// Main app pages
import { HomePage } from "@/pages/HomePage";
import { ShowsPage } from "@/pages/ShowsPage";
import { ShowDetailPage } from "@/pages/ShowDetailPage";
import { MoviesPage } from "@/pages/MoviesPage";
import { MovieDetailPage } from "@/pages/MovieDetailPage";
import { MusicPage } from "@/pages/MusicPage";
import { ArtistProfilePage } from "@/pages/ArtistProfilePage";
import { MusicVideoPage } from "@/pages/MusicVideoPage";
import { PlaylistPage } from "@/pages/PlaylistPage";
import { SportsPage } from "@/pages/SportsPage";
import { SportsDetailPage } from "@/pages/SportsDetailPage";
import { LifestyleArticlePage } from "@/pages/LifestyleArticlePage";
import { NewsPage } from "@/pages/NewsPage";
import { NewsArticlePage } from "@/pages/NewsArticlePage";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { MGTVPlusPage } from "@/pages/MGTVPlusPage";
import { AccountPage } from "@/pages/AccountPage";
import { ProfilesPage } from "@/pages/ProfilesPage";
import { ParentalControlsPage } from "@/pages/ParentalControlsPage";
import { SearchPage } from "@/pages/SearchPage";
import { WatchPage } from "@/pages/WatchPage";
import { MyListPage } from "@/pages/MyListPage";
import { AwardsPage } from "@/pages/AwardsPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { LifestylePage } from "@/pages/LifestylePage";
import { StaticPage } from "@/pages/StaticPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Auth pages
import { AuthLandingPage } from "@/pages/auth/AuthLandingPage";
import { SignInPage } from "@/pages/auth/SignInPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { VerifyEmailPage } from "@/pages/auth/VerifyEmailPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";

// Profile creation
import { CreateProfilePage } from "@/pages/profiles/CreateProfilePage";

function MainLayout() {
  return (
    <div className="min-h-full bg-[#0A0A0A]">
      <Navbar />
      <PersonalActionNotice />
      <ContentBoundary>
        <Outlet />
      </ContentBoundary>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    errorElement:<RouteErrorView/>,

    Component: () => (
      <SportsProvider><MovieProvider>
        <ShowsProvider>
          <MusicProvider>
            <EventsProvider>
              <MusicAudioProvider>
                <PlaybackLayout />
              </MusicAudioProvider>
            </EventsProvider>
          </MusicProvider>
        </ShowsProvider>
      </MovieProvider></SportsProvider>
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
        Component: connectedAuth ? ConnectedAccount : CreateProfilePage,
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
          { path: "music/artist/:id", Component: ArtistProfilePage },
          { path: "music/album/:id", Component: ()=> <ConnectedLibraryDetail kind="albums"/> },
          { path: "music/video/:id", Component: MusicVideoPage },
          { path: "music/track/:id", Component: TrackDetailPage },
          { path: "music/playlist/:id", Component: PlaylistPage },
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
          {
            path: "profiles",
            Component: connectedAuth ? ConnectedAccount : ProfilesPage,
          },
          {
            path: "parental-controls",
            Component: connectedAuth ? ConnectedAccount : ParentalControlsPage,
          },
          { path: "notifications", Component: NotificationsPage },
          { path: "shop", Component: ShopPage },
          { path: "shop/orders", element: <CommerceOrders/> },
      { path: "shop/:id", Component: ProductDetailPage },
          { path: "lifestyle", Component: LifestylePage },
          { path: "lifestyle/:id", Component: LifestyleArticlePage },
          { path: "about", Component: StaticPage },
          {path:"newsletter/confirm",Component:NewsletterAction},
{path:"newsletter/unsubscribe",Component:NewsletterAction},
{ path: "contact", Component: (import.meta.env.VITE_API_MODE === "connected" ? ConnectedContact : StaticPage) },
          { path: "privacy", Component: StaticPage },
          { path: "terms", Component: StaticPage },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);

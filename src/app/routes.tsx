import { createBrowserRouter, Outlet } from 'react-router'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthLayout } from '@/components/auth/AuthLayout'

// Main app pages
import { HomePage } from '@/pages/HomePage'
import { ShowsPage } from '@/pages/ShowsPage'
import { ShowDetailPage } from '@/pages/ShowDetailPage'
import { MoviesPage } from '@/pages/MoviesPage'
import { MovieDetailPage } from '@/pages/MovieDetailPage'
import { MusicPage } from '@/pages/MusicPage'
import { ArtistProfilePage } from '@/pages/ArtistProfilePage'
import { MusicVideoPage } from '@/pages/MusicVideoPage'
import { PlaylistPage } from '@/pages/PlaylistPage'
import { SportsPage } from '@/pages/SportsPage'
import { NewsPage } from '@/pages/NewsPage'
import { NewsArticlePage } from '@/pages/NewsArticlePage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { MGTVPlusPage } from '@/pages/MGTVPlusPage'
import { AccountPage } from '@/pages/AccountPage'
import { ProfilesPage } from '@/pages/ProfilesPage'
import { ParentalControlsPage } from '@/pages/ParentalControlsPage'
import { SearchPage } from '@/pages/SearchPage'
import { WatchPage } from '@/pages/WatchPage'
import { MyListPage } from '@/pages/MyListPage'
import { AwardsPage } from '@/pages/AwardsPage'
import { NotificationsPage } from '@/pages/NotificationsPage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { LifestylePage } from '@/pages/LifestylePage'
import { StaticPage } from '@/pages/StaticPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Auth pages
import { AuthLandingPage } from '@/pages/auth/AuthLandingPage'
import { SignInPage } from '@/pages/auth/SignInPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'

// Profile creation
import { CreateProfilePage } from '@/pages/profiles/CreateProfilePage'

function MainLayout() {
  return (
    <div className="min-h-full bg-[#0A0A0A]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export const router = createBrowserRouter([
  // Auth routes — cinematic split layout, no Navbar/Footer
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { index: true, Component: AuthLandingPage },
      { path: 'sign-in', Component: SignInPage },
      { path: 'register', Component: RegisterPage },
      { path: 'verify-email', Component: VerifyEmailPage },
      { path: 'forgot-password', Component: ForgotPasswordPage },
      { path: 'reset-password', Component: ResetPasswordPage },
    ],
  },

  // Profile creation — standalone (no footer, minimal chrome)
  { path: '/profiles/create', Component: CreateProfilePage },

  // Main app — Navbar + Footer wrapper
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'shows', Component: ShowsPage },
      { path: 'shows/:id', Component: ShowDetailPage },
      { path: 'movies', Component: MoviesPage },
      { path: 'movies/:id', Component: MovieDetailPage },
      { path: 'music', Component: MusicPage },
      { path: 'music/artist/:id', Component: ArtistProfilePage },
      { path: 'music/video/:id', Component: MusicVideoPage },
      { path: 'music/playlist/:id', Component: PlaylistPage },
      { path: 'sports', Component: SportsPage },
      { path: 'news', Component: NewsPage },
      { path: 'news/:id', Component: NewsArticlePage },
      { path: 'events', Component: EventsPage },
      { path: 'events/:id', Component: EventDetailPage },
      { path: 'mgtv-plus', Component: MGTVPlusPage },
      { path: 'search', Component: SearchPage },
      { path: 'watch/:id', Component: WatchPage },
      { path: 'my-list', Component: MyListPage },
      { path: 'awards', Component: AwardsPage },
      { path: 'account', Component: AccountPage },
      { path: 'profiles', Component: ProfilesPage },
      { path: 'parental-controls', Component: ParentalControlsPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'shop', Component: ShopPage },
      { path: 'shop/:id', Component: ProductDetailPage },
      { path: 'lifestyle', Component: LifestylePage },
      { path: 'about', Component: StaticPage },
      { path: 'contact', Component: StaticPage },
      { path: 'privacy', Component: StaticPage },
      { path: 'terms', Component: StaticPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppShell from './components/Layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/constants';
import Loader from './components/ui/Loader';

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Seeker Pages
const JobFeedPage = lazy(() => import('./pages/seeker/JobFeedPage'));
const JobDetailPage = lazy(() => import('./pages/seeker/JobDetailPage'));
const MatchPage = lazy(() => import('./pages/seeker/MatchPage'));
const TailorResumePage = lazy(() => import('./pages/seeker/TailorResumePage'));
const ProfilePage = lazy(() => import('./pages/seeker/ProfilePage'));
const CoursesPage = lazy(() => import('./pages/seeker/CoursesPage'));

// Provider Pages
const CreateJobPage = lazy(() => import('./pages/provider/CreateJobPage'));
const MyListingsPage = lazy(() => import('./pages/provider/MyListingsPage'));

// Admin Pages
const ControlTowerPage = lazy(() => import('./pages/admin/ControlTowerPage'));
const IngestionPage = lazy(() => import('./pages/admin/IngestionPage'));
const HelpDeskPage = lazy(() => import('./pages/admin/HelpDeskPage'));

// Chat
const ChatPage = lazy(() => import('./pages/chat/ChatPage'));

// Shared
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const BlogLandingPage = lazy(() => import('./pages/public/BlogLandingPage'));
const BlogPostPage = lazy(() => import('./pages/public/BlogPostPage'));
const MarketPage = lazy(() => import('./pages/provider/MarketPage'));

// Landing Page
const LandingPage = lazy(() => import('./pages/public/LandingPage'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullScreen />}>
        <AuthProvider>
          <Routes>
            {/* Landing Page — standalone, outside AppShell */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes wrapped in AppShell */}
            <Route element={<AppShell />}>

              {/* Anyone can view jobs? Requirements say public feed is possible, 
                  but usually we want them logged in. 
                  Docs say: GET /jobs/feed is public (Auth ✗).
                  So /jobs should be accessible without auth?
                  But AppShell has a User dropdown that handles logged in/out state.
                  Let's make /jobs public but with a specialized Navbar state.
              */}
              {/* Public but with AppShell */}
              <Route path="/blogs" element={<BlogLandingPage />} />
              <Route path="/blogs/:slug" element={<BlogPostPage />} />

              {/* Protected Routes */}
              <Route path="/market-intelligence" element={
                <ProtectedRoute>
                  <MarketPage />
                </ProtectedRoute>
              } />

              <Route path="/jobs" element={<JobFeedPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />

              {/* Protected: Seeker Only */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.SEEKER]} />}>
                <Route path="/jobs/:id/match" element={<MatchPage />} />
                <Route path="/jobs/:id/tailor" element={<TailorResumePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/chat" element={<ChatPage />} />
              </Route>

              {/* Protected: Provider Only */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.PROVIDER]} />}>
                <Route path="/provider/create" element={<CreateJobPage />} />
                <Route path="/provider/listings" element={<MyListingsPage />} />
              </Route>

              {/* Protected: Admin Only */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/admin/tower" element={<ControlTowerPage />} />
                <Route path="/admin/ingest" element={<IngestionPage />} />
                <Route path="/admin/helpdesk" element={<HelpDeskPage />} />
              </Route>

            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

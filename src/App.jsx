import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import AppShell from './components/Layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/constants';
import Loader from './components/ui/Loader';

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const AdminLoginPage = lazy(() => import('./pages/auth/AdminLoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Seeker Pages
const JobFeedPage = lazy(() => import('./pages/seeker/JobFeedPage'));
const JobDetailPage = lazy(() => import('./pages/seeker/JobDetailPage'));
const MatchPage = lazy(() => import('./pages/seeker/MatchPage'));
const TailorResumePage = lazy(() => import('./pages/seeker/TailorResumePage'));
const ProfilePage = lazy(() => import('./pages/seeker/ProfilePage'));
const SavedJobsPage = lazy(() => import('./pages/seeker/SavedJobsPage'));
const CoursesPage = lazy(() => import('./pages/seeker/CoursesPage'));
const MockInterviewPage = lazy(() => import('./pages/seeker/MockInterviewPage'));
const InterviewReviewsPage = lazy(() => import('./pages/seeker/InterviewReviewsPage'));

// Provider Pages
const CreateJobPage = lazy(() => import('./pages/provider/CreateJobPage'));
const MyListingsPage = lazy(() => import('./pages/provider/MyListingsPage'));

// Admin Pages
const ControlTowerPage = lazy(() => import('./pages/admin/ControlTowerPage'));
const IngestionPage = lazy(() => import('./pages/admin/IngestionPage'));
const HelpDeskPage = lazy(() => import('./pages/admin/HelpDeskPage'));
const AdminInterviewReviewsPage = lazy(() => import('./pages/admin/InterviewReviewsPage'));

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
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Suspense fallback={<Loader fullScreen variant="logo" />}>
            <Routes>
              {/* Landing Page — standalone, outside AppShell */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes wrapped in AppShell */}
              <Route element={<AppShell />}>

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
                  <Route path="/jobs/:id/mock-interview" element={<MockInterviewPage />} />
                  <Route path="/mock-interview" element={<MockInterviewPage />} />
                  <Route path="/interview-reviews" element={<InterviewReviewsPage />} />
                  <Route path="/saved" element={<SavedJobsPage />} />
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
                  <Route path="/admin/interview-reviews" element={<AdminInterviewReviewsPage />} />
                </Route>

              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

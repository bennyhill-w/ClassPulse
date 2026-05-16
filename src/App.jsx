import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// ── AUTH PAGES ───────────────────────────────────────────────────
import SplashPage   from './pages/auth/SplashPage'
import LoginPage    from './pages/auth/LoginPage'
import SignupPage   from './pages/auth/SignupPage'

// ── TEACHER PAGES ────────────────────────────────────────────────
import TeacherLayout  from './components/layout/TeacherLayout'
import CheckInPage    from './pages/teacher/CheckInPage'
import HomePage       from './pages/teacher/HomePage'
import SchedulePage   from './pages/teacher/SchedulePage'
import HistoryPage    from './pages/teacher/HistoryPage'
import ProfilePage    from './pages/teacher/ProfilePage'

// ── ADMIN PAGES ──────────────────────────────────────────────────
import AdminApp         from './pages/admin/AdminApp'
import OverviewPage     from './pages/admin/OverviewPage'
import LiveMonitorPage  from './pages/admin/LiveMonitorPage'
import TeachersPage     from './pages/admin/TeachersPage'
import ActiveClassesPage from './pages/admin/ActiveClassesPage'
import ReportsPage      from './pages/admin/ReportsPage'
import AnalyticsPage    from './pages/admin/AnalyticsPage'
import AlertsPage       from './pages/admin/AlertsPage'
import SettingsPage     from './pages/admin/SettingsPage'

// ── PROTECTED ROUTE ──────────────────────────────────────────────
function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/login" replace />
  return children
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ─────────────────────────────────────────── */}
        <Route path="/"       element={<SplashPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ── TEACHER ────────────────────────────────────────── */}
        <Route path="/teacher" element={
          <ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="/teacher/home" replace />} />
          <Route path="checkin"  element={<CheckInPage />} />
          <Route path="home"     element={<HomePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="history"  element={<HistoryPage />} />
          <Route path="profile"  element={<ProfilePage />} />
        </Route>

        {/* ── ADMIN ──────────────────────────────────────────── */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminApp /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview"  element={<OverviewPage />} />
          <Route path="monitor"   element={<LiveMonitorPage />} />
          <Route path="teachers"  element={<TeachersPage />} />
          <Route path="classes"   element={<ActiveClassesPage />} />
          <Route path="reports"   element={<ReportsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="alerts"    element={<AlertsPage />} />
          <Route path="settings"  element={<SettingsPage />} />
        </Route>

        {/* ── FALLBACK ───────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
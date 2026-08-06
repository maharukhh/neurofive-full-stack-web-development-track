import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TeamsPage from './pages/TeamsPage'
import RunsPage from './pages/RunsPage'
import RunDetailPage from './pages/RunDetailPage'

// Recharts is the heaviest dependency in the app — only the dashboard
// route needs it, so it's split into its own chunk.
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="container"><p className="state-banner">Loading dashboard…</p></div>}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={<ProtectedRoute><TeamsPage /></ProtectedRoute>}
          />
          <Route
            path="/runs"
            element={<ProtectedRoute><RunsPage /></ProtectedRoute>}
          />
          <Route
            path="/runs/:id"
            element={<ProtectedRoute><RunDetailPage /></ProtectedRoute>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

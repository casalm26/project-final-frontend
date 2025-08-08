import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { ToastNotifications } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { KeepAliveProvider } from './components/KeepAliveProvider';

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(module => ({ default: module.MapPage })));
const ExportPage = lazy(() => import('./pages/ExportPage').then(module => ({ default: module.ExportPage })));
const TreeDetailPage = lazy(() => import('./pages/TreeDetailPage').then(module => ({ default: module.TreeDetailPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const NotFoundPage = lazy(() => import('./pages/ErrorPages').then(module => ({ default: module.NotFoundPage })));

export const App = () => {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <DarkModeProvider>
          <ToastProvider>
            <AuthProvider>
              <KeepAliveProvider>
                <Suspense fallback={<LoadingSpinner fullscreen text="Loading page..." />}>
                {/* Skip link for keyboard users */}
                <a href="#main-content" className="skip-link">Skip to content</a>

                <Routes>
                  <Route path="/" element={<main id="main-content" tabIndex="-1"><LandingPage /></main>} />
                  <Route path="/login" element={<main id="main-content" tabIndex="-1"><LoginPage /></main>} />
                  <Route path="/register" element={<main id="main-content" tabIndex="-1"><RegisterPage /></main>} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><DashboardPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/map" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><MapPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/export" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><ExportPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/tree/:id" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><TreeDetailPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><AdminPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<main id="main-content" tabIndex="-1"><NotFoundPage /></main>} />
                </Routes>
                </Suspense>
                <ToastNotifications />
              </KeepAliveProvider>
            </AuthProvider>
          </ToastProvider>
        </DarkModeProvider>
      </Router>
    </ErrorBoundary>
  );
};

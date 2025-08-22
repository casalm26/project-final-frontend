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
const OverviewDashboardPage = lazy(() => import('./pages/OverviewDashboardPage').then(module => ({ default: module.OverviewDashboardPage })));
const FinancialDashboardPage = lazy(() => import('./pages/FinancialDashboardPage').then(module => ({ default: module.FinancialDashboardPage })));
const EcologicalDashboardPage = lazy(() => import('./pages/EcologicalDashboardPage').then(module => ({ default: module.EcologicalDashboardPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(module => ({ default: module.MapPage })));
const ExportPage = lazy(() => import('./pages/ExportPage').then(module => ({ default: module.ExportPage })));
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
                        <main id="main-content" tabIndex="-1"><OverviewDashboardPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/financial" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><FinancialDashboardPage /></main>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard/ecological" 
                    element={
                      <ProtectedRoute>
                        <main id="main-content" tabIndex="-1"><EcologicalDashboardPage /></main>
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

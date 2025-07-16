import { Navigate } from 'react-router-dom';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import LoadingSpinner from '../ui/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <LoadingSpinner 
        text="Authenticating..." 
        fullscreen={true}
        size="48px"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}; 
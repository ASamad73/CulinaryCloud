import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAuthenticated, isGuest }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
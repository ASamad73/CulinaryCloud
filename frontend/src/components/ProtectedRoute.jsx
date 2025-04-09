import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAuthenticated, isGuest }) {
  if (!isAuthenticated) {
    alert("Please sign up or continue as guest!");
    return <Navigate to="/" replace />;
  }
  return children;
}
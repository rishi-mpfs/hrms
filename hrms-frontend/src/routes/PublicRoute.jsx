// src/routes/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (user) {
    if (user.role === 'admin' || user.role === 'hr') {
      return <Navigate to="/admin" />;
    } else if (user.role === 'employee') {
      return <Navigate to="/employee" />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children; // Not logged in, allow access
};

export default PublicRoute;

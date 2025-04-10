// src/routes/RedirectHome.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const RedirectHome = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin' || user.role === 'hr') {
    return <Navigate to="/admin" />;
  }

  if (user.role === 'employee') {
    return <Navigate to="/employee" />;
  }

  return <Navigate to="/unauthorized" />;
};

export default RedirectHome;

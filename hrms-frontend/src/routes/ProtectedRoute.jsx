import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
  
    console.log('loading:', loading);
    console.log('user:', user);
  
    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <p>Access Denied</p>;
  
    return children;
  };

export default ProtectedRoute;

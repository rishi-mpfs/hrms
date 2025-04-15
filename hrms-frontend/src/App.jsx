import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import RedirectHome from './routes/RedirectHome';
import Login from './pages/auth/Login';
import AdminRoutes from './routes/AdminRoutes';
import EmployeeRoutes from './routes/EmployeeRoutes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route path="/" element={<RedirectHome />} />

          {/* ✅ Wrap AdminRoutes inside ProtectedRoute */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin', 'hr']}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
           <Route
            path="/employee/*"
            element={
              <ProtectedRoute roles={['employee']}>
                <EmployeeRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

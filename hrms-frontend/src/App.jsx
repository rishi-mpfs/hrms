import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute'; // ✅ added
import RedirectHome from './routes/RedirectHome'; // ✅ added
import Login from './pages/auth/Login';
import AdminRoutes from './routes/AdminRoutes';
import EmployeeRoutes from './routes/EmployeeRoutes';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PublicRoute blocks logged-in users from accessing /login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Redirect from base route based on role */}
          <Route path="/" element={<RedirectHome />} />

          {/* Admin Role Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin', 'hr']}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* Employee Role Protected Routes */}
          <Route
            path="/employee/*"
            element={
              <ProtectedRoute roles={['employee']}>
                <EmployeeRoutes />
              </ProtectedRoute>
            }
          />

          {/* Optional fallback */}
          {/* <Route path="*" element={<p>Page Not Found</p>} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

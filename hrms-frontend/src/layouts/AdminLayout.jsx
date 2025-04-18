import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';
import logo from './../assets/logo.png';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaEnvelopeOpenText,
  FaMoneyCheckAlt,
  FaBuilding
} from 'react-icons/fa';
import { useAuth } from '../context/AuthProvider'; // ✅

const AdminLayout = () => {
  const { user, logout } = useAuth(); // ✅

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div>
          <img src={logo} alt="Logo" className="nav-logo" />
          <nav className="nav-links">
            <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
              <FaTachometerAlt className="nav-icon" /> Dashboard
            </NavLink>
            <NavLink to="/admin/employees" className={({ isActive }) => isActive ? "active" : ""}>
              <FaUsers className="nav-icon" /> Employees
            </NavLink>
            <NavLink to="/admin/attendance" className={({ isActive }) => isActive ? "active" : ""}>
              <FaCalendarCheck className="nav-icon" /> Attendance
            </NavLink>
            <NavLink to="/admin/leave" className={({ isActive }) => isActive ? "active" : ""}>
              <FaEnvelopeOpenText className="nav-icon" /> Leave
            </NavLink>
            <NavLink to="/admin/payroll" className={({ isActive }) => isActive ? "active" : ""}>
              <FaMoneyCheckAlt className="nav-icon" /> Payroll
            </NavLink>
            <NavLink to="/admin/department" className={({ isActive }) => isActive ? "active" : ""}>
              <FaBuilding className="nav-icon" /> Department
            </NavLink>
          </nav>
        </div>

        {/* ✅ Show username and logout button */}
        <div>
          {user && <h1 className="sidebar-username">Welcome, {user.name}</h1>}
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

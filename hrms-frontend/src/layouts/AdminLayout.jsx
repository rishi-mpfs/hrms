import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css'; // Your custom styles

const AdminLayout = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="nav-links">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/employees">Employees</Link>
          <Link to="/admin/attendance">Attendance</Link>
          <Link to="/admin/payroll">Payroll</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

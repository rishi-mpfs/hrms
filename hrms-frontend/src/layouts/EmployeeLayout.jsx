import { Link, Outlet } from 'react-router-dom';
import './AdminLayout.css'; // Your custom styles

const EmployeeLayout = () => {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="nav-links">
          <Link to="/employee">Dashboard</Link>
          <Link to="/employee/employees">Employees</Link>
          <Link to="/employee/attendance">Attendance</Link>
          <Link to="/employee/payroll">Payroll</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default EmployeeLayout
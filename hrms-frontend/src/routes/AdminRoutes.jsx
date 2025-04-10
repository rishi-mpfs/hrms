import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import Admindashboard from '../pages/admin/Admindashboard';
import Payroll from '../pages/admin/Payroll';

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Admindashboard />} />
        {/* <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} /> */}
        <Route path="payroll" element={<Payroll />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;

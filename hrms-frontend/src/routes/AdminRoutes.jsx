import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import Admindashboard from '../pages/admin/Admindashboard';
import AdminEmployee from '../pages/admin/AdminEmployee';
import Payroll from '../pages/admin/Payroll';
import AdminEmployeedetails from '../pages/admin/AdminEmployeedetails';
import AddEmployee from '../pages/admin/AddEmployee';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* ✅ AdminLayout acts as a layout route */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Admindashboard />} />
        <Route path="employees" element={<AdminEmployee />} />
        <Route path="employee/:id" element={<AdminEmployeedetails />} />
        <Route path="employee/add" element={<AddEmployee />} />
        <Route path="payroll" element={<Payroll />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;

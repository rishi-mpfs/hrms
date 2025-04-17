import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';

import Admindashboard from '../pages/admin/Admindashboard';
import AdminEmployee from '../pages/admin/AdminEmployee';
import Payroll from '../pages/admin/Payroll';
import AdminEmployeedetails from '../pages/admin/AdminEmployeedetails';
import AddEmployee from '../pages/admin/AddEmployee';
import AdminAttendanceSummary from '../pages/admin/attendance/AdminAttendanceSummary';
import AdminUserAttendanceDetail from '../pages/admin/attendance/AdminUserAttendanceDetail';
import AdminDepartmentManagement from '../pages/admin/deparments/AdminDepartmentManagement';
import AdminLeavePage from '../pages/admin/leave/AdminLeavePage';
import PayslipPage from '../pages/admin/payroll/PayslipPage';
import PayrollList from '../pages/admin/payroll/PayrollList';
import GeneratePayroll from '../pages/admin/payroll/GeneratePayroll';


const AdminRoutes = () => {
  return (
    <Routes>
      {/* ✅ AdminLayout acts as a layout route */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Admindashboard />} />
        <Route path="employees" element={<AdminEmployee />} />
        <Route path="employee/:id" element={<AdminEmployeedetails />} />
        <Route path="employee/add" element={<AddEmployee />} />
        <Route path="payroll" element={<PayrollList />} />
        <Route path="attendance" element={<AdminAttendanceSummary />} />
        <Route path="attendance-detail/:userId/:month" element={<AdminUserAttendanceDetail/>} />
        <Route path='department' element={<AdminDepartmentManagement/>} />
        <Route path='leave' element={<AdminLeavePage/>} />
        <Route path="generatepayroll/:userId/:month/:year" element={<GeneratePayroll />} />

        <Route path='payslip/:id' element={<PayslipPage/>} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;

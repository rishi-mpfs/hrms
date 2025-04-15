import { Routes, Route } from 'react-router-dom';
import EmployeeLayout from '../layouts/EmployeeLayout';

import EmployeeDashboard from '../pages/employee/UserDashboard';
import Leave from '../pages/employee/UserLeavePage';
import UserDashboard from '../pages/employee/UserDashboard';
import UserMonthlyAttendance from '../pages/employee/UserMonthlyAttendance';
import UserLeavePage from '../pages/employee/UserLeavePage';

const EmployeeRoutes = () => {
  return (
    
      <Routes >
        <Route path="/" element={<EmployeeLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="attendance" element={<UserMonthlyAttendance />} />

        {/* <Route path="attendance" element={<MyAttendance />} /> */}
        <Route path="leaves" element={<UserLeavePage />} />
        {/* <Route path="payslip" element={<Payslip />} /> */}
        </Route>
      </Routes>
    
  );
};

export default EmployeeRoutes;

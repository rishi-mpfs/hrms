import { Routes, Route } from 'react-router-dom';
import EmployeeLayout from '../layouts/EmployeeLayout';

import EmployeeDashboard from '../pages/employee/Employeedashboard';
import Leave from '../pages/employee/Leave';

const EmployeeRoutes = () => {
  return (
    <EmployeeLayout>
      <Routes>
        <Route path="/" element={<Employeed />} />
        {/* <Route path="attendance" element={<MyAttendance />} /> */}
        <Route path="leaves" element={<Leave />} />
        {/* <Route path="payslip" element={<Payslip />} /> */}
      </Routes>
    </EmployeeLayout>
  );
};

export default EmployeeRoutes;

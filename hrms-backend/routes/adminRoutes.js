const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const departmentController = require('../controllers/departmentController');
const attendanceController = require('../controllers/attendanceController')
const leaveController = require('../controllers/leaveController')
const payrollController = require('../controllers/payrollController')


const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['admin']));
// Protect these with middleware (admin-only)
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.get('/employeecount',userController.getEmployeeCount);

router.post('/department', departmentController.createDepartment);
router.get('/department', departmentController.getAllDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.put('/department/:id', departmentController.updateDepartment);
router.delete('/department/:id', departmentController.deleteDepartment);

router.get('/attendance/:month',attendanceController.getAllUsersAttendanceSummary);
router.get('/attendence/:userId/month',attendanceController.getUserMonthlyAttendance);
router.put('/attendance/:id',attendanceController.updateAttendance);
router.get('/attendancestates',attendanceController.getTodayAttendanceStats);
// router.get('/attendance/user/:userId',attendanceController.getMyMonthlyAttendance);

router.get('/leaves',leaveController.getAllLeaves);
router.put('/leave/:id',leaveController.updateLeaveStatus);
router.get('/leave-pendingcount',leaveController.getPendingLeaveCount);

router.get('/payroll', payrollController.getPayrollGenerationStatus);
router.post('/payroll',payrollController.generatePayroll);
router.put('/payroll/:id',payrollController.updatePayrollStatus);
router.get('/payroll/userdetail/:userId/:month/:year',payrollController.getPayrollUserDetails);

// router.get('/payroll/initiate', payrollController.initiatePayrollView);
// router.post('/payroll/bulkgenerate',payrollController.generateBulkPayroll);
// router.post('/payroll/generate',payrollController.generatePayroll);
// router.put('/payroll/status/:id',payrollController.updatePayrollStatus);
// router.get('/payslip/:id',payrollController.downloadPayslip);
module.exports = router;

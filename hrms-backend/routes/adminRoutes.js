const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const departmentController = require('../controllers/departmentController');
const attendanceController = require('../controllers/attendanceController')
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['admin']));
// Protect these with middleware (admin-only)
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

router.post('/department', departmentController.createDepartment);
router.get('/department', departmentController.getAllDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.put('/department/:id', departmentController.updateDepartment);
router.delete('/department/:id', departmentController.deleteDepartment);

router.get('/attendance/:month',attendanceController.getAllUsersAttendanceSummary);
router.get('/attendence/:userId/month',attendanceController.getUserMonthlyAttendance);
router.put('/attendance/:id',attendanceController.updateAttendance);
router.get('/attendance/user/:userId',attendanceController.getMyMonthlyAttendance);


module.exports = router;

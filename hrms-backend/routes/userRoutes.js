const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const departmentController = require('../controllers/departmentController');
const attendanceController = require('../controllers/attendanceController')
const leaveController = require('../controllers/leaveController')
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken, requireRole(['employee']));

router.get('/attendance/status', attendanceController.getTodayAttendanceStatus);
router.post('/checkin',attendanceController.checkIn);
router.post('/checkout',attendanceController.checkOut)
router.get('/attendance/:month',attendanceController.getMyMonthlyAttendance);

router.get('/leave',leaveController.getAppliedLeaves);
router.post('/leave',leaveController.applyLeave)
module.exports = router;
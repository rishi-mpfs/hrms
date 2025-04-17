const express = require('express');
const router = express.Router();

const payrollController = require('../controllers/payrollController');
const { verifyToken, requireRole } = require('../middleware/auth');
router.use(verifyToken, requireRole(['employee','admin']));

router.get('/payslip/:payrollId',payrollController.getPayrollSummary);

module.exports = router;
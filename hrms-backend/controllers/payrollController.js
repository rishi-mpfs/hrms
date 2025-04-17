// controllers/payrollController.js
const { Payroll, User, Attendance,Department } = require('../models');
const { Op } = require('sequelize');

// Get Payroll Generation Status
exports.getPayrollGenerationStatus = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and Year are required' });
  }

  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  if (isNaN(parsedMonth) || isNaN(parsedYear)) {
    return res.status(400).json({ error: 'Month and Year must be valid numbers' });
  }

  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'salary', 'accountNumber'],
    });

    const payrolls = await Payroll.findAll({
      where: { month: parsedMonth, year: parsedYear },
      attributes: ['id', 'userId', 'status'],
    });

    // Map payrolls by userId for quick lookup
    const payrollMap = new Map();
    payrolls.forEach(p => {
      payrollMap.set(p.userId, { payrollId: p.id, status: p.status });
    });

    const result = users.map(user => {
      const payroll = payrollMap.get(user.id);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        salary: user.salary,
        accountNumber: user.accountNumber,
        generated: !!payroll,
        status: payroll ? payroll.status : 'not generated',
        payrollId: payroll ? payroll.payrollId : null
      };
    });

    res.json({ month: parsedMonth, year: parsedYear, employees: result });

  } catch (error) {
    console.error('Error fetching payroll status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getPayrollUserDetails = async (req, res) => {
  try {
    const { userId, month, year } = req.params;

    // Fetch the user details (accountNumber, baseSalary)
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { accountNumber, salary: baseSalary, name, designation } = user;

    // Calculate rate per day (assuming 30 days in a month)
    const ratePerDay = baseSalary / 30;

    // Calculate the start and end of the month
    const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
    const endDate = new Date(year, month, 0); // Automatically handles the last day of the month

    // Get attendance records for the given user, month, and year
    const attendanceRecords = await Attendance.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.in]: ['present', 'late'] // Both present and late count as paydays
        }
      }
    });

    const payDays = attendanceRecords.length;

    // Respond with the user details, pay rate, and attendance data
    return res.status(200).json({
      userDetails: {
        id: user.id,
        name,
        accountNumber,
        designation,
        baseSalary,
        ratePerDay,
        payDays,
      }
    });
  } catch (error) {
    console.error('Error fetching payroll user details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate Payroll
exports.generatePayroll = async (req, res) => {
  try {
    const {
      userId,
      month,
      year,
      accountNumber,
      baseSalary,
      ratePerDay,
      payDays,
      specialAllowance = 0,
      mobileAllowance = 0,
      travelAllowance = 0,
      houseAllowance = 0,
      incentive = 0,
      deduction = 0,
      taxDeduction = 0,
      grossPay,
      netPay,
      paymentMode,
    } = req.body;

    // Check if payroll already exists
    const existing = await Payroll.findOne({ where: { userId, month, year } });
    if (existing) {
      return res.status(400).json({ error: 'Payroll already generated for this user in the given month' });
    }

    const status = 'unpaid';

    const payroll = await Payroll.create({
      userId,
      month,
      year,
      accountNumber,
      baseSalary,
      ratePerDay,
      payDays,
      specialAllowance,
      mobileAllowance,
      travelAllowance,
      houseAllowance,
      incentive,
      deduction,
      taxDeduction,
      grossPay,
      netPay,
      paymentMode,
      status,
      generated: true
    });

    res.status(201).json({ message: 'Payroll generated successfully', payroll });
  } catch (error) {
    console.error('Payroll generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Optional: Update payroll status to 'paid' after payment
exports.updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required in the request body' });
    }

    const payroll = await Payroll.findByPk(id);

    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }

    payroll.status = status;
    await payroll.save();

    res.status(200).json({
      message: `Payroll status updated to "${status}"`,
      payroll
    });
  } catch (error) {
    console.error('Error updating payroll status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getPayrollSummary = async (req, res) => {
  const { payrollId } = req.params;

  try {
    // Fetch payroll along with user info and department
    const payroll = await Payroll.findOne({
      where: { id: payrollId },
      include: {
        model: User,
        attributes: ['id', 'name', 'email', 'designation', 'accountNumber'],
        include: {
          model: Department,
          attributes: ['name']
        }
      }
    });

    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }

    const { userId, month, year } = payroll;

    // Define the start and end of the month
    const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
    const endDate = new Date(year, month, 0);

    // Count present/late days
    const payDaysCount = await Attendance.count({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
        status: {
          [Op.in]: ['present', 'late']
        }
      }
    });

    res.status(200).json({
      user: {
        id: payroll.User.id,
        name: payroll.User.name,
        email: payroll.User.email,
        designation: payroll.User.designation,
        department: payroll.User.Department?.name || null,
        accountNumber: payroll.User.accountNumber
      },
      payroll: {
        id: payroll.id,
        month: payroll.month,
        year: payroll.year,
        accountNumber: payroll.accountNumber,
        baseSalary: payroll.baseSalary,
        ratePerDay: payroll.ratePerDay,
        payDays: payDaysCount,
        specialAllowance: payroll.specialAllowance,
        mobileAllowance: payroll.mobileAllowance,
        travelAllowance: payroll.travelAllowance,
        houseAllowance: payroll.houseAllowance,
        incentive: payroll.incentive,
        deduction: payroll.deduction,
        taxDeduction: payroll.taxDeduction,
        grossPay: payroll.grossPay,
        netPay: payroll.netPay,
        status: payroll.status,
        paymentMode: payroll.paymentMode
      }
    });

  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// ==========user========

// Get All Payrolls for a User (History)
exports.getUserPayrollHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Optional: validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch payroll history for user
    const payrolls = await Payroll.findAll({
      where: { userId },
      attributes: ['id', 'month', 'year', 'status'],
      order: [['year', 'DESC'], ['month', 'DESC']],
    });

    const result = payrolls.map(p => ({
      payrollId: p.id,
      month: p.month,
      year: p.year,
      status: p.status
    }));

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      payrollHistory: result
    });

  } catch (error) {
    console.error('Error fetching user payroll history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

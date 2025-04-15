// controllers/payrollController.js
// controllers/payrollController.js
const { Payroll, User } = require('../models');
const { Op } = require('sequelize');

exports.initiatePayrollView = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and Year are required' });
    }

    // Get all active users
    const users = await User.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'designation', 'salary']
    });

    // Fetch all payrolls for this month/year
    const payrolls = await Payroll.findAll({
      where: { month, year },
      include: { model: User, attributes: ['id'] }
    });

    // Create a mapping of userId => payroll
    const payrollMap = {};
    payrolls.forEach(p => {
      payrollMap[p.userId] = p;
    });

    // Prepare combined list
    const result = users.map(user => {
      const existing = payrollMap[user.id];
      if (existing) {
        return {
          id: existing.id,
          userId: user.id,
          name: user.name,
          designation: user.designation,
          baseSalary: existing.baseSalary,
          bonus: existing.bonus,
          deductions: existing.deductions,
          netSalary: existing.netSalary,
          status: existing.status,
          generated: true,
          generatedAt: existing.updatedAt
        };
      } else {
        return {
          userId: user.id,
          name: user.name,
          designation: user.designation,
          baseSalary: user.salary,
          bonus: 0,
          deductions: 0,
          netSalary: user.salary,
          status: 'unpaid',
          generated: false
        };
      }
    });

    res.json({ employees: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to prepare payroll list', details: err.message });
  }
};

// Fetch payroll list with details for all employees for a specific month and year
exports.getPayrollList = async (req, res) => {
    try {
      const { month, year } = req.query;
  
      if (!month || !year) {
        return res.status(400).json({ error: 'Month and Year are required' });
      }
  
      // Fetch payrolls for the given month and year
      const payrolls = await Payroll.findAll({
        where: { month, year },
        include: {
          model: User,
          attributes: ['id', 'name', 'designation']
        },
        order: [['createdAt', 'ASC']] // Order by creation date
      });
  
      // If no payroll records found
      if (payrolls.length === 0) {
        return res.status(404).json({ error: 'No payroll records found for this month/year' });
      }
  
      // Prepare payrolls list with generated flag
      const payrollsWithGeneratedStatus = payrolls.map(payroll => {
        return {
          id: payroll.id,
          user: payroll.User.name,
          designation: payroll.User.designation,
          salary: payroll.baseSalary,
          bonus: payroll.bonus || 0,
          deductions: payroll.deductions || 0,
          netSalary: payroll.netSalary,
          status: payroll.status,
          generated: payroll.generated, // include generated field
          generatedAt: payroll.updatedAt,
          canDownloadPayslip: payroll.generated, // Allow download if generated
        };
      });
  
      // Return payroll list with employee details and generated status
      res.json({ payrolls: payrollsWithGeneratedStatus });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch payroll records', details: err.message });
    }
  };
//   const { Payroll, User } = require('../../models'); // adjust as per your path

exports.generateBulkPayroll = async (req, res) => {
  const { month, year, bonuses = {}, deductions = {} } = req.body;

  try {
    const users = await User.findAll();

    for (let user of users) {
      const existing = await Payroll.findOne({
        where: {
          userId: user.id,
          month,
          year,
        },
      });

      if (existing) continue; // Skip already generated payrolls

      const baseSalary = user.salary || 30000;
      const bonus = bonuses[user.id] || 0;
      const deduction = deductions[user.id] || 0;
      const netSalary = baseSalary + bonus - deduction;

      await Payroll.create({
        userId: user.id,
        month,
        year,
        baseSalary,
        bonus,
        deductions: deduction,
        netSalary,
        status: 'unpaid',
      });
    }

    return res.status(200).json({ message: 'Bulk payroll generated successfully' });
  } catch (error) {
    console.error('Bulk payroll error:', error.message);
    return res.status(500).json({ error: 'Bulk payroll generation failed' });
  }
};

// controllers/admin/payrollController.js
// const { Payroll, User } = require('../../models');

exports.generatePayroll = async (req, res) => {
    const { userId, month, year, bonus, deductions } = req.body;
  
    try {
      // Check if payroll already exists
      const existing = await Payroll.findOne({
        where: {
          userId,
          month,
          year
        }
      });
  
      if (existing) {
        return res.status(400).json({ message: 'Payroll already generated for this user' });
      }
  
      // Get user base salary
      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const baseSalary = user.salary || 30000; // fallback
  
      const netSalary = baseSalary + (bonus || 0) - (deductions || 0);
  
      // Create payroll record
      const payroll = await Payroll.create({
        userId,
        month,
        year,
        baseSalary,
        bonus,
        deductions,
        netSalary,
        status: 'unpaid'
      });
  
      res.status(201).json({ message: 'Payroll generated successfully', payroll });
    } catch (err) {
      console.error('Generate payroll error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  // Generate payroll for a single user (or for all users for the given month/year)
//   exports.generatePayrollForUser = async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const { month, year } = req.body;
  
//       const user = await User.findByPk(userId);
//       if (!user) return res.status(404).json({ error: 'User not found' });
  
//       // Check if the payroll for the given month and year already exists
//       const exists = await Payroll.findOne({ where: { userId, month, year } });
//       if (exists && exists.generated) {
//         return res.status(400).json({ error: 'Payroll already generated for this user/month' });
//       }
  
//       const netSalary = user.salary;
  
//       const payroll = await Payroll.create({
//         userId,
//         month,
//         year,
//         baseSalary: user.salary,
//         bonus: 0,
//         deductions: 0,
//         netSalary,
//         status: 'unpaid',
//         generated: true, // Set generated to true
//       });
  
//       res.json({ message: 'Payroll generated', payroll });
//     } catch (err) {
//       res.status(500).json({ error: 'Failed to generate payroll', details: err.message });
//     }
//   };


  exports.updatePayrollStatus = async (req, res) => {
    try {
      const {id } = req.params;
      const { status } = req.body;
  
      if (!['paid', 'unpaid'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be paid or unpaid.' });
      }
  
      const payroll = await Payroll.findByPk(id);
      if (!payroll) return res.status(404).json({ error: 'Payroll record not found' });
  
      payroll.status = status;
      await payroll.save();
  
      res.json({ message: `Payroll marked as ${status}`, payroll });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status', details: err.message });
    }
  };
  // Controller to handle downloading payslip
  exports.downloadPayslip = async (req, res) => {
    try {
      const { id } = req.params;
  
      const payroll = await Payroll.findOne({
        where: { id },
        include: {
          model: User,
          attributes: ['name', 'email', 'phone', 'designation']
        }
      });
  
      if (!payroll || !payroll.User) {
        return res.status(404).json({ error: 'Payroll record or user not found' });
      }
  
      const { name, email, phone, designation, accountNumber} = payroll.User;
      const netPay = payroll.netSalary;
  
      const payslip = {
        employeeName: name,
        email,
        phone,
        accountNumber: `XXXXXX${accountNumber?.slice(-4) || '****'}`,
        designation,
        month: payroll.month,
        year: payroll.year,
        salary: payroll.baseSalary,
        bonus: payroll.bonus || 0,
        deductions: payroll.deductions || 0,
        netPay,
        status: payroll.status,
        generatedAt: payroll.updatedAt
      };
  
      // Create PDF or other format (this is a simple mock response for now)
      // You can use libraries like `pdfkit` or `html-pdf` for actual generation.
      res.json({ message: 'Payslip generated', payslip });
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate payslip', details: err.message });
    }
  };
  
const { Attendance, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// ===================== ADMIN CONTROLLERS ===================== //

// Get all users with attendance summary for a given month
exports.getAllUsersAttendanceSummary = async (req, res) => {
  try {
    const { month } = req.params; // <-- from path

    if (!month || !moment(month, 'YYYY-MM', true).isValid()) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
    }

    const startDate = moment(month, 'YYYY-MM').startOf('month').toDate();
    const endDate = moment(month, 'YYYY-MM').endOf('month').toDate();

    const users = await User.findAll({
      include: {
        model: Attendance,
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        required: false
      }
    });

    const result = users.map(user => {
      const presentCount = user.Attendances?.filter(a => a.status === 'present').length || 0;
      const absentCount = user.Attendances?.filter(a => a.status === 'absent').length || 0;
      const lateCount = user.Attendances?.filter(a => a.status === 'late').length || 0;

      return {
        userId: user.id,
        name: user.name,
        present: presentCount,
        absent: absentCount,
        late: lateCount
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance summary', details: err.message });
  }
};


// Get specific user's monthly attendance by ID and month
exports.getUserMonthlyAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.query;

    if (!month || !moment(month, 'YYYY-MM', true).isValid()) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
    }

    const startDate = moment(month, 'YYYY-MM').startOf('month').toDate();
    const endDate = moment(month, 'YYYY-MM').endOf('month').toDate();

    const records = await Attendance.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user attendance', details: err.message });
  }
};

// Admin can edit a specific attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // attendance record ID

    const updated = await Attendance.update(req.body, {
      where: { id }
    });

    res.json({ message: 'Attendance updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update attendance', details: err.message });
  }
};

// ===================== USER CONTROLLERS ===================== //

// User Check-in
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format('YYYY-MM-DD');

    const [attendance, created] = await Attendance.findOrCreate({
      where: { userId, date: today },
      defaults: {
        checkIn: moment().format('HH:mm:ss'),
        status: 'present',
        userId
      }
    });

    if (!created) {
      return res.status(400).json({ error: 'Already checked in' });
    }

    res.json({ message: 'Check-in successful', attendance });
  } catch (err) {
    res.status(500).json({ error: 'Check-in failed', details: err.message });
  }
};

// User Check-out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = moment().format('YYYY-MM-DD');

    const attendance = await Attendance.findOne({
      where: { userId, date: today }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No check-in found for today' });
    }

    attendance.checkOut = moment().format('HH:mm:ss');
    await attendance.save();

    res.json({ message: 'Check-out successful', attendance });
  } catch (err) {
    res.status(500).json({ error: 'Check-out failed', details: err.message });
  }
};

// User view own monthly attendance
exports.getMyMonthlyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.params;

    if (!month || !moment(month, 'YYYY-MM', true).isValid()) {
      return res.status(400).json({ error: 'Invalid month format. Use YYYY-MM' });
    }

    const startDate = moment(month, 'YYYY-MM').startOf('month').toDate();
    const endDate = moment(month, 'YYYY-MM').endOf('month').toDate();

    const records = await Attendance.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'ASC']]
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your attendance', details: err.message });
  }
};

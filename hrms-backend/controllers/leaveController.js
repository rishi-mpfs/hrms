const { Leave, User } = require('../models');

// --- USER CONTROLLERS ---

// View applied leaves for the logged-in user (optionally filtered by status)
exports.getAppliedLeaves = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const leaves = await Leave.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });
  
      res.json(leaves);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch applied leaves',
        details: error.message,
      });
    }
  };
  
// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      startDate,
      endDate,
      reason,
      userId,
    });

    res.status(201).json({ message: 'Leave applied successfully', leave });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply for leave', details: error.message });
  }
};

// View own leave applications
exports.getUserLeaves = async (req, res) => {
  try {
    const userId = req.user.id;

    const leaves = await Leave.findAll({ where: { userId }, order: [['startDate', 'DESC']] });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaves', details: error.message });
  }
};

// --- ADMIN CONTROLLERS ---

// View all leave applications
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: { model: User, attributes: ['id', 'name', 'email'] },
      order: [['createdAt', 'DESC']],
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leave applications', details: error.message });
  }
};

// Update leave status (approve/reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body; // status: approved or rejected

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const leave = await Leave.findByPk(leaveId);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = status;
    await leave.save();

    res.json({ message: 'Leave status updated', leave });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update leave status', details: error.message });
  }
};


// Count of pending leave approvals
exports.getPendingLeaveCount = async (req, res) => {
  try {
    const pendingCount = await Leave.count({
      where: { status: 'pending' },
    });

    res.json({ pendingCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending leave count', details: error.message });
  }
};

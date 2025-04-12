// models/index.js
const sequelize = require('../config/db');

const User = require('./User');
const Department = require('./Department');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');

// Associations
Department.hasMany(User, { foreignKey: 'departmentId' });
User.belongsTo(Department, { foreignKey: 'departmentId' });


User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Leave);
Leave.belongsTo(User);

User.hasMany(Payroll);
Payroll.belongsTo(User);

module.exports = {
  sequelize,
  User,
  Department,
  Attendance,
  Leave,
  Payroll
};

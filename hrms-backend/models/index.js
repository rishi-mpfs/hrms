const sequelize = require('../config/db');
const User = require('./User');
const Attendance = require('./Attendance');
const Leave = require('./Leave');
const Payroll = require('./Payroll');

User.hasMany(Attendance);
Attendance.belongsTo(User);

User.hasMany(Leave);
Leave.belongsTo(User);

User.hasMany(Payroll);
Payroll.belongsTo(User);

module.exports = { sequelize, User, Attendance, Leave, Payroll };
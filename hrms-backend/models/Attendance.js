const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
  date: { type: DataTypes.DATEONLY },
  checkIn: { type: DataTypes.TIME },
  checkOut: { type: DataTypes.TIME },
  status: { type: DataTypes.STRING }
});

module.exports = Attendance;
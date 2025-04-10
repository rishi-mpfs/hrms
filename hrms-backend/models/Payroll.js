const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payroll = sequelize.define('Payroll', {
  month: { type: DataTypes.STRING },
  year: { type: DataTypes.INTEGER },
  salary: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'unpaid' }
});

module.exports = Payroll;
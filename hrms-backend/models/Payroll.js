const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payroll = sequelize.define('Payroll', {
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  baseSalary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  bonus: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  deductions: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  netSalary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unpaid',
  },
  generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // default to false if payroll is not generated
  },
});

module.exports = Payroll;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payroll = sequelize.define('Payroll', {
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseSalary: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ratePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  payDays: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  specialAllowance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  mobileAllowance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  travelAllowance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  houseAllowance: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  incentive: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  deduction: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  taxDeduction: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  grossPay: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  netPay: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // default to false if payroll is not generated
  },
});

module.exports = Payroll;
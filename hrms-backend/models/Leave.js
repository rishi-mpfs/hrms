const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leave = sequelize.define('Leave', {
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  reason: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

module.exports = Leave;
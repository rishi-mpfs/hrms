// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM('male', 'female', 'other') },
  address: { type: DataTypes.TEXT },
  designation: { type: DataTypes.STRING },
  joinDate: { type: DataTypes.DATEONLY },
  salary: { type: DataTypes.FLOAT },
  profileImage: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  role: { type: DataTypes.ENUM('admin', 'hr', 'employee'), defaultValue: 'employee' },

  // ✅ Define departmentId as a foreign key
  // departmentId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'Departments',
  //     key: 'id'
  //   }
  // }
});

module.exports = User;

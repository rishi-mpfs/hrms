const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB,         // database name
  process.env.MYSQL_USER,       // username
  process.env.MYSQL_PASSWORD,   // password
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;

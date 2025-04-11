require('dotenv').config();
const { sequelize } = require('./models');

const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced!');
  } catch (err) {
    console.error('❌ Error syncing models:', err);
  }
};

syncModels();

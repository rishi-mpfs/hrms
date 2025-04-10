// seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('DB connected!');

    const existingAdmin = await User.findOne({ where: { email: 'admin@hrms.com' } });
    if (existingAdmin) {
      console.log('Admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      name: 'Admin',
      email: 'admin@hrms.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created!');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();

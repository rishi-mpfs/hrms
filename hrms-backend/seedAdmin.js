require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    // Sync models
    await sequelize.sync({ alter: true });

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@hrms.com' } });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists.');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@hrms.com',
      password: hashedPassword,
      role: 'admin',
      designation: 'System Admin',
      status: 'active',
      joinDate: new Date()
    });

    console.log('✅ Admin user created!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

seedAdmin();

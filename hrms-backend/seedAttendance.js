require('dotenv').config();
const {sequelize, Attendance } = require('./models');
const { Op } = require('sequelize');

const userId = 3; // change to the desired user ID
const month = '2025-04'; // format YYYY-MM

const getDatesOfMonth = (year, month) => {
  const dates = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const randomStatus = () => {
  const statuses = ['present', 'absent', 'late'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');

    const [year, monthStr] = month.split('-');
    const dates = getDatesOfMonth(parseInt(year), parseInt(monthStr));

    const records = dates.map(date => ({
      userId,
      date,
      status: randomStatus(),
      checkIn: '09:00:00',
      checkOut: '17:00:00'
    }));

    await Attendance.bulkCreate(records);
    console.log(`Seeded ${records.length} attendance records for user ${userId} in ${month}.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();

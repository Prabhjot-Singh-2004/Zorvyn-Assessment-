require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Record = require('../models/Record');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zorvyn-finance');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Record.deleteMany({});
    console.log('Cleared existing data');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@zorvyn.com',
      password: 'admin123',
      role: 'Admin',
      status: 'Active'
    });

    const analystUser = await User.create({
      name: 'Jane Analyst',
      email: 'analyst@zorvyn.com',
      password: 'analyst123',
      role: 'Analyst',
      status: 'Active'
    });

    const viewerUser = await User.create({
      name: 'Bob Viewer',
      email: 'viewer@zorvyn.com',
      password: 'viewer123',
      role: 'Viewer',
      status: 'Active'
    });

    console.log('Created users:');
    console.log(`  Admin: ${adminUser.email} / admin123`);
    console.log(`  Analyst: ${analystUser.email} / analyst123`);
    console.log(`  Viewer: ${viewerUser.email} / viewer123`);

    const sampleRecords = [
      { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2025-01-15'), notes: 'Monthly salary', createdBy: adminUser._id },
      { amount: 1200, type: 'EXPENSE', category: 'Marketing', date: new Date('2025-01-20'), notes: 'Google Ads campaign', createdBy: adminUser._id },
      { amount: 3000, type: 'INCOME', category: 'SaaS', date: new Date('2025-01-25'), notes: 'Subscription revenue', createdBy: adminUser._id },
      { amount: 800, type: 'EXPENSE', category: 'Software', date: new Date('2025-02-05'), notes: 'AWS hosting', createdBy: adminUser._id },
      { amount: 4500, type: 'INCOME', category: 'Consulting', date: new Date('2025-02-10'), notes: 'Client project', createdBy: adminUser._id },
      { amount: 600, type: 'EXPENSE', category: 'Marketing', date: new Date('2025-02-15'), notes: 'Social media ads', createdBy: adminUser._id },
      { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2025-02-15'), notes: 'Monthly salary', createdBy: adminUser._id },
      { amount: 200, type: 'EXPENSE', category: 'Office', date: new Date('2025-02-20'), notes: 'Supplies', createdBy: adminUser._id },
      { amount: 7500, type: 'INCOME', category: 'SaaS', date: new Date('2025-03-01'), notes: 'Enterprise plan', createdBy: adminUser._id },
      { amount: 1500, type: 'EXPENSE', category: 'Marketing', date: new Date('2025-03-10'), notes: 'Content marketing', createdBy: adminUser._id },
      { amount: 5000, type: 'INCOME', category: 'Salary', date: new Date('2025-03-15'), notes: 'Monthly salary', createdBy: adminUser._id },
      { amount: 900, type: 'EXPENSE', category: 'Software', date: new Date('2025-03-20'), notes: 'Development tools', createdBy: adminUser._id },
    ];

    await Record.insertMany(sampleRecords);
    console.log(`Created ${sampleRecords.length} sample records`);

    console.log('\nSeeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

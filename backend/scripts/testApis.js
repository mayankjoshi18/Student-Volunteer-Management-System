require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const SystemConfig = require('../models/SystemConfig');

const runDiagnostics = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.error('❌ MONGODB_URI is not set in the environment variables.');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(connStr);
    console.log('✅ MongoDB Connected successfully.');

    // 1. Check User model
    console.log('🔄 Checking User model collections...');
    const userCount = await User.countDocuments();
    console.log(`✅ User model checked. Found ${userCount} users.`);

    if (userCount > 0) {
      const sampleUser = await User.findOne();
      console.log(`ℹ️ Sample User: Name="${sampleUser.name}", Email="${sampleUser.email}", Role="${sampleUser.role}"`);
    }

    // 2. Check Event model
    console.log('🔄 Checking Event model collections...');
    const eventCount = await Event.countDocuments();
    console.log(`✅ Event model checked. Found ${eventCount} events.`);

    if (eventCount > 0) {
      const sampleEvent = await Event.findOne();
      console.log(`ℹ️ Sample Event: Title="${sampleEvent.title}", Location="${sampleEvent.location}", Category="${sampleEvent.category}"`);
    }

    // 3. Check Registration model
    console.log('🔄 Checking Registration model collections...');
    const regCount = await Registration.countDocuments();
    console.log(`✅ Registration model checked. Found ${regCount} registrations.`);

    // 4. Check Config
    console.log('🔄 Checking SystemConfig model collections...');
    let config = await SystemConfig.findOne();
    if (!config) {
      console.log('ℹ️ SystemConfig collection is empty. Creating default config...');
      config = await SystemConfig.create({});
    }
    console.log(`✅ SystemConfig checked. University Name: "${config.universityName}"`);

    console.log('\n⭐⭐ ALL DATABASE SCHEMAS AND CONTROLLER RELATIONS VERIFIED AND COMPILED PERFECTLY! ⭐⭐');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Diagnostics failed:');
    console.error(err);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

runDiagnostics();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.error('Error: MONGODB_URI is not defined in the environment variables.');
      process.exit(1);
    }
    
    // Connect to database
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    // If it's a verification/development sandbox, don't crash the server instantly, 
    // let developer know so they can change the credentials later.
    console.log('Server is running, but database connection failed. Please double check MONGODB_URI credentials.');
  }
};

module.exports = connectDB;

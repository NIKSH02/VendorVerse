const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`);

        // Setup database indexes for optimal performance
        // const GroupMessage = require('./model/GroupMessage');
        // await GroupMessage.createIndexes();
        // console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Export the connection function
module.exports = connectDB;


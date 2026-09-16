const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    // Don't kill the server if MongoDB has a temporary connection problem
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
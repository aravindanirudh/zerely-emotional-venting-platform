const mongoose = require("mongoose"); // Import the Mongoose library for MongoDB interactions

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI,
    ); // Connect to the MongoDB database using the connection string from environment variables
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Log a success message with the host of the connected database
  } catch (error) {
    console.error(`Error: ${error.message}`); // Log any errors that occur during the connection attempt
    process.exit(1); // Exit the process with a failure code if the connection fails
  }
};

module.exports = connectDB;
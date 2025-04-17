const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const condb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 50000,
    });

  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    throw error; 
  }
};

module.exports = condb;

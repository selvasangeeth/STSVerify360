// const mongoose = require("mongoose");
// require('dotenv').config();


// const condb = async () => {
//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URL);
//     console.log("MongoDB Connected successflly");
//   } catch (err) {
//     console.log(`Error on connecting to MongoDB: ${err}`);
//   }
// };
// module.exports = condb;


// // 

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const condb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increases timeout to avoid connection issues
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    throw error; // Propagate error to stop the server if the DB fails
  }
};

module.exports = condb;

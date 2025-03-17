// const express = require("express");
// const app = express();
// require('dotenv').config();
// const cors = require("cors");
// const condb = require("../Backend/Database/data");  
// const userRoute = require("./Routes/UserRoutes");
// const scenarioRoute = require("./Routes/ScenarioRoutes");
// const projectRoute = require("./Routes/ProjectRoutes");
// const moduleRoute = require("./Routes/ModuleRoutes");
// const testCaseRoute = require("./Routes/TestcaseRoutes");
// const path = require('path');
// const testRunRoute = require("./Routes/TestRunRoutes")

// condb();

// const cookieParser = require("cookie-parser");

// app.use(cors({
//  origin :   'http://localhost:3000',
//  credentials: true,
  
// }));
// app.use(express.json());
// app.use(cookieParser());

// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use("/", userRoute);
// app.use("/",projectRoute);
// app.use("/",moduleRoute);
// app.use("/",scenarioRoute);
// app.use("/",testCaseRoute);
// app.use("/",testRunRoute);







// app.listen(9000, () => {
//   console.log("Server is running on port 9000");
// });


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import database connection function
const condb = require("./Database/data");

// Import routes
const userRoute = require("./Routes/UserRoutes");
const scenarioRoute = require("./Routes/ScenarioRoutes");
const projectRoute = require("./Routes/ProjectRoutes");
const moduleRoute = require("./Routes/ModuleRoutes");
const testCaseRoute = require("./Routes/TestcaseRoutes");
const testRunRoute = require("./Routes/TestRunRoutes");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB BEFORE starting the server
(async () => {
  try {
    await condb();
    console.log("✅ MongoDB Connected Successfully");

    // Middleware
    app.use(cors({
      origin: process.env.ORIGIN_URL || "http://localhost:3000",
      credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());

    // Serve static files (for file uploads)
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    // Routes
    app.use("/", userRoute);
    app.use("/", projectRoute);
    app.use("/", moduleRoute);
    app.use("/", scenarioRoute);
    app.use("/", testCaseRoute);
    app.use("/", testRunRoute);

    // Start the server
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
})();

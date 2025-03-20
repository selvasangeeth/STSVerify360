const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");


const condb = require("./Database/data");

const userRoute = require("./Routes/UserRoutes");
const scenarioRoute = require("./Routes/ScenarioRoutes");
const projectRoute = require("./Routes/ProjectRoutes");
const moduleRoute = require("./Routes/ModuleRoutes");
const testCaseRoute = require("./Routes/TestcaseRoutes");
const testRunRoute = require("./Routes/TestRunRoutes");

dotenv.config();

const app = express();

(async () => {
  try {
    await condb();
    console.log("MongoDB Connected Successfully");

  
    app.use(cors({
      origin: process.env.ORIGIN_URL,
      credentials: true,
    }));
    app.use(express.json());
    app.use(cookieParser());

    
    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  
    app.use("/", userRoute);
    app.use("/", projectRoute);
    app.use("/", moduleRoute);
    app.use("/", scenarioRoute);
    app.use("/", testCaseRoute);
    app.use("/", testRunRoute);

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
})();

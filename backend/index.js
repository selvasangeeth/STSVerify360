const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");


const condb = require("./Database/data");

const userRoute = require("./Routes/userRoutes");
const scenarioRoute = require("./Routes/scenarioRoutes");
const projectRoute = require("./Routes/projectRoutes");
const moduleRoute = require("./Routes/moduleRoutes");
const testCaseRoute = require("./Routes/testCaseRoutes");
const testRunRoute = require("./Routes/testRunRoutes");
const metricsRoute = require("./Routes/metricsRoute");
const logList = require("./Routes/logListRoutes");
const hyperLink = require("./Routes/hyperLinkRoutes")

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

    //Routes
    app.use("/", userRoute);
    app.use("/", projectRoute);
    app.use("/", moduleRoute);
    app.use("/", scenarioRoute);
    app.use("/", testCaseRoute);
    app.use("/", testRunRoute);
    app.use("/",metricsRoute);
    app.use("/",logList);
    app.use("/",hyperLink);

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
})();

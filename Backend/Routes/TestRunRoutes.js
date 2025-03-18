// const express = require("express");
// const router = express.Router();
// const auth = require("../Middleware/auth");

// const { getAllTestRuns } = require("../Controller/Testrun");


// router.get("/getAllTestRuns",getAllTestRuns);




// // module.exports = router;


const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const { getTestRuns } = require("../Controller/Testrun");
router.get("/getTestRuns/:projectId",getTestRuns);
module.exports = router;
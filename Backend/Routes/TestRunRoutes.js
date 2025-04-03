const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");


const { getTestRuns } = require("../Controller/testRun");



router.get("/getTestRuns/:projectId",getTestRuns);


module.exports = router;
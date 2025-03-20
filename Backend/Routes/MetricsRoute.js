const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");



const { getMetricsModules, getMetricsScenario, getMetricsTestCase } = require("../Controller/Metrics");

router.get("/metrics/getModules/:projectId",auth,getMetricsModules)
router.get("/metrics/getScenarios/:moduleId",auth,getMetricsScenario);
router.put("/metrics/getTestCases/:scenarioId",auth,getMetricsTestCase);



module.exports = router;
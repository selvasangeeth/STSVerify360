const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");



const { getMetricsModules, getMetricsScenario, getMetricsTestCase, getMetricsTestCaseByModule } = require("../Controller/Metrics");

router.get("/metrics/getModules/:projectId",auth,getMetricsModules)
router.get("/metrics/getScenarios/:moduleId",auth,getMetricsScenario);
router.put("/metrics/getTestCases/:scenarioId",auth,getMetricsTestCase);
router.put("/metrics/getTestCasesByModule/:moduleId",auth,getMetricsTestCaseByModule)



module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

const {createTestCase, updateTestCaseStatus} = require("../Controller/Testcase");

router.post("/createTestCase",auth,createTestCase);
router.post("/updatedTestCase",auth,updateTestCaseStatus)
// router.get("/getScenario/:moduleId",auth,getScenario);




module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");

const {createTestCase, updateTestCaseStatus,getTestCase, getTestIds, deleteTestCase, updateTestCase} = require("../Controller/Testcase");


router.post("/createTestCase",auth,createTestCase);
router.post("/updatedTestCase",auth,upload,updateTestCaseStatus)
router.get("/getTestCase/:scenarioId",auth,getTestCase);
router.get("/getTestIds",auth,getTestIds);
router.delete("/api/deleteTestCase/:testCaseId",auth,deleteTestCase);
router.put("/updateTestCase",auth,updateTestCase)


module.exports = router;







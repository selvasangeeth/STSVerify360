const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

const {createScenario,getScenario, updateScenario, deleteScenario, getIds} = require("../Controller/Scenarios");

router.post("/createScenario",auth,createScenario)
router.get("/getScenario/:moduleId",auth,getScenario);
router.put("/updateScenario/:scenarioId",auth,updateScenario);
router.delete("/sc/deleteScenario/:scenarioId",auth,deleteScenario);
router.get("/getIds",auth,getIds);



module.exports = router;
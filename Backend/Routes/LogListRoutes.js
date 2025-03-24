const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");


const { getLogs } = require("../Controller/LogList");

router.get("/logs/:projectId",auth,getLogs)


module.exports = router;







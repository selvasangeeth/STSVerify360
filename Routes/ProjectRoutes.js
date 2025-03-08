const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");



const {createProject,updateProject,getProject} = require("../Controller/Project");


router.post("/createProject",upload.single('projectLogo'),auth,createProject);
router.get("/getProject",auth,getProject);
router.put("/updateProject",updateProject);

module.exports = router;
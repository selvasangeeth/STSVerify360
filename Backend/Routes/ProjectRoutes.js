const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");



const {createProject,updateProject,getProject, deleteProject, getImage, assignUsers} = require("../Controller/Project");


router.post("/createProject",upload.single('projectLogo'),auth,createProject);
router.get("/getProject",auth,getProject);
router.put("/updateProject",updateProject);
router.delete("/deleteProject",auth,deleteProject)
router.get("/getImage/:pic",auth,getImage)
router.put("/assignUsers",assignUsers);

module.exports = router;
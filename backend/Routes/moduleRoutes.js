const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

const { createModule,getModules, updateModule, deleteModule } = require("../Controller/module");

router.post("/createModule",auth,createModule)
router.get("/getModules/:projectId",getModules);
router.put("/mod/updateModule",auth,updateModule);
router.delete("/mod/deleteModule",auth,deleteModule);



module.exports = router;
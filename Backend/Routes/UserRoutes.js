const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");


const { registerUser,loginUser, updateUser, logout, getUserRoleDetails, updatedRole, getProjectforRole, deleteUser } = require("../Controller/User"); 


router.post("/register", registerUser);
router.post("/login",loginUser);
router.put("/updateUser",upload,auth,updateUser);
router.post("/api/logout",logout)
router.get("/getUserRoleDetails",auth,getUserRoleDetails)
router.put("/updateRole",auth,updatedRole)
router.get("/getProjectforRole", auth,getProjectforRole);
router.delete("/deleteUser/:id", auth, deleteUser);
    
   
module.exports = router;
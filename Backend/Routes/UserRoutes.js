const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");


const { registerUser,loginUser, updateUser } = require("../Controller/User"); 


router.post("/register", registerUser);
router.post("/login",loginUser);
router.put("/updateUser",upload.single('Profileimg'),auth,updateUser);


module.exports = router;
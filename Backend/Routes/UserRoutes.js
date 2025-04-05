const express = require("express");
const router = express.Router();
const upload = require("../Middleware/storeFiles")
const auth = require("../Middleware/auth");


const { registerUser,loginUser, updateUser } = require("../Controller/User"); 


router.post("/register", registerUser);
router.post("/login",loginUser);
router.put("/updateUser",upload.single('Profileimg'),auth,updateUser);

// Add logout route
router.post("/logout", (req, res) => {
    // Clear the JWT cookie
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true,
        path: '/'
    });
    
    res.status(200).json({ msg: "Logged out successfully" });
});


module.exports = router;
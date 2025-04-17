const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");

const { createHyperLink, deleteHyperLink, getHyperLink, updateHyperLink } = require("../Controller/HyperLink");

router.post("/api/createHyperLink",auth,createHyperLink)
router.delete("/api/deleteHyperLink/:id",auth,deleteHyperLink);
router.get("/api/getHyperLink",auth,getHyperLink);
router.put("/api/updateQuickLink",auth,updateHyperLink)


module.exports = router;
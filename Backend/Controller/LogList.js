

const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const { getLogs } = require("../Controller/LogList");
router.get("/logs/:projectId",auth,getLogs)
module.exports = router;
const Log = require("../Model/Log.model"); // Import the Log model
// Get logs based on projectId
const getLogs = async (req, res) => {
    try {
        const { projectId } = req.params; // Get projectId from the query parameters
        console.log(projectId);
        // Fetch logs based on the projectId
        const logs = await Log.find({ projectId })
            .sort({ timestamp: -1 }); // Sort by timestamp in descending order (latest logs first)
            // console.log(logs);
        return res.status(200).json(logs); // Return the logs as a response
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching logs" });
    }
};
module.exports = {getLogs};














const Log = require("../Model/Log.model");


const getLogs = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Fetch logs related to the project, including logs where entityType is 'Project Deleted'
        const logs = await Log.find({ 
            projectId,
            $or: [
                { entityType: 'Project Deleted' },  // Include logs where entityType is 'Project Deleted'
                { projectId }                       // Also include other logs related to the project
            ]
        }).sort({ timestamp: -1 });

        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching logs" });
    }
};


module.exports = { getLogs };


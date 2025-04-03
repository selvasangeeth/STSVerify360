const Log = require("../Model/Log.model");


const getLogs = async (req, res) => {
    try {
        const { projectId } = req.params;
        const logs = await Log.find({ projectId }).sort({ timestamp: -1 });
        return res.status(200).json(logs);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching logs" });
    }
};

module.exports = { getLogs };


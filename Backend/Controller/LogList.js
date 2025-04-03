const Log = require("../Model/Log.model");


const getLogs = async (req, res) => {
    try {
        const { projectId } = req.params; 
        console.log("at log backend");
        console.log(projectId);
   
        const logs = await Log.find({ projectId })
            .sort({ timestamp: -1 }); 

            // console.log(logs);
        return res.status(200).json(logs); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching logs" });
    }
};

module.exports = {getLogs};


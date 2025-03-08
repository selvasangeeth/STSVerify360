const modulee = require("../Model/Module.model");
const project = require("../Model/Project.model")
const log = require("../Model/Module.model");
const scenario = require("../Model/Scenarios.model");


// Create Scenario 

const createScenario = async (req, res) => {
    try {
        const createdById = req.user.id;
        const { scenarioName,moduleId,taskId,subTaskId,scenarioDescription,projectId } = req.body;
        const scenar = await scenario.findOne({ scenarioName });
        if (scenar) {
            return res.json({ msg: "Scenario already Exist" });
        }
        else {
            const creat = await scenario.create({
                scenarioName: scenarioName,
                moduleId: moduleId,
                taskId: taskId,
                subTaskId : subTaskId,
                scenarioDescription :scenarioDescription,
                createdBy: createdById,
            })
            const associatedModule = await modulee.findById(moduleId);
            const associatedProject = await project.findById(projectId);
            if (!associatedModule) {
                return res.status(404).json({ msg: "Module not found" });
            }
            const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${creat.scenarioName}`;
            try {
                await log.create({
                    action: "Created",
                    entityType: "Scenario",
                    entityId: creat._id,
                    user: createdById,
                    timestamp: Date.now(),
                    path :path,
                    details: `Created Scenario : ${scenarioName}`,

                })
            }
            catch (err) {
                console.log(err);

            }

            return res.json({ msg: "Scenario Created Successfully", data: creat });
        }
    }
    catch (err) {
        console.log("Error :" + err);
    }
}

// get Scenario 

const getScenario= async (req, res) => {
  try {
    const moduleId = req.params.moduleId; 

    const mod = await modulee.findById(moduleId);
    if (!mod) {
      return res.status(404).json({ msg: "Module not found" });
    }
    const sc = await scenario.find({ module: moduleId });

    if (sc.length === 0) {
      return res.status(404).json({ msg: "No Scenario found for this project" });
    }
    res.status(200).json({ sc });
  } catch (err) {
    console.error("Error fetching Scenarios:", err);
    res.status(500).json({ msg: "Failed to fetch Scenarios" });
  }
};



module.exports = {createScenario,getScenario};
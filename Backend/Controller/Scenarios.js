const modulee = require("../Model/Module.model");
const project = require("../Model/Project.model");
const log = require("../Model/Log.model");  // Ensure this is the correct log model
const scenario = require("../Model/Scenarios.model");
const testCaseModel = require("../Model/Testcase.model");
const userDetails = require("../Model/User.model");


// Create Scenario 
const createScenario = async (req, res) => {
  try {
    const createdById = req.user.id;
    console.log("Request body:", req.body);

    const { scenarioIdstr, moduleId, taskId, subTaskId, description, projectId } = req.body;
   

    if (!scenarioIdstr) {
      return res.status(400).json({ msg: "scenarioIdstr is required" });
    }

    const scenar = await scenario.findOne({ scenarioIdstr });
    if (scenar) {
      return res.json({ msg: "Scenario already exists" });
    } else {
      // Create the scenario
      const creat = await scenario.create({
        scenarioIdstr: scenarioIdstr,
        module: moduleId,
        taskId: taskId,
        subTaskId: subTaskId,
        scenarioDescription: description,
        createdBy: createdById,
      });

      console.log("Scenario created");
     console.log(creat);
      const associatedModule = await modulee.findById(moduleId);
      const associatedProject = await project.findById(projectId);

      if (!associatedModule) {
        return res.status(404).json({ msg: "Module not found" });
      }

      // Log creation
      console.log("Log creation started");
      console.log(associatedProject.projectName)
      console.log(associatedModule.moduleName)
      console.log(creat.scenarioIdstr)
      const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${creat.scenarioIdstr}`;
      try {
        
        const UserName = await userDetails.findById(createdById).populate('Name');
        const logEntry = await log.create({
          action: "Created",
          entityType: "Scenario",
          entityId: creat._id,
          user: UserName.Name,
          timestamp: Date.now(),
          projectId : projectId,
          path: path,
          details: `Created Scenario: ${scenarioIdstr}`,
        });

        console.log("Log entry created:", logEntry);
      } catch (err) {
        console.log("Error creating log:", err);
      }

      return res.json({ msg: "Scenario Created Successfully", data: creat });
    }
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ msg: "Server error, please try again later." });
  }
};

// get Scenario 

const getScenario = async (req, res) => {
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

    const scenariosWithTestCaseCount = await Promise.all(sc.map(async (scenario) => {
      const testCaseCount = await testCaseModel.countDocuments({ scenarioId: scenario._id });
      return {
        ...scenario.toObject(),
        testCaseCount: testCaseCount,
      };
    }));

    res.status(200).json({ msg: "Success Scenario Fetch", data: scenariosWithTestCaseCount });
  } catch (err) {
    console.error("Error fetching Scenarios:", err);
    res.status(500).json({ msg: "Failed to fetch Scenarios" });
  }
};


const updateScenario = async (req, res) => {

  const scenarioId = req.params.scenarioId;

  try {
    console.log("Scenario upadte Module");

    const updatedBy = req.user.id;
    const { scenarioUpdate, projectId, moduleId } = req.body;
    // console.log(scenarioUpdate );
    // console.log("projId : "+projectId);
    // console.log("Update peoject id :" + projectId);  
    const scenarioIdstr = scenarioUpdate.scenarioIdstr;
    const taskId = scenarioUpdate.taskId;
    const subTaskId = scenarioUpdate.subTaskId;
    const description = scenarioUpdate.description;
    const sc = await scenario.findById(scenarioId);


    if (!sc) {
      return res.json({ msg: "Scenario does not exist" });
    } else {
      //old Details for log
      let oldScenarioIdstr = sc.scenarioIdstr;
      let oldTaskId = sc.taskId;
      let oldSubTask = sc.subTaskId;
      let oldDescription = sc.scenarioDescription;

      //updating new details

      sc.scenarioIdstr = scenarioIdstr;
      sc.taskId = taskId;
      sc.subTaskId = subTaskId;
      sc.scenarioDescription = description;

      await sc.save();

      const UserName = await userDetails.findById(updatedBy).populate('Name');
      const projectName = await project.findById(projectId).populate('projectName');
      const moduleName = await modulee.findById(moduleId).populate('moduleName');

      // console.log(projectName.projectName);
      const path = `${projectName.projectName}/${moduleName.moduleName}/${scenarioIdstr}`;

      //log

      try {
        const updatedScenario = await log.create({
          action: "Updated",
          entityType: "Scenario",
          entityId: scenarioId,
          user: UserName.Name,
          path: path,
          projectId: projectId,
          timestamp : Date.now(),
          details: ` ${oldScenarioIdstr}/${oldTaskId}/${oldSubTask}/${oldDescription} updated to ${scenarioIdstr}/${taskId}/${subTaskId}/${description}`

        })

        // console.log("Updated Scenario : " + updatedScenario)
      }
      catch (err) {
        console.log(err);
      }
      return res.json({ msg: "Scenario updated successfully", data: sc });
    }
  }
  catch (err) {
    console.log("Error :" + err);
  }
};


//deleteScenario 
  
const deleteScenario = async (req, res) => {
  const scenarioId = req.params.scenarioId;
  try {

    const { projectId, moduleId } = req.query;
    const deletedById = req.user.id;

    // console.log(scenarioId);
    // console.log(req.query);

    const sc = await scenario.findById(scenarioId);

    if (!sc) {
      return res.json({ msg: "Scenario does not exist" });
    }

    const moduleName = await modulee.findById(moduleId).populate('moduleName');
    const scenarioName = await scenario.findById(scenarioId).populate('scenarioIdstr');
    const projectName = await project.findById(projectId).populate('projectName');
    await scenario.findByIdAndDelete(scenarioId);
    const UserName = await userDetails.findById(deletedById).populate('Name');
    const path = `${projectName.projectName}/${moduleName.moduleName}/${scenarioName.scenarioIdstr}`;

    // Log the action
    try {
      const deleteScenariolog = await log.create({
        action: "Deleted",
        entityType: "Scenario",
        entityId: moduleId,
        user: UserName.Name,
        path: path,
        projectId: projectId,
        timestamp : Date.now(),
        details: `Scenario Deleted: ${scenarioName.scenarioIdstr}`
      });
      // console.log("deleteModulelog", deleteScenariolog);
    } catch (err) {
      console.log(err);
    }

    return res.status(200).json({ msg: 'Scenario deleted successfully' });
  } catch (err) {
    console.error("Error deleting Scenario:", err);
    return res.status(500).json({ msg: 'Failed to delete Scenario' });
  }
};

// generate the ScenarioId
const getIds = async (req, res) => {

  try {
    
    const { projectId, moduleId } = req.query;  
    console.log(req.query);  

    if (!projectId || !moduleId) {
      return res.status(400).json({ message: "Missing projectId or moduleId" });
    }

    const projectD = await project.findById(projectId);
    if (!projectD) {
      return res.status(404).json({ message: "Project not found" });
    }
    const projectName = projectD.projectName;

   
    const module = await modulee.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    const moduleName = module.moduleName;


    const scenarioCount = await scenario.countDocuments({ module: moduleId });

    const result = `${projectName}_${moduleName.substring(0, 2)}_TS${(scenarioCount + 1).toString().padStart(3, '0')}`;

    // console.log(result);
    return res.status(200).json({ genSceId: result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};






module.exports = { createScenario, getScenario, updateScenario, deleteScenario,getIds};
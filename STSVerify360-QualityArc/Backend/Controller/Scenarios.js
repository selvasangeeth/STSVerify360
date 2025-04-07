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
    const { scenarioIdstr, moduleId, taskId, subTaskId, description, projectId } = req.body;
   
    if (scenarioIdstr === '' || scenarioIdstr === null || moduleId === '' || moduleId === null || taskId === '' || taskId === null || subTaskId === '' || subTaskId === null || description === '' || description === null || projectId === '' || projectId === null) {
      return res.status(200).json({ msg: "All fields are required" });
    }
    
    const scenar = await scenario.findOne({ 
      scenarioIdstr: scenarioIdstr,
      projectId:projectId
    });
    

    if (scenar) {

      return res.status(200).json({ msg: "Scenario already exists" });

    }
     else {

      // Create the scenario
      const creat = await scenario.create({
        scenarioIdstr: scenarioIdstr,
        module: moduleId,
        taskId: taskId,
        subTaskId: subTaskId,
        scenarioDescription: description,
        createdBy: createdById,
        projectId:projectId
      });

      const associatedModule = await modulee.findById(moduleId);
      const associatedProject = await project.findById(projectId);

      if (!associatedModule) {
        return res.status(200).json({ msg: "Module not found" });
      }

      // Log creation

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

        
      } catch (err) {
        console.log("Error creating log:", err);
      }

      return res.status(200).json({ msg: "Scenario Created Successfully", data: creat });
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
      return res.status(200).json({ msg: "Module not found" });
    }
    const sc = await scenario.find({ module: moduleId });

    if (sc.length === 0) {
      return res.status(200).json({ msg: "No Scenario found for this project" });
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

// Updated Scenario
const updateScenario = async (req, res) => {

  const scenarioId = req.params.scenarioId;

  try {
 
    const updatedBy = req.user.id;
    const { scenarioUpdate, projectId, moduleId } = req.body;
  
    const scenarioIdstr = scenarioUpdate.scenarioIdstr;
    const taskId = scenarioUpdate.taskId;
    const subTaskId = scenarioUpdate.subTaskId;
    const description = scenarioUpdate.scenarioDescription;
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

    const sc = await scenario.findById(scenarioId);

    if (!sc) {
      return res.status(200).json({ msg: "Scenario does not exist" });
    }

    const moduleName = await modulee.findById(moduleId).populate('moduleName');
    const scenarioName = await scenario.findById(scenarioId).populate('scenarioIdstr');
    const projectName = await project.findById(projectId).populate('projectName');

    //delete Scenarios
    await scenario.findByIdAndDelete(scenarioId);

    //delete associated TestCases
    await testCaseModel.deleteMany({ scenarioId: scenarioId });

    const UserName = await userDetails.findById(deletedById).populate('Name');
    const path = `${projectName.projectName}/${moduleName.moduleName}/${scenarioName.scenarioIdstr}`;

    // Log the action
    
        await log.create({
        action: "Deleted",
        entityType: "Scenario",
        entityId: moduleId,
        user: UserName.Name,
        path: path,
        projectId: projectId,
        timestamp : Date.now(),
        details: `Scenario Deleted: ${scenarioName.scenarioIdstr}`
      });

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
   

    if (!projectId || !moduleId) {
      return res.status(400).json({ msg: "Missing projectId or moduleId" });
    }

    const projectD = await project.findById(projectId);
    if (!projectD) {
      return res.status(200).json({ msg: "Project not found" });
    }
    const projectName = projectD.projectName;

    const module = await modulee.findById(moduleId);
    if (!module) {
      return res.status(200).json({ msg: "Module not found" });
    }
    const moduleName = module.moduleName;

    // Get all existing scenarios for the module, sorted by the latest first
    const scenarios = await scenario.find({ module: moduleId }).sort({ _id: -1 });
  

    // Get the highest existing scenario number
    let highestScenario = "TS000"; // Default to TS000 if no scenarios exist

    if (scenarios.length > 0) {
      const lastScenarioId = scenarios[0].scenarioIdstr; // Use 'scenarioIdstr' instead of 'scenarioId'
    
      if (lastScenarioId && typeof lastScenarioId === 'string') {
        const lastNumberMatch = lastScenarioId.match(/TS(\d{3})([A-Za-z]*)$/);

        if (lastNumberMatch) {
          const lastNumber = parseInt(lastNumberMatch[1], 10); // Extract the numeric part
          const lastSuffix = lastNumberMatch[2];  // Extract the suffix (if any)
          
          if (lastSuffix) {
            // If there's a suffix (like 'A' in 'TS003A'), increment the suffix
            highestScenario = `TS${(lastNumber).toString().padStart(3, '0')}${String.fromCharCode(lastSuffix.charCodeAt(0) + 1)}`;
          } else {
            // Otherwise, increment the number (e.g., TS003 -> TS004)
            highestScenario = `TS${(lastNumber + 1).toString().padStart(3, '0')}`;
          }
        } else {
          // If the format doesn't match, increment the number (e.g., from TS003 -> TS004)
          highestScenario = `TS${(parseInt(lastScenarioId.substring(2), 10) + 1).toString().padStart(3, '0')}`;
        }
      } else {
        // If lastScenarioId is not a valid string, default to TS001
        highestScenario = "TS001";
      }
    } else {
      // No scenarios, start with TS001
      highestScenario = "TS001";
    }

    // Generate the new scenario ID
    const result = `${projectName}_${moduleName.substring(0, 2)}_${highestScenario}`;

    return res.status(200).json({ genSceId: result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = { createScenario, getScenario, updateScenario, deleteScenario,getIds};
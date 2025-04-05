//import Model
const modulee = require("../Model/Module.model");
const project = require("../Model/Project.model")
const log = require("../Model/Log.model");
const mongoose = require('mongoose');
const ScenarioModel = require("../Model/Scenarios.model");
const TestCaseModal = require("../Model/Testcase.model");
const userDetails = require("../Model/User.model");


//CreateModule
const createModule = async (req, res) => {
  try {
      const createdById = req.user.id;
      const { moduleName, subModule, projectId } = req.body;

      if (moduleName == ''|| subModule == '' || projectId == '') {
        return res.status(200).json({ msg: "All Fields are Mandatory" });
      }

      const mod = await modulee.findOne({ 
        moduleName: moduleName, 
        projectId: projectId,
        subModule:subModule
      });
    
      if (mod) {
        return res.status(200).json({ msg: "SubModule already Exist" });
      }
      else {
      const creat = await modulee.create({
        moduleName: moduleName,
        subModule: subModule,
        projectId: projectId,
        createdBy: createdById,
      })
      // console.log(creat);
      const associatedProject = await project.findById(projectId);
      if (!associatedProject) {
        return res.status(200).json({ msg: "Project not found" });
      }
      const UserName = await userDetails.findById(createdById).populate('Name');
      const path = `${associatedProject.projectName}/${creat.moduleName}`;
    
        await log.create({
          action: "Created",
          entityType: "Module",
          entityId: creat._id,
          user: UserName.Name,
          timestamp: Date.now(),
          path: path,
          projectId: projectId,
          details: `Created Module : ${moduleName}`,
        })
   
      return res.status(200).json({ msg: "Module Created Successfully", data: creat });
    }
  }
  catch (err) {
    return res.status(500).json({ msg: "An error occurred while processing your request. Please try again later", error: err });
  }
}


//FetchModules

const getModules = async (req, res) => {

  try {
    const { projectId } = req.params;
    // console.log("Received projectId:", projectId);
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ msg: "Invalid Project ID" });
    }
    // console.log("ProjectId validated");
    const proj = await project.findById(projectId);
    if (!proj) {
      return res.status(200).json({ msg: "Project not found" });
    }
    const modules = await modulee.find({ projectId: projectId });
    // console.log("Modules found:", modules);
    if (modules.length === 0) {
      return res.status(200).json({ msg: "No modules found for this project" });
    }
    const modulesWithCounts = await Promise.all(modules.map(async (module) => {
      const scenarioCount = await ScenarioModel.countDocuments({ module: module._id });
      const testCaseCount = await TestCaseModal.countDocuments({ moduleId: module._id });
      return {
        ...module.toObject(),
        scenariosCount: scenarioCount,
        casesCount: testCaseCount,
      };
    }));
  
    res.status(200).json({ msg: "Module Fetched Success", data: modulesWithCounts });
    
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ msg: "Failed to fetch modules" });
  }
};



//update Module

const updateModule = async (req, res) => {
 
  try {
    const updatedBy = req.user.id;
    const { moduleId, newModuleName, newSubModuleName, projectId } = req.body;
    // console.log("Update peoject id :" + projectId);
    const moduleName = newModuleName;
    const subModule = newSubModuleName;
    const mod = await modulee.findById(moduleId);

    const checkMod = await modulee.findOne({ moduleName });
    
    if(checkMod){
      return res.status(200).json({msg:"Module Name Already Exists!!"});
    }

    if (!mod) {
      return res.status(200).json({ msg: "Module does not exist" });
    } else {
      let oldModuleName = mod.moduleName;
      let oldSubModuleName = mod.subModule;
      mod.moduleName = newModuleName;
      mod.subModule = newSubModuleName;

      await mod.save();
      const UserName = await userDetails.findById(updatedBy).populate('Name');
      const projectName = await project.findById(projectId).populate('projectName');
      // console.log(projectName.projectName);
      const path = `${projectName.projectName}/${moduleName}`;

      
      //log
      
         await log.create({
          action: "Updated",
          entityType: "Module",
          entityId: moduleId,
          user: UserName.Name,
          path: path,
          projectId: projectId,
          timestamp: Date.now(),
          details: ` ${oldModuleName}/${oldSubModuleName} updated to ${newModuleName}/${newSubModuleName}`
        })
      
      return res.status(200).json({ msg: "Module updated successfully", data: mod });
    }
  }
  catch (err) {
    console.log("Error :" + err);
  }
};


//delete Module
const deleteModule = async (req, res) => {

  try {

    const { moduleId, projectId } = req.body;
    const deletedById = req.user.id;
   
    const mod = await modulee.findById(moduleId);

    if (!mod) {
      return res.status(404).json({ msg: 'Module not found' });
    }

    const moduleName = await modulee.findById(moduleId).populate('moduleName');

    await modulee.findByIdAndDelete(moduleId);
    await TestCaseModal.deleteMany({ moduleId:moduleId });
    await ScenarioModel.deleteMany({ module:moduleId});


    const UserName = await userDetails.findById(deletedById).populate('Name');
    const projectName = await project.findById(projectId).populate('projectName');
    const path = `${projectName.projectName}/${moduleName.moduleName}`;


    //log
      const deleteModulelog = await log.create({
        action: "Deleted",
        entityType: "Module",
        entityId: moduleId,
        user: UserName.Name,
        path: path,
        projectId: projectId,
        timestamp: Date.now(),
        details: ` Module Deleted : ${moduleName.moduleName}`
      }
      )
    
    
    return res.status(200).json({ msg: 'Module deleted successfully' });

  } catch (err) {
    console.error("Error deleting Module:", err);
    return res.status(500).json({ msg: 'Failed to delete Module' });
  }
};
module.exports = { createModule, getModules, updateModule, deleteModule };
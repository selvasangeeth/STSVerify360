const testCaseModel = require("../Model/Testcase.model");
const testScenarioModel = require("../Model/Scenarios.model");
const project = require("../Model/Project.model");
const modulee = require("../Model/Module.model");
const user = require("../Model/User.model");
//TestCase Creation
const createTestCase= async (req,res)=>{
    try {
        const createdById = req.user.id;
        const { testCaseName, testCaseId,caseType,scenarioId,testCaseDescription,projectId,moduleId}=req.body;
        const test = await testCaseModel.findOne({ testCaseName });
        if (test) {
            return res.json({ msg: "TestCase already Exist" });
        }
        else {
            const creat = await testCaseModel.create({
                testCaseName:testCaseName,
                scenarioId: scenarioId,
                testCaseId : testCaseId,
                caseType : caseType,
                testCaseDescription :testCaseDescription,
                createdBy: createdById,
            })
            const associatedScenario = await testScenarioModel.findById(scenarioId);
            const associatedModule = await modulee.findById(moduleId);
            const associatedProject = await project.findById(projectId);
            if (!associatedModule) {
                return res.status(404).json({ msg: "Module not found" });
            }
            const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioName}/${creat.testCaseName}`;
            try {
                await log.create({
                    action: "Created",
                    entityType: "TestCase",
                    entityId: creat._id,
                    user: createdById,
                    timestamp: Date.now(),
                    path :path,
                    details: `Created TestCase : ${testCaseName}`,

                })
            }
            catch (err) {
                console.log(err);
            }

            return res.json({ msg: "TestCase Created Successfully", data: creat });
        }
    }
    catch (err) {
        console.log("Error :" + err);
    }
}

//TestCase Status Update

const updateTestCaseStatus = async (req, res) => {
    try {
      const { testCaseId, status, scenarioId,projectId,moduleId} = req.body;  
      const testerId = req.user.id;
      const testerName = user.findById(testerId);

     
      if (!status) {
        return res.status(400).json({ msg: "Status is required" });
      }
  

      const updatedTestCase = await testCaseModel.findByIdAndUpdate(
        testCaseId,
        {
          status: status, 
          $push: {
            testedBy: {
              testerName: testerName || "Unknown", 
              testDate: new Date().toISOString(), 
            },
          },
        },
        { new: true }  
      );
  
      if (!updatedTestCase) {
        return res.status(404).json({ msg: "TestCase not found" });
      }
      const associatedScenario = await testScenarioModel.findById(scenarioId);
      const associatedModule = await modulee.findById(moduleId);
      const associatedProject = await project.findById(projectId);
 

      const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioName}/${updatedTestCase.testCaseName}`;

      await log.create({
        action: "Test Status Updated",
        entityType: "TestCase",
        entityId: updatedTestCase._id,
        user: testerId,
        timestamp: Date.now(),
        path: `${updatedTestCase.testCaseName}`,
        details: `Status updated to: ${status} and TestedBy: ${testerName}`,
      });
  
      return res.json({
        msg: "TestCase status and tester updated successfully",
        data: updatedTestCase,
      });
    } catch (err) {
      console.log("Error: " + err);
      return res.status(500).json({ msg: "Server Error" });
    }
  };
  
module.exports = {createTestCase};
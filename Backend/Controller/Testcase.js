const testCaseModel = require("../Model/Testcase.model");
const testScenarioModel = require("../Model/Scenarios.model");
const project = require("../Model/Project.model");
const modulee = require("../Model/Module.model");
const user = require("../Model/User.model");
const testRunModel = require("../Model/Testrun.model");
const log = require("../Model/Log.model");

//TestCase Creation
const createTestCase = async (req, res) => {

  try {
    const createdById = req.user.id;
    const { testCaseId, caseType, scenarioId, description, projectId, moduleId, expectedResult, testCaseData, steps } = req.body;
    const test = await testCaseModel.findOne({ testCaseId });
    const testCaseDescription = description;

    if (test) {
      return res.status(200).json({ msg: "TestCase already Exist" });
    }
    else {
      const creat = await testCaseModel.create({
        moduleId: moduleId,
        scenarioId: scenarioId,
        testCaseId: testCaseId,
        caseType: caseType,
        testCaseData: testCaseData,
        steps: steps,
        testCaseDescription: testCaseDescription,
        expectedResult: expectedResult,
        createdBy: createdById,
      })

      const associatedScenario = await testScenarioModel.findById(scenarioId).populate('scenarioIdstr');
      const associatedModule = await modulee.findById(moduleId).populate('moduleName');
      const associatedProject = await project.findById(projectId);

      if (!associatedModule) {
        return res.status(200).json({ msg: "Module not found" });
      }

      const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioIdstr}/${creat.testCaseId}`;
      const UserName = await user.findById(createdById).populate('Name');


      //log

      await log.create({
        action: "Created",
        entityType: "TestCase",
        entityId: creat._id,
        user: UserName.Name,
        timestamp: Date.now(),
        path: path,
        projectId: projectId,
        details: `Created TestCase : ${testCaseId}`,

      })

      return res.status(200).json({ msg: "TestCase Created Successfully", data: creat });

    }
  }
  catch (err) {
    return res.status(500).json({ msg: "An error occurred while processing your request. Please try again later", error: err });
  }
}

//TestCase Status Update

const updateTestCaseStatus = async (req, res) => {

  try {
    const { testCaseId, testStatus, scenarioId, projectId, description, moduleId, testRegion, comments, bugReferenceId, bugPriority } = req.body;
    const testerId = req.user.id;
  
    if (!req.file) {
      console.log("no file");
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const fileUploaded = req.file;
    const base64String = fileUploaded.buffer.toString('base64');

    if (base64String) {
      console.log("Converted to base64")
    }
    else {
      console.log("Not Converted");
    }

    const tester = await user.findById(testerId).populate('Name');

    const testerName = tester ? tester.Name : "Unknown";
    const testCaseName = await testCaseModel.findById(testCaseId).populate('testCaseId');

    if (!testStatus) {
      return res.status(400).json({ msg: "Status is required" });
    }

    const updatedTestCase = await testCaseModel.findByIdAndUpdate(
      testCaseId,
      {
        testStatus: testStatus,
        testRegion: testRegion,
        comments: comments,
        bugPriority: bugPriority,
        bugReferenceId: bugReferenceId,
        reference: base64String,
        testedBy: {
          testerName: testerName,
          testDate: new Date().toISOString(),
        },

      },
      { new: true }
    );

    const updatedModule = await modulee.findByIdAndUpdate(
      moduleId,
      {
        lastTested: new Date().toISOString()
      },
      { new: true }
    );
  
   
    if (!updatedTestCase) {
      return res.status(404).json({ msg: "TestCase not found" });
    }

    // TestRun Create

    const associatedScenario = await testScenarioModel.findById(scenarioId)
      .populate('scenarioIdstr')
      .populate('taskId')
      .populate('subTaskId')

    const testCaseDetails = await testCaseModel.findById(testCaseId).populate('caseType').populate('testCaseDescription').populate('createdBy').populate('expectedResult').populate('testCaseData').populate('steps').populate('timestamp');
    const testCaseCreatedBy = await user.findById(testCaseDetails.createdBy).populate('Name');
    const testCaseCreatedByName = testCaseCreatedBy.Name;

    const associatedModule = await modulee.findById(moduleId);
    const associatedProject = await project.findById(projectId);



    const testRunCreate = await testRunModel.create({
      projectId : projectId,
      testCaseName: testCaseName.testCaseId,
      testScenario: associatedScenario.scenarioIdstr,
      taskId: associatedScenario.taskId,
      subTaskId: associatedScenario.subTaskId,
      testRegion: testRegion,
      testStatus: testStatus,
      testedBy: testerName,
      reference: base64String,
      testDescription :testCaseDetails.testCaseDescription,
      caseType : testCaseDetails.caseType,
      testCaseCreatedBy : testCaseCreatedBy.Name,
      bugPriority: bugPriority,
      bugReferenceId: bugReferenceId,
      comments : comments,
      expectedResult :testCaseDetails.expectedResult,
      testCaseData: testCaseDetails.testCaseData,
      steps : testCaseDetails.steps,
      testCaseCreatedAt :testCaseDetails.timestamp,
      timestamp : Date.now(),
    })  
    
  
    const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioIdstr}/${testCaseName.testCaseId}`;

    const TestCaseUpdateLog = await log.create({
      action: "Updated",
      entityType: "TestCase",
      entityId: updatedTestCase._id,
      user: testerName,
      timestamp: Date.now(),
      path: path,
      projectId : projectId,
      details: `Status updated to: ${testStatus}`,
    });


    return res.json({
      msg: "TestRun updated successfully",
      data: updatedTestCase,
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json({ msg: "Server Error" });
  }
};


//get TestCase

const getTestCase = async (req, res) => {
  try {
    const scenarioId = req.params.scenarioId;
    // console.log('Requested Scenario ID:', scenarioId);

    const sc = await testScenarioModel.findById(scenarioId);
    if (!sc) {
      return res.status(404).json({ msg: "Scenario not found" });
    }
    const testCas = await testCaseModel.find({ scenarioId: scenarioId }).populate('createdBy', 'Name');

    if (testCas.length === 0) {
      return res.status(404).json({ msg: "No TestCase found for this Scenario" });
    }

    res.status(200).json({ msg: "success", data: testCas });
  } catch (err) {
    console.error("Error fetching TestCase:", err);
    res.status(500).json({ msg: "Failed to fetch TestCase" });
  }
};

//Generate Id

const getTestIds = async (req, res) => {

  try {
    
    const {scenarioId} = req.query;  

    if (!scenarioId) {
      return res.status(400).json({ msg: "scenarioId" });
    }
   
    const scenarioidgen = await testScenarioModel.findById(scenarioId);
    if (!scenarioidgen) {
      return res.status(404).json({ message: "Scebario not found" });
    }
    const scenarioid = scenarioidgen.scenarioIdstr;


    const TestCaseCount = await testCaseModel.countDocuments({scenarioId:scenarioId});

    const result = `${scenarioid}_TC${(TestCaseCount + 1).toString().padStart(3, '0')}`;

    // console.log(result);
    return res.status(200).json({ msg : "success",genSceId: result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//deleteTestCase
const deleteTestCase = async (req, res) => {
  try {
    const testCaseId = req.params.testCaseId;
    const { projectId, moduleId,scenarioId} = req.query;
    const deletedById = req.user.id;
    const testCase = await testCaseModel.findById(testCaseId);
    if (!testCase) {
      return res.json({ msg: "TestCase does not exist" });
    }
    const moduleName = await modulee.findById(moduleId).populate('moduleName');
    const scenarioName = await testScenarioModel.findById(scenarioId).populate('scenarioIdstr');
    const testCaseName = await testCaseModel.findById(testCaseId).populate('testCaseId');
    const projectName = await project.findById(projectId).populate('projectName');
    //delete
    await testCaseModel.findByIdAndDelete(testCaseId);
    const UserName = await user.findById(deletedById).populate('Name');
    const path = `${projectName.projectName}/${moduleName.moduleName}/${scenarioName.scenarioIdstr}/${testCaseName.testCaseId}`;
    // Log the action
    try {
      const deleteTestCaselog = await log.create({
        action: "Deleted",
        entityType: "TestCase",
        entityId: testCaseId,
        user: UserName.Name,
        path: path,
        projectId: projectId,
        timestamp : Date.now(),
        details: `TestCase Deleted: ${testCaseName.testCaseId}`
      });
    } catch (err) {
      console.log(err);
    }
    return res.status(200).json({ msg: 'TestCase deleted successfully' });
  } catch (err) {
    console.error("Error deleting TestCase:", err);
    return res.status(500).json({ msg: 'Failed to delete TestCase' });
  }
};




module.exports = { createTestCase, updateTestCaseStatus, getTestCase,getTestIds,deleteTestCase };

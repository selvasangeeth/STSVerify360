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
      return res.json({ msg: "TestCase already Exist" });
    }
    else {
      const creat = await testCaseModel.create({
        moduleId : moduleId,
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
        return res.status(404).json({ msg: "Module not found" });
      }
      const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioIdstr}/${creat.testCaseId}`;
      const UserName = await user.findById(createdById).populate('Name'); 
      try {
        console.log("log creating");
       const logDetails =  await log.create({
          action: "Created",
          entityType: "TestCase",
          entityId: creat._id,
          user: UserName.Name,
          timestamp: Date.now(),
          path: path,
          details: `Created TestCase : ${testCaseId}`,

        })

        // console.log("Log TestCase Created :"+logDetails);
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
    const { testCaseId, testStatus, scenarioId, projectId, description, moduleId, testRegion, comments, bugReferenceId, bugPriority } = req.body;
    const testerId = req.user.id;
    console.log(" projectId : "+projectId);
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

    console.log("testCase Updating....");
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
    console.log("Success update");
    // console.log("updated TestCase : " + updatedTestCase)
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
    console.log("Name of creatoir"+testCaseCreatedByName)
    const associatedModule = await modulee.findById(moduleId);
    const associatedProject = await project.findById(projectId);


    console.log("TestRun Creating....");
    console.log(comments);

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
    console.log("TestRun Created")
    console.log(testRunCreate);
    const path = `${associatedProject.projectName}/${associatedModule.moduleName}/${associatedScenario.scenarioIdstr}/${testCaseName.testCaseId}`;
    console.log("TestLog Creating....")
    const TestCaseUpdateLog = await log.create({
      action: "Test Status Updated",
      entityType: "TestCase",
      entityId: updatedTestCase._id,
      user: testerName,
      timestamp: Date.now(),
      path: path,
      details: `Status updated to: ${testStatus} and TestedBy: ${testerName}`,
    });

    console.log("TestLog Created Success")
    // console.log("TestLog"+TestCaseUpdateLog);

    return res.json({
      msg: "TestRun updated successfully",
      data: updatedTestCase,
    });
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json({ msg: "Server Error" });
  }
};

//getTestCase

// const getTestCase= async (req, res) => {
//   try {
//     const scenarioId= req.params.scenarioId; 

//     const sc = await testScenarioModel.findById(scenarioId);
//     if (!sc) {
//       return res.status(404).json({ msg: "Scenario not found" });
//     }
//     const testCas = await testCaseModel.find({  scenario: scenarioId });

//     if (testCas.length === 0) {
//       return res.status(404).json({ msg: "No TestCase found for this Scenario" });
//     }
//     res.status(200).json({ msg :"success",data : testCas });
//   } catch (err) {
//     console.error("Error fetching TestCase:", err);
//     res.status(500).json({ msg: "Failed to fetch TestCase" });
//   }
// };


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


module.exports = { createTestCase, updateTestCaseStatus, getTestCase };

const testRunModel = require("../Model/Testrun.model");
const testScenarioModel = require("../Model/Scenarios.model");

const getTestRuns = async (req, res) => {
  const projectId = req.params.projectId;
  const tests = await testRunModel.find({ projectId: projectId }).sort({timestamp :-1});
  if (!tests || tests.length === 0) {
    return res.status(404).json({ msg: "No test runs found for the selected project." });
  }
  // console.log("Test Runs found:", tests);
  return res.status(200).json({ msg: "Test Runs found successfully", data: tests });
}
module.exports = { getTestRuns };
//import Model

const testRunModel = require("../Model/Testrun.model");


const getTestRuns = async (req, res) => {

  try
  {
  const projectId = req.params.projectId;
  const tests = await testRunModel.find({ projectId: projectId }).sort({timestamp :-1});

  if (!tests || tests.length === 0) {
    return res.status(200).json({ msg: "No test runs found for the selected project." });
  }
  
  return res.status(200).json({ msg: "Test Runs found successfully", data: tests });
}
catch(err)
{
  return res.status(500).json({ msg: "An error occurred while processing your request. Please try again later", error: err });
}
}
module.exports = { getTestRuns };
const express = require("express");
const Module = require("../Model/Module.model");
const Scenario = require("../Model/Scenarios.model");
const TestCase = require("../Model/Testcase.model");

const router = express.Router();


const getMetricsModules = async (req, res) => {
  try {
    const modules = await Module.find({ projectId: req.params.projectId }).select("moduleName _id");
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const getMetricsScenario = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ module: req.params.moduleId }).select("scenarioIdstr _id");
    res.status(200).json(scenarios);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const  getMetricsTestCase = async (req, res) => {
  try {
    const testCases = await TestCase.find({ scenarioId: req.params.scenarioId }).select("testStatus");
    const statusCount = {
      passed: 0,
      failed: 0,
      untested: 0
    };

  
    testCases.forEach(testCase => {
      if (testCase.testStatus === "Pass") {
        statusCount.passed++;
      } else if (testCase.testStatus === "Fail") {
        statusCount.failed++;
      } else {
        statusCount.untested++;
      }
    });

    // console.log(statusCount);
    res.status(200).json(statusCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// get status for whole module 
const getMetricsTestCaseByModule = async (req, res) => {
  try {

    const scenarios = await Scenario.find({ module: req.params.moduleId }).select("_id");

   
    const testCases = await TestCase.find({ scenarioId: { $in: scenarios.map(scenario => scenario._id) } }).select("testStatus");

    const statusCount = {
      passed: 0,
      failed: 0,
      untested: 0
    };

   
    testCases.forEach(testCase => {
      if (testCase.testStatus === "Pass") {
        statusCount.passed++;
      } else if (testCase.testStatus === "Fail") {
        statusCount.failed++;
      } else {
        statusCount.untested++;
      }
    });

    res.status(200).json(statusCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getMetricsModules,getMetricsScenario,getMetricsTestCase,getMetricsTestCaseByModule };

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

// Get all scenarios for a specific module
const getMetricsScenario = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ module: req.params.moduleId }).select("scenarioIdstr _id");
    res.status(200).json(scenarios);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get test case status for a specific scenario
const  getMetricsTestCase = async (req, res) => {
  try {
    const testCases = await TestCase.find({ scenarioId: req.params.scenarioId }).select("testStatus");
    const statusCount = {
      passed: 0,
      failed: 0,
      untested: 0
    };

    // Count the number of passed, failed, and untested test cases
    testCases.forEach(testCase => {
      if (testCase.testStatus === "Passed") {
        statusCount.passed++;
      } else if (testCase.testStatus === "Failed") {
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

module.exports = { getMetricsModules,getMetricsScenario,getMetricsTestCase };

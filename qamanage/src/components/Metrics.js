import React, { useState, useEffect } from "react";
import axios from "./axios"; // Import axios to make API requests
import { Pie } from "react-chartjs-2"; // Import the Pie chart from chart.js
import { Chart as ChartJS } from "chart.js/auto"; // Import Chart.js for Pie chart

const Metrics = ({ selectedProject }) => {
  const [modules, setModules] = useState([]); // Store modules related to projectId
  const [selectedModule, setSelectedModule] = useState(""); // Store selected module
  const [scenarios, setScenarios] = useState([]); // Store scenarios related to selected module
  const [selectedScenario, setSelectedScenario] = useState(""); // Store selected scenario
  const [testCaseStats, setTestCaseStats] = useState({ passed: 0, failed: 0, untested: 0 }); // Store test case stats (passed, failed, untested)

  // Fetch modules when projectId is selected
  useEffect(() => {
    if (selectedProject && selectedProject.projectId) { // Ensure selectedProject is not null and contains _id
      axios
        .get(`/metrics/getModules/${selectedProject.projectId}`) 
        .then((response) => setModules(response.data))
        .catch((error) => console.error("Error fetching modules:", error));
    }
  }, [selectedProject]);

  // Fetch scenarios when a module is selected
  useEffect(() => {
    if (selectedModule) {
      axios
        .get(`/metrics/getScenarios/${selectedModule}`) // API call to fetch scenarios by moduleId
        .then((response) => setScenarios(response.data))
        .catch((error) => console.error("Error fetching scenarios:", error));
        
      // Fetch test case status for the whole module when a module is selected
      axios
        .put(`/metrics/getTestCasesByModule/${selectedModule}`) // API call to fetch test case statuses for the entire module
        .then((response) => setTestCaseStats(response.data))
        .catch((error) => console.error("Error fetching test cases for module:", error));
    }
  }, [selectedModule]);

  // Fetch test case status when a scenario is selected
  useEffect(() => {
    if (selectedScenario) {
      axios
        .put(`/metrics/getTestCases/${selectedScenario}`) // API call to fetch test case statuses by scenarioId
        .then((response) => setTestCaseStats(response.data))
        .catch((error) => console.error("Error fetching test cases:", error));
    }
  }, [selectedScenario]);

  // Prepare data for Pie chart
  const chartData = {
    labels: ["Passed", "Failed", "Untested"],
    datasets: [
      {
        data: [testCaseStats.passed, testCaseStats.failed, testCaseStats.untested],
        backgroundColor: ["green", "red", "gray"], // Color for each status
      },
    ],
  };

  // Calculate total test cases
  const totalTestCases = testCaseStats.passed + testCaseStats.failed + testCaseStats.untested;

  return (
    <div className="metrics-container">
      <h3>Select Module and Scenario</h3>

      {/* Module Dropdown */}
      <select onChange={(e) => setSelectedModule(e.target.value)} value={selectedModule}>
        <option value="">Select Module</option>
        {modules.map((module) => (
          <option key={module._id} value={module._id}>
            {module.moduleName}
          </option>
        ))}
      </select>

      {/* Scenario Dropdown */}
      <select onChange={(e) => setSelectedScenario(e.target.value)} value={selectedScenario}>
        <option value="">Select Scenario</option>
        {scenarios.map((scenario) => (
          <option key={scenario._id} value={scenario._id}>
            {scenario.scenarioIdstr}
          </option>
        ))}
      </select>

      {/* Display Pie Chart when a scenario is selected */}
      {selectedScenario || selectedModule ? (
        <div className="chart-container">
          <h4>Test Case Metrics</h4>
          <div className="pie-container">
            <Pie data={chartData} options={{
              responsive: true,
              maintainAspectRatio: false, // Allows resizing based on the container
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} />
          </div>
          
          {/* Display Test Case Stats */}
          <div className="test-case-stats">
            <p>Total Test Cases: {totalTestCases}</p>
            <p>No of Test Cases Passed: {testCaseStats.passed}</p>
            <p>No of Test Cases Failed: {testCaseStats.failed}</p>
            <p>No of Test Cases Untested: {testCaseStats.untested}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Metrics;

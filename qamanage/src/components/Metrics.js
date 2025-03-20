import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Chart.js 3.x or higher

const Metrics = ({ projectId }) => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [testCaseStats, setTestCaseStats] = useState({ passed: 0, failed: 0, untested: 0 });

  // Fetch modules when projectId is selected
  useEffect(() => {
    if (projectId) {
      axios
        .get(`/api/modules/${projectId}`)
        .then(response => setModules(response.data))
        .catch(error => console.error("Error fetching modules:", error));
    }
  }, [projectId]);

  // Fetch scenarios when a module is selected
  useEffect(() => {
    if (selectedModule) {
      axios
        .get(`/api/scenarios/${selectedModule}`)
        .then(response => setScenarios(response.data))
        .catch(error => console.error("Error fetching scenarios:", error));
    }
  }, [selectedModule]);

  // Fetch test case status when a scenario is selected
  useEffect(() => {
    if (selectedScenario) {
      axios
        .get(`/api/testCases/${selectedScenario}`)
        .then(response => setTestCaseStats(response.data))
        .catch(error => console.error("Error fetching test cases:", error));
    }
  }, [selectedScenario]);

  // Pie chart data
  const chartData = {
    labels: ["Passed", "Failed", "Untested"],
    datasets: [
      {
        data: [testCaseStats.passed, testCaseStats.failed, testCaseStats.untested],
        backgroundColor: ["green", "red", "gray"],
      },
    ],
  };

  return (
    <div>
      <h3>Select Module and Scenario</h3>

      {/* Module Dropdown */}
      <select onChange={e => setSelectedModule(e.target.value)} value={selectedModule}>
        <option value="">Select Module</option>
        {modules.map(module => (
          <option key={module._id} value={module._id}>
            {module.moduleName}
          </option>
        ))}
      </select>

      {/* Scenario Dropdown */}
      <select onChange={e => setSelectedScenario(e.target.value)} value={selectedScenario}>
        <option value="">Select Scenario</option>
        {scenarios.map(scenario => (
          <option key={scenario._id} value={scenario._id}>
            {scenario.scenarioIdstr}
          </option>
        ))}
      </select>

      {/* Display Pie Chart */}
      {selectedScenario && (
        <div>
          <h4>Test Case Metrics</h4>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Metrics;

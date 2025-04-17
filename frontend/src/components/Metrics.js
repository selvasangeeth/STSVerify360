import React, { useState, useEffect } from "react";
import axios from "./axios"; // Import axios to make API requests
import { Pie, Bar } from 'react-chartjs-2'; // Import the Pie and Bar charts from chart.js
import 'chart.js/auto'; // Import Chart.js for Pie and Bar charts
import './Metrics.css'; // Import the CSS file

const Metrics = ({ selectedProject }) => {
  const [activeTab, setActiveTab] = useState("status");
  const [metrics, setMetrics] = useState([]);
  const [bugData, setBugData] = useState([]);
  const [bugPriorityData, setBugPriorityData] = useState([]);
  const [modules, setModules] = useState([]); // Store modules related to projectId
  const [selectedModule, setSelectedModule] = useState(""); // Store selected module
  const [scenarios, setScenarios] = useState([]); // Store scenarios related to selected module
  const [selectedScenario, setSelectedScenario] = useState(""); // Store selected scenario
  const [testCaseStats, setTestCaseStats] = useState({ passed: 0, failed: 0, untested: 0 }); // Store test case stats (passed, failed, untested)

  useEffect(() => {
    if (selectedProject && selectedProject.projectId) {
      axios
        .get(`/metrics/getMetrics/${selectedProject.projectId}`)
        .then((response) => setMetrics(response.data))
        .catch((error) => console.error("Error fetching metrics:", error));

      axios
        .get(`/metrics/getBugs/${selectedProject.projectId}`)
        .then((response) => setBugData(response.data))
        .catch((error) => console.error("Error fetching bug data:", error));

      axios
        .get(`/metrics/getBugPriority/${selectedProject.projectId}`)
        .then((response) => setBugPriorityData(response.data))
        .catch((error) => console.error("Error fetching bug priority data:", error));

      axios
        .get(`/metrics/getModules/${selectedProject.projectId}`) 
        .then((response) => setModules(response.data))
        .catch((error) => console.error("Error fetching modules:", error));
    }
  }, [selectedProject]);

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

  useEffect(() => {
    if (selectedScenario) {
      axios
        .put(`/metrics/getTestCases/${selectedScenario}`) // API call to fetch test case statuses by scenarioId
        .then((response) => setTestCaseStats(response.data))
        .catch((error) => console.error("Error fetching test cases:", error));
    }
  }, [selectedScenario]);

  const renderContent = () => {
    switch (activeTab) {
      case "bugs":
        return (
          <div className="chart-container">
            <Bar
              data={{
                labels: bugData.map((bug) => bug.moduleName),
                datasets: [
                  {
                    label: "Number of Bugs",
                    data: bugData.map((bug) => bug.count),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        );
      case "bugPriority":
        return (
          <div className="chart-container">
            <Bar
              data={{
                labels: bugPriorityData.map((bug) => bug.moduleName),
                datasets: [
                  {
                    label: "High Priority",
                    data: bugPriorityData.map((bug) => bug.highPriority),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                  {
                    label: "Medium Priority",
                    data: bugPriorityData.map((bug) => bug.mediumPriority),
                    backgroundColor: "rgba(255, 206, 86, 0.6)",
                  },
                  {
                    label: "Low Priority",
                    data: bugPriorityData.map((bug) => bug.lowPriority),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        );
      case "status":
      default:
        const chartData = {
          labels: ["Passed", "Failed", "Untested"],
          datasets: [
            {
              data: [testCaseStats.passed, testCaseStats.failed, testCaseStats.untested],
              backgroundColor: ["#4caf50", "#f44336", "#9e9e9e"],
            },
          ],
        };

        const totalTestCases = testCaseStats.passed + testCaseStats.failed + testCaseStats.untested;

        return (
          <div className="chart-container">
            <Pie
              data={chartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
            <div className="status-info">
              <p>Total Cases: {totalTestCases}</p>
              <p>No of Test Cases Passed: {testCaseStats.passed}</p>
              <p>No of Test Cases Failed: {testCaseStats.failed}</p>
              <p>No of Test Cases Untested: {testCaseStats.untested}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <div className="metrics-tabs">
          <button
            className={`metrics-tab ${activeTab === "bugs" ? "active" : ""}`}
            onClick={() => setActiveTab("bugs")}
          >
            Bugs
          </button>
          <button
            className={`metrics-tab ${activeTab === "bugPriority" ? "active" : ""}`}
            onClick={() => setActiveTab("bugPriority")}
          >
            Bug Priority
          </button>
          <button
            className={`metrics-tab ${activeTab === "status" ? "active" : ""}`}
            onClick={() => setActiveTab("status")}
          >
            Status
          </button>
        </div>
      </div>
      <div className="filters">
        <div className="dropdown">
          <select onChange={(e) => setSelectedModule(e.target.value)} value={selectedModule}>
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.moduleName}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown">
          <select onChange={(e) => setSelectedScenario(e.target.value)} value={selectedScenario}>
            <option value="">Select Scenario</option>
            {scenarios.map((scenario) => (
              <option key={scenario._id} value={scenario._id}>
                {scenario.scenarioIdstr}
              </option>
            ))}
          </select>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default Metrics;
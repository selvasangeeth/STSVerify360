import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import './TestCaseView.css';

const TestCaseView = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [scenarios, setScenarios] = useState([
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      createdDate: "March 05 2025",
      cases: 50
    }
  ]);

  const handleAddScenario = (scenarioData) => {
    const newScenario = {
      taskId: scenarioData.taskId,
      subTaskId: scenarioData.subTaskId,
      testScenario: scenarioData.testScenario,
      description: scenarioData.description,
      createdBy: "Surya Prabhu T",
      createdDate: new Date().toLocaleDateString(),
      cases: 50
    };
    setScenarios([...scenarios, newScenario]);
  };

  return (
    <div className="test-cases-view">
      <div className="test-cases-fixed-header">
        <div className="breadcrumb">
          <span>Project name 1</span>
          <span>/</span>
          <span>Module Name 1</span>
          <span>/</span>
          <span>Submodule Name 1</span>
          <span>/</span>
          <span>Scenarios</span>
        </div>

        <div className="test-cases-header">
          <div className="title-search">
            <span>Scenarios</span>
            <div className="search-box">
              <Search size={16} color="#666" />
              <input type="text" placeholder="Search by Test Scenario ID" />
            </div>
          </div>
          <div className="header-right">
            <div className="scenario-selector">
              <div className="scenario-name">
                <span>Module name 1</span>
              </div>
            </div>
            <button 
              className="add-scenario-btn" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              Add Scenario
            </button>
          </div>
        </div>
      </div>

      <div className="scenarios-scrollable-content">
        <div className="scenarios-table-container">
          <table className="scenarios-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Sub Task ID</th>
                <th>Test Scenario</th>
                <th>Created By</th>
                <th>No of Cases</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => (
                <tr key={index}>
                  <td>{scenario.taskId}</td>
                  <td>{scenario.subTaskId}</td>
                  <td>
                    <div className="test-scenario-column">
                      <div className="test-scenario-title">{scenario.testScenario}</div>
                      <div className="test-scenario-desc">{scenario.description}</div>
                    </div>
                  </td>
                  <td>
                    <div>{scenario.createdBy}</div>
                    <div className="date">{scenario.createdDate}</div>
                  </td>
                  <td>{scenario.cases}</td>
                  <td>
                    <button className="edit-btn">
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestCaseView; 
import React, { useState } from 'react';
import './Metrics.css';

const Metrics = () => {
  const [activeView, setActiveView] = useState('bugs');
  
  // Sample data - replace with your actual data
  const moduleData = [
    { name: 'Module name 1', bugs: 55 },
    { name: 'Module name 2', bugs: 40 },
    { name: 'Module name 3', bugs: 25 },
    { name: 'Module name 4', bugs: 45 },
    { name: 'Module name 5', bugs: 15 },
    { name: 'Module name 6', bugs: 65 },
    { name: 'Module name 7', bugs: 35 },
    { name: 'Module name 8', bugs: 30 },
    { name: 'Module name 9', bugs: 20 },
    { name: 'Module name 10', bugs: 50 },
    { name: 'Module name 11', bugs: 45 }
  ];

  const priorityData = moduleData.map(module => ({
    name: module.name,
    highPriority: Math.floor(Math.random() * 30) + 20,
    mediumPriority: Math.floor(Math.random() * 20) + 10,
    lowPriority: Math.floor(Math.random() * 10) + 5
  }));

  return (
    <div className="metrics-page">
      <div className="metrics-header">
        <div className="project-info">
          <span>Project name 1 / Test Runs</span>
        </div>
        <div className="user-info">
          <span>SURYA PRABHU</span>
          <span className="user-role">JUNIOR QA TRAINEE</span>
        </div>
      </div>

      <div className="metrics-content">
        <div className="view-selector">
          <button 
            className={`view-button ${activeView === 'bugs' ? 'active' : ''}`}
            onClick={() => setActiveView('bugs')}
          >
            Bugs
          </button>
          <button 
            className={`view-button ${activeView === 'bugPriority' ? 'active' : ''}`}
            onClick={() => setActiveView('bugPriority')}
          >
            Bug Priority
          </button>
          <button 
            className={`view-button ${activeView === 'status' ? 'active' : ''}`}
            onClick={() => setActiveView('status')}
          >
            Status
          </button>
        </div>

        <div className="filters">
          <select className="filter-select">
            <option>Module Name 1</option>
          </select>
          <select className="filter-select">
            <option>Scenario</option>
          </select>
          <select className="filter-select">
            <option>This Month</option>
          </select>
        </div>

        {activeView === 'bugs' && (
          <div className="bugs-chart">
            <h3>Number of Bugs</h3>
            <div className="horizontal-chart">
              {moduleData.map((module, index) => (
                <div className="chart-row" key={index}>
                  <span className="module-name">{module.name}</span>
                  <div className="bar-container">
                    <div 
                      className="bar"
                      style={{ width: `${(module.bugs/85) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="x-axis">
              {[...Array(18)].map((_, i) => (
                <span key={i}>{i * 5}</span>
              ))}
            </div>
          </div>
        )}

        {activeView === 'bugPriority' && (
          <div className="priority-chart">
            <h3>Number of Bugs by Priority</h3>
            <div className="horizontal-chart">
              {priorityData.map((module, index) => (
                <div className="chart-row" key={index}>
                  <span className="module-name">{module.name}</span>
                  <div className="bar-container">
                    <div className="priority-bars">
                      <div 
                        className="priority-bar high"
                        style={{ width: `${(module.highPriority/85) * 100}%` }}
                      />
                      <div 
                        className="priority-bar medium"
                        style={{ width: `${(module.mediumPriority/85) * 100}%` }}
                      />
                      <div 
                        className="priority-bar low"
                        style={{ width: `${(module.lowPriority/85) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="priority-legend">
              <div className="legend-item">
                <span className="legend-color high"></span>
                <span>High Priority</span>
              </div>
              <div className="legend-item">
                <span className="legend-color medium"></span>
                <span>Medium Priority</span>
              </div>
              <div className="legend-item">
                <span className="legend-color low"></span>
                <span>Low Priority</span>
              </div>
            </div>
          </div>
        )}

        {activeView === 'status' && (
          <div className="status-chart">
            <div className="pie-chart">
              <h3>Total Cases: 100</h3>
              <div className="pie-container">
                <div className="pie-segment passed" style={{ '--percentage': '25' }}></div>
                <div className="pie-segment failed" style={{ '--percentage': '25' }}></div>
                <div className="pie-segment unexecuted" style={{ '--percentage': '50' }}></div>
              </div>
              <div className="status-legend">
                <div className="legend-item">
                  <span className="status-color passed"></span>
                  <span>25 Passed | 25% of the cases were Set to Passed</span>
                </div>
                <div className="legend-item">
                  <span className="status-color failed"></span>
                  <span>25 Failed | 25% of the cases were Set to Failed</span>
                </div>
                <div className="legend-item">
                  <span className="status-color unexecuted"></span>
                  <span>50 Unexecuted | 50% of the cases were Unexecuted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Metrics; 
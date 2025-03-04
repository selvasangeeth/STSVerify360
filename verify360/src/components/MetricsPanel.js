import { useState } from "react"
import "./MetricsPanel.css"

const MetricsPanel = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const teamMetrics = {
    totalTestCases: 150,
    totalTestScenarios: 75,
    passedTests: 120,
    failedTests: 30,
    executedTests: 150,
  }

  const userMetrics = {
    "Surya Prabhu T": {
      testCases: 45,
      testScenarios: 20,
      passed: 38,
      failed: 7,
      executed: 45,
    },
    Deva: {
      testCases: 30,
      testScenarios: 15,
      passed: 25,
      failed: 5,
      executed: 30,
    },
    Priya: {
      testCases: 25,
      testScenarios: 12,
      passed: 20,
      failed: 5,
      executed: 25,
    },
    Dyanahesh: {
      testCases: 28,
      testScenarios: 14,
      passed: 22,
      failed: 6,
      executed: 28,
    },
    Pavithra: {
      testCases: 22,
      testScenarios: 14,
      passed: 15,
      failed: 7,
      executed: 22,
    },
  }

  const MetricsCard = ({ title, metrics }) => (
    <div className="metrics-card">
      <h3>{title}</h3>
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-value">{metrics.testCases}</span>
          <span className="metric-label">Test Cases</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{metrics.testScenarios}</span>
          <span className="metric-label">Test Scenarios</span>
        </div>
        <div className="metric-item">
          <span className="metric-value passed">{metrics.passed}</span>
          <span className="metric-label">Passed</span>
        </div>
        <div className="metric-item">
          <span className="metric-value failed">{metrics.failed}</span>
          <span className="metric-label">Failed</span>
        </div>
        <div className="metric-item">
          <span className="metric-value">{metrics.executed}</span>
          <span className="metric-label">Executed</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="metrics-panel">
      <div className="metrics-container">
        <div className="overall-metrics">
          <MetricsCard title="Overall Team Metrics" metrics={teamMetrics} />
        </div>
        <div className="user-metrics">
          <div className="user-list">
            {Object.keys(userMetrics).map((user) => (
              <button
                key={user}
                className={`user-button ${selectedUser === user ? "selected" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </button>
            ))}
          </div>
          {selectedUser && <MetricsCard title={`${selectedUser}'s Metrics`} metrics={userMetrics[selectedUser]} />}
        </div>
      </div>
    </div>
  )
}

export default MetricsPanel


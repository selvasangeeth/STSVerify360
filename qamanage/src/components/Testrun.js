import React, { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from './axios'; // Make sure to import axios
import './Testrun.css';

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export { Modal };

const Testrun = ({ selectedProject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testRegion, setTestRegion] = useState("Test Region");
  const [testStatus, setTestStatus] = useState("All Statuses");
  const [timePeriod, setTimePeriod] = useState("This Month");
  const [showModal, setShowModal] = useState(false);
  const [customDate, setCustomDate] = useState(null);
  const [testRunsData, setTestRunsData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    if (selectedProject) {
      console.log("Selected Project ID:", selectedProject.projectId);
      axios
        .get(`/getTestRuns/${selectedProject.projectId}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            setTestRunsData(response.data.data);
            console.log(response.data.data);
          } else {
            console.error("Expected an array of test runs in response.data.data, but got:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching test runs:", error);
        });
    }
  }, [selectedProject]);

  const handleTimePeriodChange = (e) => {
    const value = e.target.value;
    setTimePeriod(value);
    if (value === "Custom") {
      setShowModal(true);
    }
  };

  const handleDateChange = (date) => {
    setCustomDate(date);
    setShowModal(false);
  };

  const handleEyeClick = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const filteredData = (Array.isArray(testRunsData) ? testRunsData : []).filter(
    (test) =>
      test.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subTaskId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="test-runs-container">
      <h1>Test Runs for {selectedProject ? selectedProject.projectName : "Select a Project"}</h1>
      <div className="search-filters-row">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Task ID / Sub Task ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={testRegion} onChange={(e) => setTestRegion(e.target.value)}>
            <option>Test Region</option>
            <option>Sprint</option>
            <option>Staging</option>
            <option>UAT</option>
            <option>Live</option>
          </select>
          <select value={testStatus} onChange={(e) => setTestStatus(e.target.value)}>
            <option>All Statuses</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Failed</option>
          </select>
          <select value={timePeriod} onChange={handleTimePeriodChange}>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom</option>
          </select>
        </div>
      </div>
      <table className="test-runs-table">
        <thead>
          <tr>
            <th>Date / Time</th>
            <th>Test Scenario ID</th>
            <th>Test Case ID</th>
            <th>Test Cases</th>
            <th>Sub Task ID</th>
            <th>Test Status</th>
            <th>Tested By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((test, index) => (
              <tr key={index}>
                <td>{new Date(test.timestamp).toLocaleString()}</td>
                <td>{test.testScenario}</td>
                <td>{test.testCaseName}</td>
                <td>{test.testDescription}</td>
                <td>{test.subTaskId}</td>
                <td>{test.testStatus}</td>
                <td>{test.testedBy}</td>
                <td className="action-cell">
                  <FaEye className="action-eye" onClick={() => handleEyeClick(test)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No Test Runs Found</td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && selectedTest && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="test-case-details">
            <h2>Test Case Details</h2>

            <div className="detail-row">
              <span className="label">Test Case ID</span>
              <span className="value">{selectedTest.testCaseName}</span>
            </div>

            <div className="detail-row">
              <span className="label">Test Case Type</span>
              <span className="value">
                <span className="test-status pass">{selectedTest.caseType}</span>
              </span>
            </div>

            <div className="detail-row">
              <span className="label">Created By</span>
              <span className="value">{selectedTest.testCaseCreatedBy}</span>
            </div>

            <div className="detail-row">
              <span className="label">Created At</span>
              <span className="value">{new Date(selectedTest.testCaseCreatedAt).toLocaleString()}</span>
            </div>

            <div className="detail-row">
              <span className="label">Test Case Description</span>
              <span className="value">{selectedTest.testDescription}</span>
            </div>

            <div className="detail-row">
              <span className="label">Expected Result</span>
              <span className="value">{selectedTest.expectedResult}</span>
            </div>

            <div className="detail-row">
              <span className="label">Test Case Data</span>
              <span className="value">{selectedTest.testCaseData}</span>
            </div>

            <div className="detail-row">
              <span className="label">Steps</span>
              <span className="value">{selectedTest.steps}</span>
            </div>

            <div className="result-section">
              <h3>Result</h3>

              <div className="detail-row">
                <span className="label">Tested By</span>
                <span className="value">{selectedTest.testedBy}</span>
              </div>

              <div className="detail-row">
                <span className="label">Tested On</span>
                <span className="value">{new Date(selectedTest.timestamp).toLocaleString()}</span>
              </div>

              <div className="detail-row">
                <span className="label">Test Region</span>
                <span className="value">
                  <span className="test-status live">{selectedTest.testRegion}</span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Test Status</span>
                <span className="value">
                  <span className={`test-status ${selectedTest.testStatus?.toLowerCase()}`}>
                    {selectedTest.testStatus}
                  </span>
                </span>
              </div>

              <div className="detail-row">
                <span className="label">Comments</span>
                <span className="value">{selectedTest.comments}</span>
              </div>
              <div className="detail-row">
                <span className="label">Bug Reference ID</span>
                <span className="value">{selectedTest.bugReferenceId}</span>
              </div>

              
              {selectedTest.reference.startsWith('/9j/') ? (
                <img
                  src={`data:image/jpeg;base64,${selectedTest.reference}`}
                  alt="Test reference"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : selectedTest.reference.startsWith('iVBORw0KGgo') ? (
                <img
                  src={`data:image/png;base64,${selectedTest.reference}`}
                  alt="Test reference"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : selectedTest.reference.startsWith('R0lG') ? (
                <img
                  src={`data:image/gif;base64,${selectedTest.reference}`}
                  alt="Test reference"
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : selectedTest.reference.startsWith('AAAB') ? ( // Example prefix for base64-encoded audio/video (MP4, WebM, etc.)
                <video controls style={{ width: '100%' }}>
                  <source
                    src={`data:video/mp4;base64,${selectedTest.reference}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Unsupported media type</p>
              )}

              <div className="detail-row">
                <span className="label">Bug Priority</span>
                <span className="value">
                  <span className="test-status fail">{selectedTest.bugPriority}</span>
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Testrun;
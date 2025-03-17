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

const Testrun = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testRegion, setTestRegion] = useState("Test Region");
  const [testStatus, setTestStatus] = useState("All Statuses");
  const [timePeriod, setTimePeriod] = useState("This Month");
  const [showModal, setShowModal] = useState(false);
  const [customDate, setCustomDate] = useState(null);
  const [testRunsData, setTestRunsData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

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

  // Fetch test runs data from the backend
  useEffect(() => {
    axios
      .get("/getAllTestRuns")  // Replace with your actual API URL
      .then((response) => {
        setTestRunsData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching test runs:", error);
      });
  }, []);

  const filteredData = testRunsData.filter(
    (test) =>
      test.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subTaskId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="test-runs-container">
      <h1>Test Runs</h1>
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
            <th>Test Scenario</th>
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
                <td>{test.taskId}</td>
                <td>{test.subTaskId}</td>
                <td>{test.scenarioName}</td>
                <td>
                  {test.testedBy}
                  <br />
                  <span className="status-badge">{test.status}</span>
                </td>
                <td>{test.regions.reduce((acc, region) => acc + region.totalTestCases, 0)}</td>
                <td>
                  {test.regions.map((region, idx) => (
                    <div key={idx}>
                      {region.testRegion}: <span className="pass">{region.passedTestCases}</span> |
                      <span className="fail">{region.failedTestCases}</span> |
                      <span className="unexecuted">
                        {region.totalTestCases - (region.passedTestCases + region.failedTestCases)}
                      </span>
                    </div>
                  ))}
                </td>
                <td>
                  <span className={`test-status ${test.regions[0]?.overallTestStatus.toLowerCase()}`}>
                    {test.regions[0]?.overallTestStatus}
                  </span>
                </td>
                <td className="action-cell">
                  <FaEye className="action-eye" onClick={() => handleEyeClick(test)} /> {/* Add eye icon here */}
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
            <p><strong>Test Case ID:</strong> {selectedTest.taskId}</p>
            <p><strong>Test Case Type:</strong> {selectedTest.testCaseType}</p>
            <p><strong>Created By:</strong> {selectedTest.createdBy}</p>
            <p><strong>Created At:</strong> {selectedTest.createdAt}</p>
            <p><strong>Test Case Description:</strong> {selectedTest.scenarioName}</p>
            <p><strong>Expected Result:</strong> {selectedTest.expectedResult}</p>
            <p><strong>Steps:</strong> {selectedTest.steps}</p>
            <p><strong>Test Case Data:</strong> {selectedTest.testCaseData}</p>
            <h3>Result</h3>
            <p><strong>Tested By:</strong> {selectedTest.testedBy}</p>
            <p><strong>Tested On:</strong> {selectedTest.testedOn}</p>
            <p><strong>Test Region:</strong> {selectedTest.testRegion}</p>
            <p><strong>Test Status:</strong> {selectedTest.testStatus}</p>
            <p><strong>Comments:</strong> {selectedTest.comments}</p>
            <p><strong>Bug Reference ID:</strong> {selectedTest.bugReferenceId}</p>
            <p><strong>Reference:</strong> {selectedTest.reference}</p>
            <p><strong>Bug Priority:</strong> {selectedTest.bugPriority}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Testrun;

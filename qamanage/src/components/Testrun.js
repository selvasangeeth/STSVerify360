import React, { useState, useEffect } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from './axios'; // Make sure to import axios
import './Testrun.css';
import Pagination from './Pagination/Pagination'; // Import Pagination component

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
  const [customDate, setCustomDate] = useState(null); // Store only a single selected date
  const [testRunsData, setTestRunsData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [testRunsPerPage, setTestRunsPerPage] = useState(10);

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
      setCustomDate(null); // Reset custom date when switching
    }
  };

  const handleDateChange = (date) => {
    // If a date is selected, update customDate and apply the filter for that date
    setCustomDate(date);
  };

  const handleEyeClick = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };

  const filteredData = (Array.isArray(testRunsData) ? testRunsData : []).filter((test) => {
    // Date filtering logic
    const testDate = new Date(test.timestamp);

    let isWithinTimePeriod = true;

    if (timePeriod === "This Month") {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      isWithinTimePeriod = testDate >= startOfMonth;
    } else if (timePeriod === "Last Month") {
      const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      const endOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
      isWithinTimePeriod = testDate >= startOfLastMonth && testDate <= endOfLastMonth;
    } else if (timePeriod === "Last 3 Months") {
      const startOf3MonthsAgo = new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1);
      isWithinTimePeriod = testDate >= startOf3MonthsAgo;
    }

    // Custom date filtering - Single date selection
    if (timePeriod === "Custom" && customDate) {
      isWithinTimePeriod = testDate.toDateString() === customDate.toDateString();
    }

    // General search term filtering
    const isMatchingSearchTerm =
      test.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subTaskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testCaseName.toLowerCase().includes(searchTerm.toLowerCase());

    return isWithinTimePeriod && isMatchingSearchTerm;
  });

  // Pagination logic
  const indexOfLastTestRun = currentPage * testRunsPerPage;
  const indexOfFirstTestRun = indexOfLastTestRun - testRunsPerPage;
  const currentTestRuns = filteredData.slice(indexOfFirstTestRun, indexOfLastTestRun);
  const totalPages = Math.ceil(filteredData.length / testRunsPerPage);

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

      {timePeriod === "Custom" && (
        <div className="custom-date-picker">
          <DatePicker
            selected={customDate}
            onChange={handleDateChange} // Update the selected custom date
            inline
            shouldCloseOnSelect={true} // Close the date picker after selecting a date
            highlightDates={customDate ? [customDate] : []} // Ensure it's always an array
          />
        </div>
      )}

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
          {currentTestRuns.length > 0 ? (
            currentTestRuns.map((test, index) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={testRunsPerPage}
        onRowsPerPageChange={setTestRunsPerPage}
      />

      {showModal && selectedTest && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="test-case-details">
            <h2>Test Case Details</h2>
            {/* Display selected test case details here */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Testrun;

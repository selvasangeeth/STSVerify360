import React, { useState, useEffect, useRef } from "react";
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
  const [testRegion, setTestRegion] = useState("All Regions");
  const [testStatus, setTestStatus] = useState("All Statuses");
  const [timePeriod, setTimePeriod] = useState("This Month");
  const [showModal, setShowModal] = useState(false);
  const [testRunsData, setTestRunsData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [testRunsPerPage, setTestRunsPerPage] = useState(10);
  const [showCustomDropdown, setShowCustomDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const datePickerRef = useRef(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const regionDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown close
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCustomDropdown(false);
      }
      // Handle date picker close
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      // Handle region dropdown close
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setShowRegionDropdown(false);
      }
      // Handle status dropdown close
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    setShowCustomDropdown(false);
    if (value === "Custom") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
      setSelectedDate(null);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleEyeClick = (test) => {
    setSelectedTest(test);
    setShowModal(true);
  };
  // Filter functions
  const filterByDate = (test) => {
    const testDate = new Date(test.timestamp);
    const today = new Date();

    if (timePeriod === "Custom" && selectedDate) {
      const testDay = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate());
      const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return testDay.getTime() === selectedDay.getTime();
    }

    switch (timePeriod) {
      case "This Month":
        return testDate.getMonth() === today.getMonth() && 
               testDate.getFullYear() === today.getFullYear();
      case "Last Month":
        const lastMonth = today.getMonth() - 1;
        const year = lastMonth === -1 ? today.getFullYear() - 1 : today.getFullYear();
        const month = lastMonth === -1 ? 11 : lastMonth;
        return testDate.getMonth() === month && testDate.getFullYear() === year;
      case "Last 3 Months":
        const ninetyDaysAgo = new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000));
        return testDate >= ninetyDaysAgo;
      default:
        return true;
    }
  };
  const filterByRegion = (test) => {
    return testRegion === "All Regions" || test.testRegion === testRegion;
  };
  const filterByStatus = (test) => {
    return testStatus === "All Statuses" || test.testStatus === testStatus;
  };
  const filterBySearch = (test) => {
    return (
      test.taskId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subTaskId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  // Apply all filters
  const filteredData = testRunsData.filter(test => 
    filterByDate(test) &&
    filterByRegion(test) &&
    filterByStatus(test) &&
    filterBySearch(test)
  );
  // Pagination logic
  const indexOfLastTestRun = currentPage * testRunsPerPage;
  const indexOfFirstTestRun = indexOfLastTestRun - testRunsPerPage;
  const currentTestRuns = filteredData.slice(indexOfFirstTestRun, indexOfLastTestRun);
  const totalPages = Math.ceil(filteredData.length / testRunsPerPage);
  return (
    <div className="test-runs-container">
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
          <div className="custom-select" ref={regionDropdownRef}>
            <button 
              className="filter-button"
              onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            >
              {testRegion}
            </button>
            {showRegionDropdown && (
              <div className="custom-dropdown">
                <div onClick={() => { setTestRegion("All Regions"); setShowRegionDropdown(false); }}>All Regions</div>
                <div onClick={() => { setTestRegion("Sprint"); setShowRegionDropdown(false); }}>Sprint</div>
                <div onClick={() => { setTestRegion("Staging"); setShowRegionDropdown(false); }}>Staging</div>
                <div onClick={() => { setTestRegion("UAT"); setShowRegionDropdown(false); }}>UAT</div>
              </div>
            )}
          </div>
          <div className="custom-select" ref={statusDropdownRef}>
            <button 
              className="filter-button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              {testStatus}
            </button>
            {showStatusDropdown && (
              <div className="custom-dropdown">
                <div onClick={() => { setTestStatus("All Statuses"); setShowStatusDropdown(false); }}>All Statuses</div>
                <div onClick={() => { setTestStatus("Pass"); setShowStatusDropdown(false); }}>Pass</div>
                <div onClick={() => { setTestStatus("Fail"); setShowStatusDropdown(false); }}>Fail</div>
              </div>
            )}
          </div>
          <div className="custom-select" ref={dropdownRef}>
            <button 
              className="time-period-button" 
              onClick={() => setShowCustomDropdown(!showCustomDropdown)}
            >
              {selectedDate ? selectedDate.toLocaleDateString() : timePeriod}
            </button>
            {showCustomDropdown && (
              <div className="custom-dropdown">
                <div onClick={() => handleTimePeriodChange("This Month")}>This Month</div>
                <div onClick={() => handleTimePeriodChange("Last Month")}>Last Month</div>
                <div onClick={() => handleTimePeriodChange("Last 3 Months")}>Last 3 Months</div>
                <div onClick={() => handleTimePeriodChange("Custom")}>Custom</div>
              </div>
            )}
            {showDatePicker && (
              <div className="datepicker-popup" ref={datePickerRef}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  inline
                  calendarClassName="custom-calendar"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            )}
          </div>
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
          {currentTestRuns.length > 0 ? (
            currentTestRuns.map((test, index) => (
              <tr key={index}>
                <td>{new Date(test.timestamp).toLocaleString()}</td>
                <td>{test.testScenario}</td>
                <td>{test.testCaseName}</td>
                <td>{test.testDescription}</td>
                <td>{test.subTaskId}</td>
                <td>
                  <span className={`status-badge ${test.testStatus?.toLowerCase()}`}>
                    {test.testStatus}
                  </span>
                </td>
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
      {/* LEFT SIDE - Up to Steps */}
      <div className="test-case-column">
      <h2 className="test-case-details h2">Test Case Details</h2>
        <div className="detail-row"><span className="label">Test Case ID</span> <span className="value">{selectedTest.testCaseName}</span></div>
        <div className="detail-row"><span className="label">Test Case Type</span> <span className="value"><span className="test-status pass">{selectedTest.caseType}</span></span></div>
        <div className="detail-row"><span className="label">Created By</span> <span className="value">{selectedTest.testCaseCreatedBy}</span></div>
        <div className="detail-row"><span className="label">Created At</span> <span className="value">{new Date(selectedTest.testCaseCreatedAt).toLocaleString()}</span></div>
        <div className="detail-row"><span className="label">Test Case Description</span> <span className="value">{selectedTest.testDescription}</span></div>
        <div className="detail-row"><span className="label">Expected Result</span> <span className="value">{selectedTest.expectedResult}</span></div>
        <div className="detail-row"><span className="label">Test Case Data</span> <span className="value">{selectedTest.testCaseData}</span></div>
        <div className="detail-row"><span className="label">Steps</span> <span className="value">{selectedTest.steps}</span></div>
      </div>

      {/* RIGHT SIDE - From Results */}
      <div className="test-case-column">
        <h3>Result</h3>
        <div className="detail-row"><span className="label">Tested By</span> <span className="value">{selectedTest.testedBy}</span></div>
        <div className="detail-row"><span className="label">Tested On</span> <span className="value">{new Date(selectedTest.timestamp).toLocaleString()}</span></div>
        <div className="detail-row"><span className="label">Test Region</span> <span className="value"><span className="test-status live">{selectedTest.testRegion}</span></span></div>
        <div className="detail-row"><span className="label">Test Status</span> <span className="value"><span className={`test-status ${selectedTest.testStatus?.toLowerCase()}`}>{selectedTest.testStatus}</span></span></div>
        <div className="detail-row"><span className="label">Comments</span> <span className="value">{selectedTest.comments}</span></div>
        <div className="detail-row"><span className="label">Bug Reference ID</span> <span className="value">{selectedTest.bugReferenceId}</span></div>
        <div className="detail-row"><span className="label">Bug Priority</span> <span className="value"><span className="test-status fail">{selectedTest.bugPriority}</span></span></div>
              {selectedTest.reference && (
                <div className="detail-row">
                  <span className="label">Reference</span>
                  <span className="value">
                    {selectedTest.reference.startsWith('/9j/') ? (
                      <img
                        src={`data:image/jpeg;base64,${selectedTest.reference}`}
                        alt="Test reference"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    ) : selectedTest.reference.startsWith('iVBORw0KGgo') ? (
                      <img
                        src={`data:image/png;base64,${selectedTest.reference}`}
                        alt="Test reference"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    ) : (
                      <p>Unsupported media type</p>
                    )}
                  </span>
                </div>
              )}
             
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Testrun;


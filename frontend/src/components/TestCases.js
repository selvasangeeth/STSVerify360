import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axios';
import './TestCases.css';
import './common.css';
import TestCaseModal from './TestCaseModal';
import { FaTrash, FaEye } from 'react-icons/fa';
import Pagination from './Pagination/Pagination'; // Import Pagination component

const TestCases = () => {
  const { projectId, moduleId, scenarioId } = useParams();
  const [testCases, setTestCases] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [scenarioDetails, setScenarioDetails] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genId, setGenId] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    testCaseId: '',
    caseType: '',
    expectedResult: '',
    testCaseData: '',
    steps: '',
    createdBy: { Name: 'Current User' },
    testStatus: 'Untested'
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null, // 'view', 'edit', or 'add'
    testCase: null
  });
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [testCasesPerPage, setTestCasesPerPage] = useState(10);

  const actionMenuRef = useRef(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (scenarioId) {
      fetchScenarioDetails();
      fetchTestCases();
    }
  }, [scenarioId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchScenarioDetails = async () => {
    try {
      const response = await axios.get(`getTestCase/${scenarioId}`);
      if (response.data.success) {
        setScenarioDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const fetchTestCases = async () => {
    try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/getTestCase/${scenarioId}`);
        console.log(response.data.data); // Debugging
        console.log("Fetched test cases:", response.data.data); // Debugging
        if (response.data.msg === "success") {
            const testCasesData = Array.isArray(response.data.data) ? response.data.data : [];
            // Ensure description exists
            const updatedTestCases = testCasesData.map(tc => ({
                ...tc,
                description: tc.description || 'No Description'
            }));
            setTestCases(updatedTestCases);
        }
    } catch (error) {
        console.error('Error fetching test cases:', error);
        setError('Error fetching test cases. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleViewClick = (testCase) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      testCase
    });
  };

  // const handleEditClick = (testCase) => {
  //   setModalState({
  //     isOpen: true,
  //     mode: 'edit',
  //     testCase
  //   });

//   // };
//   <button onClick={() => handleActionMenuItemClick('edit', testCase)}>
//   <FaEdit className="action-icon" /> Edit
// </button>

  const handleRemoveClick = async (testCase) => {
    try {
      console.log("Safsdf");
      const response = await axios.delete(`/api/deleteTestCase/${testCase._id}`, {
        params: {
          projectId: projectId,
          moduleId: testCase.moduleId,
          scenarioId: testCase.scenarioId
        }
      });
      if (response.data.msg === "TestCase deleted successfully") {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddClick = async () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      testCase: null
    });
    console.log("Scenario");
    console.log(scenarioId);
    try {
      const response = await axios.get("/getTestIds", {
        params: {
          scenarioId: scenarioId
        }
      })
     
      setGenId(response.data.genSceId);
      console.log("genId");
      console.log(genId);
    }
    catch (err) {
      console.log(err);
    }
  };


  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: null,
      testCase: null
    });
  };

  const handleModalSave = (newTestCase) => {
    if (modalState.mode === 'add') {
      const testCase = {
        ...newTestCase,
        _id: Date.now().toString(),
        createdBy: {
          name: 'Surya Prabhu T',
          date: new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric'
          })
        },
        status: 'Untested'
      };
      setTestCases([testCase, ...testCases]);
    }
    handleModalClose();
  };

  const handleActionMenuClick = (e, testCaseId) => {
    e.stopPropagation();
    setActiveActionMenu(activeActionMenu === testCaseId ? null : testCaseId);
  };

  const handleActionMenuItemClick = (action, testCase) => {
    setActiveActionMenu(null); // Close the menu
    
    switch(action) {
      case 'view':
        handleViewClick(testCase);
        break;
      // case 'edit':
      //   handleEditClick(testCase);
      //   break;
      case 'remove':
        handleRemoveClick(testCase);
        console.log('Remove test case:', testCase);
        break;
      default:
        break;
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.post("/createTestCase", {
          ...newTestCase,
          scenarioId,
          projectId,
          moduleId
        });

        if (response.data.msg === "TestCase Created Successfully") {
          setTestCases([...testCases, response.data.data]);
          setShowAddRow(false);
          setNewTestCase({
            testCaseId: '',
            caseType: '',
            expectedResult: '',
            testCaseData: '',
            steps: '',
            createdBy: { Name: 'Current User' },
            testStatus: 'Untested'
          });
        }
      } catch (error) {
        console.error('Error creating test case:', error);
      }
    }
  };

  const filteredTestCases = Array.isArray(testCases) ? testCases.filter(testCase =>
    testCase.testCaseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Pagination logic
  const indexOfLastTestCase = currentPage * testCasesPerPage;
  const indexOfFirstTestCase = indexOfLastTestCase - testCasesPerPage;
  const currentTestCases = filteredTestCases.slice(indexOfFirstTestCase, indexOfLastTestCase);
  const totalPages = Math.ceil(filteredTestCases.length / testCasesPerPage);

  if (loading) {
    return <div className="loading">Loading test cases...</div>;
  }

  return (
    <div className="testcases-container">
      <div className="top-section">
        <div className="breadcrumb-section"></div>
        <div className="profile-section"></div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search By Test Case ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-case-btn" onClick={() => {handleAddClick();}}>
          + Add Case
        </button>
      </div>

      <div className="testcases-table">
        <table>
          <thead>
            <tr>
              <th>Test Case ({testCases.length})</th>
              <th>Case Type</th>
              <th>Expected Result</th>
              <th>Test Case Data</th>
              <th>Status</th>
              <th>Created By/Tested By</th>
              <th>Steps</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {showAddRow && (
              <tr>
                <td>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter Test Case ID"
                    value={newTestCase.testCaseId}
                    onChange={(e) => setNewTestCase({ ...newTestCase, testCaseId: e.target.value })}
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td>
                  <select
                    className="input-field"
                    value={newTestCase.caseType}
                    onChange={(e) => setNewTestCase({ ...newTestCase, caseType: e.target.value })}
                  >
                    <option value="">Select Case Type</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Expected Result"
                    value={newTestCase.expectedResult}
                    onChange={(e) => setNewTestCase({ ...newTestCase, expectedResult: e.target.value })}
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Test Case Data"
                    value={newTestCase.testCaseData}
                    onChange={(e) => setNewTestCase({ ...newTestCase, testCaseData: e.target.value })}
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td>
                  <span className="status-badge untested">Untested</span>
                </td>
                <td>
                  <div className="user-info">
                    <div className="name">Current User</div>
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Steps"
                    value={newTestCase.steps}
                    onChange={(e) => setNewTestCase({ ...newTestCase, steps: e.target.value })}
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td></td>
              </tr>
            )}
            {currentTestCases.map((testCase) => (
              <tr key={testCase._id}>
                <td>
                  <div className="test-case-info">
                    <div className="test-case-id">{testCase.testCaseId}</div>
                    <div className="test-case-desc">{testCase.testCaseDescription || 'No Description'}</div>
                  </div>
                </td>
                <td>
                  <span className={`case-type-badge ${testCase.caseType?.toLowerCase()}`}>
                    {testCase.caseType}
                  </span>
                </td>
                <td>
                  {testCase.expectedResult || 'No Expected Result'}
                </td>
                <td>
                  {testCase.testCaseData || 'No Test Case Data'}
                </td>
                <td>
                  <span className={`status-badge ${testCase.testStatus?.toLowerCase()}`}>
                    {testCase.testStatus || 'Untested'}
                  </span>
                </td>
                <td>
                  <div className="user-info">
                    <div className="name">{testCase.createdBy?.Name || '-'}</div>
                    <div className="name">{testCase.testedBy?.testerName || '-'}</div>
                    {/* <div className="name">{testCase.testedBy?.testDate || '-'}</div> */}
                  </div>
                </td>
                <td>
                  {testCase.steps || 'No Steps Available'}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="three-dot-menu" 
                      onClick={(e) => handleActionMenuClick(e, testCase._id)}
                    >
                      ⋮
                    </button>
                    {activeActionMenu === testCase._id && (
                      <div className="action-menu-dropdown" ref={actionMenuRef}>
                        <button onClick={() => handleActionMenuItemClick('view', testCase)}>
                          <FaEye className="action-icon" /> View
                        </button>
                        <button onClick={() => handleActionMenuItemClick('remove', testCase)}>
                          <FaTrash className="action-icon" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={testCasesPerPage}
        onRowsPerPageChange={setTestCasesPerPage}
      />

      {modalState.isOpen && (
        <TestCaseModal
          testCase={modalState.testCase}
          mode={modalState.mode}
          
          scenarioId={scenarioId}
          moduleId={moduleId}
          projectId={projectId}
          genId={genId}
          testCasei={modalState.testCase ? modalState.testCase._id : null} 
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default TestCases;
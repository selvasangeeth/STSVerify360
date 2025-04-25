import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from './axios';
import './Scenarios.css';
import './common.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from './Pagination/Pagination'; // Import Pagination component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Scenarios = () => {
  const { moduleId, projectId } = useParams();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [genId, setGenId] = useState("");
  const [newScenario, setNewScenario] = useState({
    scenarioIdstr: '',
    description: '',
    taskId: '',
    subTaskId: '',
    projectId: projectId
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [scenariosPerPage, setScenariosPerPage] = useState(10);

  const [editingScenario, setEditingScenario] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const actionMenuRef = useRef(null);

  // Add state for action menu
  const [actionMenuScenario, setActionMenuScenario] = useState(null);
  const menuRef = useRef();

  const [activeMenu, setActiveMenu] = useState(null);



  useEffect(() => {
    if (moduleId) {
      fetchScenarios();
    }
  }, [moduleId]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setSelectedScenario(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuScenario(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/getScenario/${moduleId}`);


      if (response.data.msg === "Success Scenario Fetch") {
        setScenarios(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setError('Error fetching scenarios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScenario = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const scenarioData = {
        moduleId,
        ...newScenario,
        scenarioIdstr: genId, 
      };
  

      const response = await axios.post('/createScenario', scenarioData);
      console.log('Add scenario response:', response.data);

      if (response.data.msg === "Scenario Created Successfully") {
        // Add the new scenario to the beginning of the list
        const newScenarioData = response.data.data;
        setScenarios(prevScenarios => [newScenarioData, ...prevScenarios]);
        setShowAddInput(false);
        setNewScenario({
          scenarioIdstr: '',
          description: '',
          taskId: '',
          subTaskId: '',
          projectId: projectId
        });
        setGenId('');
        toast.success("Scenario Created successfully");
        fetchScenarios();
      
      } else {
        toast.error(response.data.msg)
        setError(response.data.msg);
      }
    } catch (error) {
      console.error('Error adding scenario:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error adding scenario. Please try again.');
    }
  };

  const startEditing = (scenario) => {
    setEditingScenario(scenario._id);
    setEditedValues({
      scenarioIdstr: scenario.scenarioIdstr,
      taskId: scenario.taskId,
      subTaskId: scenario.subTaskId,
      scenarioDescription: scenario.scenarioDescription
    });
    setSelectedScenario(scenario);
  };

  const handleKeyPress = (e, scenarioId) => {
    if (e.key === 'Enter') {
      handleEditScenario(scenarioId);
    }
  };

  const handleEditScenario = async (scenarioId) => {
    try {
      setError(null);
      const response = await axios.put(`/updateScenario/${scenarioId}`, {
        scenarioUpdate: editedValues,
        projectId: projectId,
        moduleId: moduleId
      });

      if (response.data.msg === "Scenario updated successfully") {
        setScenarios(scenarios.map(scenario => 
          scenario._id === scenarioId ? { ...scenario, ...editedValues } : scenario
        ));
        setEditingScenario(null);
        setEditedValues({});
        setSelectedScenario(null);
        toast.success("Scenario updated successfully");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error updating scenario. Please try again.');
      toast.error('Error updating scenario');
    }
  };

  const handleRemoveScenario = async () => {
    if (!selectedScenario?._id) {
        toast.error('No scenario selected for removal');
        return;
    }

    try {
        setError(null);
        console.log("Removing scenario:", selectedScenario._id);
        console.log("Project ID:", projectId);
        console.log("Module ID:", moduleId);

        const response = await axios.delete(`/sc/deleteScenario/${selectedScenario._id}`, {
            params: {
                projectId: projectId,
                moduleId: moduleId
            }
        });
        
        if (response.data.msg === "Scenario deleted successfully" || response.status === 200) {
            setScenarios(prevScenarios => 
                prevScenarios.filter(scenario => scenario._id !== selectedScenario._id)
            );
            setShowRemoveModal(false);
            setSelectedScenario(null);
            toast.success("Scenario removed successfully");
            
            setTimeout(() => {
              fetchScenarios();
            }, 2000);

        } else {
            throw new Error(response.data.message || 'Failed to remove scenario');
        }
    } catch (error) {
        console.error('Error removing scenario:', error);
        setError('Error removing scenario. Please try again.');
        toast.error('Error removing scenario');
    }
  };

  const handleScenarioClick = (scenarioId, projectId, moduleId) => {
    try {
    
      navigate(`/modules/scenarios/testcases/${scenarioId}/${projectId}/${moduleId}`);
    } catch (error) {
      console.error('Error navigating to test cases:', error);
      setError('Error navigating to test cases. Please try again.');
    }
  };


  const handleGetIds = async () => {
    console.log(projectId);
    console.log(moduleId);
    console.log("Fetching Ids");
  
    try {
      // Send projectId and moduleId as query params in the GET request
      const response = await axios.get('/getIds', {
        params: {
          projectId: projectId,  // Send as query parameter
          moduleId: moduleId     // Send as query parameter
        }
      });
  
      setGenId(response.data.genSceId);
      console.log("genIdd"+ genId);
      console.log(response.data.genSceId); // Handle the response
    } catch (err) {
      console.log("Error fetching IDs:", err);
    }
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (scenario.scenarioIdstr || '').toLowerCase().includes(searchTermLower) ||
      (scenario.description || '').toLowerCase().includes(searchTermLower) ||
      (scenario.taskId || '').toLowerCase().includes(searchTermLower) ||
      (scenario.subTaskId || '').toLowerCase().includes(searchTermLower)
    );
  });

  // Pagination logic
  const indexOfLastScenario = currentPage * scenariosPerPage;
  const indexOfFirstScenario = indexOfLastScenario - scenariosPerPage;
  const currentScenarios = filteredScenarios.slice(indexOfFirstScenario, indexOfLastScenario);
  const totalPages = Math.ceil(filteredScenarios.length / scenariosPerPage);

  const handleCancelAdd = () => {
    setShowAddInput(false);
    setNewScenario({
      scenarioIdstr: '',
      description: '',
      taskId: '',
      subTaskId: '',
      projectId: projectId
    });
  };

  const handleMenuClick = (e, scenarioId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === scenarioId ? null : scenarioId);
  };

  if (loading) {
    return <div className="loading">Loading scenarios...</div>;
  }

  return (
    <div className="scenarios-container">
      <div className="scenarios-header">
        {moduleDetails && (
          <div className="module-info">
            <h2>{moduleDetails.moduleName}</h2>
            <p className="submodule-name">{moduleDetails.subModuleName}</p>
          </div>
        )}
      </div>

      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Scenario ID  Task ID  Sub Task ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button 
            className="add-button" 
            onClick={() => { 
              setShowAddInput(true); 
              handleGetIds(); 
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Scenario
          </button>
        </div>
      </div>

      <div className="scenarios-table">
        <table>
          <thead>
            <tr>
              <th>Scenario ID</th>
              <th>Task ID</th>
              <th>Sub Task ID</th>
              <th>Description</th>
              <th>Created Date</th>
              <th>Cases Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showAddInput && (
              <tr className="add-scenario-row">
                <td>
                  <input
                    type="text"
                    placeholder="Scenario ID"
                    value={genId}
                    onChange={(e) => setGenId(e.target.value)} 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddScenario(e);
                      }
                    }}
                    disabled    
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Task ID"
                    value={newScenario.taskId}
                    onChange={(e) => setNewScenario({ ...newScenario, taskId: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddScenario(e);
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Sub Task ID"
                    value={newScenario.subTaskId}
                    onChange={(e) => setNewScenario({ ...newScenario, subTaskId: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddScenario(e);
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newScenario.description}
                    onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddScenario(e);
                      }
                    }}
                  />
                </td>
                <td colSpan="3" className="cancel-cell">
                  <button className="cancel-button" onClick={handleCancelAdd}>Cancel</button>
                </td>
              </tr>
            )}
            {currentScenarios.map((scenario) => (
              <tr key={scenario._id} className="scenario-row">
                <td>
                  {editingScenario === scenario._id ? (
                    <input
                      type="text"
                      value={editedValues.scenarioIdstr}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        scenarioIdstr: e.target.value
                      })}
                      onKeyPress={(e) => handleKeyPress(e, scenario._id)}
                      onClick={(e) => e.stopPropagation()}
                      disabled
                    />
                  ) : (
                    <span
                      className="clickable-id"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScenarioClick(scenario._id, projectId, moduleId);
                      }}
                    >
                      {scenario.scenarioIdstr}
                    </span>
                  )}
                </td>
                <td>
                  {editingScenario === scenario._id ? (
                    <input
                      type="text"
                      value={editedValues.taskId}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        taskId: e.target.value
                      })}
                      onKeyPress={(e) => handleKeyPress(e, scenario._id)}
                      onClick={(e) => e.stopPropagation()}
                      
                    />
                  ) : (
                    scenario.taskId
                  )}
                </td>
                <td>
                  {editingScenario === scenario._id ? (
                    <input
                      type="text"
                      value={editedValues.subTaskId}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        subTaskId: e.target.value
                      })}
                      onKeyPress={(e) => handleKeyPress(e, scenario._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    scenario.subTaskId
                  )}
                </td>
                <td>
                  {editingScenario === scenario._id ? (
                    <input
                      type="text"
                      value={editedValues.scenarioDescription}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        scenarioDescription: e.target.value
                      })}
                      onKeyPress={(e) => handleKeyPress(e, scenario._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="description-text">{scenario.scenarioDescription}</div>
                  )}
                </td>
                <td>
                  <div className="date-text">
                    {new Date(scenario.timestamp).toLocaleDateString()}
                  </div>
                </td>
                <td>{scenario.testCaseCount || 0}</td>
                <td>
                  {editingScenario === scenario._id ? (
                    <div className="action-buttons">
                      <button 
                        className="text-btn cancel-edit" 
                        onClick={() => {
                          setEditingScenario(null);
                          setEditedValues({});
                          setSelectedScenario(null);
                        }}
                      >
                        Cancel  
                      </button>
                    </div>
                  ) : (
                    <div className="menu-container">
                      <button 
                        className="menu-btn"
                        onClick={(e) => handleMenuClick(e, scenario._id)}
                      >
                        ⋮
                      </button>
                      {activeMenu === scenario._id && (
                        <div className="action-buttons popup">
                          <button 
                            className="action-btn editi"
                            onClick={() => {
                              startEditing(scenario);
                              setActiveMenu(null);
                            }}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="action-btn deletei"
                            onClick={() => {
                              setSelectedScenario(scenario);
                              setShowRemoveModal(true);
                              setActiveMenu(null);
                            }}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
        rowsPerPage={scenariosPerPage}
        onRowsPerPageChange={setScenariosPerPage}
      />

      <ToastContainer />

      {/* Add remove confirmation modal */}
      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Remove Scenario</h3>
            <p>Are you sure you want to remove this scenario?</p>
            <div className="modal-actions">
              <button 
                className="text-btn cancel"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>
              <button 
                className="remove-btn"
                onClick={handleRemoveScenario}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;
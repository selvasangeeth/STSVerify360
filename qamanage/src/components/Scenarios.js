import React, { useState, useEffect } from 'react';
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
  const [showEditModal, setShowEditModal] = useState(false);
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

  useEffect(() => {
    console.log('Current moduleId:', moduleId);
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
      fetchModuleDetails();
      fetchScenarios();
    }
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      const response = await axios.get(`/getModules/${moduleId}`);
      setModuleDetails(response.data.sc);
    } catch (error) {
      console.error('Error fetching module details:', error);
      setError('Error fetching module details. Please try again.');
    }
  };

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching scenarios for moduleId:', moduleId);

      const response = await axios.get(`/getScenario/${moduleId}`);
      console.log(response.data);
      console.log('Scenarios response:', response.data);

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
      console.log("ModuleId  : " + moduleId);
      console.log(":genidddd"+genId);
      

      console.log('Sending scenario data:', scenarioData);

      const response = await axios.post('/createScenario', scenarioData);
      console.log('Add scenario response:', response.data);

      if (response.data.msg === "Scenario Created Successfully") {
        setScenarios([...scenarios, response.data.data]);
        setShowAddInput(false);
        setNewScenario({
          scenarioIdstr: '',
          description: '',
          taskId: '',
          subTaskId: '',
        });
        toast.success("Scenario added successfully");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error adding scenario:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error adding scenario. Please try again.');
    }
  };

  const handleEditScenario = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      console.log(selectedScenario);
      console.log("project"+projectId);
      console.log("modid :" + moduleId);
      const response = await axios.put(`/updateScenario/${selectedScenario._id}`, {scenarioUpdate : selectedScenario,projectId : projectId,moduleId:moduleId});
      if (response.data.msg === "Scenario Updated Successfully") {
        setScenarios(scenarios.map(scenario => scenario._id === selectedScenario._id ? response.data.data : scenario));
        setShowEditModal(false);
        toast.success("Scenario updated successfully");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error updating scenario. Please try again.');
    }
  };

  const handleRemoveScenario = async () => {
    try {
        setError(null);
        console.log("askjdhkj");
        console.log(selectedScenario._id);
        console.log(projectId);
        console.log(moduleId);

        // Pass projectId and moduleId as query params
        const response = await axios.delete(`/sc/deleteScenario/${selectedScenario._id}`, {
            params: {
                projectId: projectId,
                moduleId: moduleId
            }
        });
        console.log(response.data.msg);
        setScenarios(scenarios.filter(scenario => scenario._id !== selectedScenario._id));
        setShowRemoveModal(false);
        toast.success("Scenario removed successfully");
    } catch (error) {
        setError('Error removing scenario. Please try again.');
        toast.error('Error removing scenario');
    }
  };

  const handleScenarioClick = (scenarioId, projectId, moduleId) => {
    try {
      console.log(scenarioId);
      console.log("sdewfewf : " + moduleId);
      navigate(`/modules/scenarios/testcases/${scenarioId}/${projectId}/${moduleId}`);
    } catch (error) {
      console.error('Error navigating to test cases:', error);
      setError('Error navigating to test cases. Please try again.');
    }
  };

  const handleBackClick = () => {
    try {
      navigate('/modules');
    } catch (error) {
      console.error('Error navigating back:', error);
      setError('Error navigating back. Please try again.');
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

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.scenarioIdstr.includes(searchTerm) ||
    scenario.description.includes(searchTerm) ||
    scenario.taskId.includes(searchTerm) ||
    scenario.subTaskId.includes(searchTerm)
  );

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
            placeholder="Search scenarios..."
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
                  <span
                    className="clickable-id"
                    onClick={() => handleScenarioClick(scenario._id, projectId, moduleId)}
                  >
                    {scenario.scenarioIdstr}
                  </span>
                </td>
                <td>{scenario.taskId}</td>
                <td>{scenario.subTaskId}</td>
                <td>
                  <div className="description-text">{scenario.scenarioDescription}</div>
                </td>
                <td>
                  <div className="date-text">
                    {new Date(scenario.timestamp).toLocaleDateString()}
                  </div>
                </td>
                <td>{scenario.testCaseCount || 0}</td>
                <td>
                  <button className="action-btn" onClick={() => setSelectedScenario(scenario)}>⋮</button>
                  {selectedScenario === scenario && (
                    <div className="action-menu">
                      <div className="action-item" onClick={() => setShowEditModal(true)}>
                        <FaEdit /> Edit
                      </div>
                      <div className="action-item" onClick={() => setShowRemoveModal(true)}>
                        <FaTrash /> Remove
                      </div>
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

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Scenario</h2>
            <form onSubmit={handleEditScenario}>
              <div className="form-group">
                <label>Scenario ID</label>
                <input
                  type="text"
                  value={selectedScenario.scenarioIdstr}
                  onChange={(e) => setSelectedScenario({
                    ...selectedScenario,
                    scenarioIdstr: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Task ID</label>
                <input
                  type="text"
                  value={selectedScenario.taskId}
                  onChange={(e) => setSelectedScenario({
                    ...selectedScenario,
                    taskId: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sub Task ID</label>
                <input
                  type="text"
                  value={selectedScenario.subTaskId}
                  onChange={(e) => setSelectedScenario({
                    ...selectedScenario,
                    subTaskId: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={selectedScenario.description}
                  onChange={(e) => setSelectedScenario({
                    ...selectedScenario,
                    description: e.target.value
                  })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRemoveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Remove Scenario</h2>
            <p>Are you sure you want to remove this scenario named <strong>{selectedScenario.scenarioIdstr}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowRemoveModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveScenario}
                className="remove-btn"
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

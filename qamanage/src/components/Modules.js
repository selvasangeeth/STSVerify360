import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import AddModuleModal from './AddModuleModal';
import EditModuleModal from './EditModuleModal'; // Import the EditModuleModal component
import './Modules.css';
import './common.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FaEdit, FaTrash } from 'react-icons/fa';

const Modules = ({ selectedProject }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const actionMenuRef = useRef(null);

  useEffect(() => {
    if (selectedProject) {
      fetchModules(selectedProject.projectId);
    }
  }, [selectedProject]);

  const fetchModules = async (projectId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/getModules/${projectId}`);
      if (response.data.msg === "Module Fetched Success") {
        setModules(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId, projectId) => {
    navigate(`/modules/scenarios/${moduleId}/${projectId}`);
  };

  const handleModuleAdded = (newModule) => {
    setModules([newModule, ...modules]);
  };

  const handleMenuClick = (e, moduleId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === moduleId ? null : moduleId);
  };

  const handleEdit = (module) => {
    setSelectedModule(module);
    setShowEditModal(true);
  };

  const handleRemove = async (moduleId) => {
    try {
      await axios.delete(`/deleteModule/${moduleId}`);
      setModules(modules.filter(module => module._id !== moduleId));
      toast.success('Module removed successfully');
    } catch (error) {
      console.error('Error removing module:', error);
      toast.error('Failed to remove module');
    }
  };

  const handleModuleUpdated = (updatedModule) => {
    setModules(modules.map(module => module._id === updatedModule._id ? updatedModule : module));
  };

  const filteredModules = modules.filter(module =>
    module.moduleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.moduleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.subModuleName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading modules...</div>;

  if (!selectedProject) {
    return <div>Please select a project to view modules.</div>;
  }

  return (
    <div className="modules-container">
      <h2>Modules for {selectedProject.projectName}</h2>
      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="add-button" onClick={() => setShowAddModal(true)} style={{ backgroundColor: 'orange' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Module
          </button>
        </div>
      </div>

      <div className="modules-table">
        <table>
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Submodule Name</th>
              <th>Last Tested</th>
              <th>No of Scenarios</th>
              <th>No of Cases</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module) => (
              <tr key={module._id} className="module-row">
                <td className="module-name" onClick={() => handleModuleClick(module._id, selectedProject.projectId)}>
                  <div>{module.moduleName}</div>
                  <div className="id-text">{module.moduleId}</div>
                </td>
                <td>{module.subModule}</td>
                <td>
                  <div>{module.lastTestedBy}</div>
                  <div className="date-text">
                    { module.lastTested === "Not Tested" ? module.lastTested : new Date(module.lastTested).toLocaleDateString()}
                  </div>
                </td>
                <td>{module.scenariosCount || 0}</td>
                <td>{module.casesCount || 0}</td>
                <td>
                  <div className="action-button" onClick={(e) => handleMenuClick(e, module._id)}>
                    ⋮
                    {activeMenu === module._id && (
                      <div className="action-menu" ref={actionMenuRef}>
                        <div className="action-item" onClick={() => handleEdit(module)}>
                          <FaEdit /> Edit
                        </div>
                        <div className="action-item" onClick={() => handleRemove(module._id)}>
                          <FaTrash /> Remove
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer/>
      {showAddModal && (
        <AddModuleModal
          projectId={selectedProject.projectId}
          onClose={() => setShowAddModal(false)}
          onModuleAdded={handleModuleAdded}
        />
      )}
      {showEditModal && (
        <EditModuleModal
          module={selectedModule}
          onClose={() => setShowEditModal(false)}
          onModuleUpdated={handleModuleUpdated}
        />
      )}
    </div>
  );
};

export default Modules;
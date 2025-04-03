import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axios';
import './Modules.css';
import './common.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditModuleModal from './EditModuleModal'; // Import the EditModuleModal component
import Pagination from './Pagination/Pagination'; // Import Pagination component
import QuoteDisplay from './QuoteDisplay';

const Modules = ({ selectedProject }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRow, setShowAddRow] = useState(false);
  const [newModuleData, setNewModuleData] = useState({
    moduleName: '',
    subModule: '',
    lastTestedBy: 'Not Tested',
    scenariosCount: 0,
    casesCount: 0
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const actionMenuRef = useRef(null);
  const [editingModule, setEditingModule] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [modulesPerPage, setModulesPerPage] = useState(10);

  useEffect(() => {
    if (selectedProject) {
      // Reset the modules state when the selected project changes
      setModules([]);
      fetchModules(selectedProject.projectId);
    }
  }, [selectedProject]); // Dependency on selectedProject


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

  const handleModuleAdded = async () => {
    try {
      const response = await axios.post('/createModule', {
        projectId: selectedProject.projectId,
        ...newModuleData
      });
      if (response.data.msg === "Module Created Successfully") {
        setModules([...modules, response.data.data]);
        setShowAddRow(false);
        setNewModuleData({
          moduleName: '',
          subModule: '',
          lastTestedBy: 'Not Tested',
          scenariosCount: 0,
          casesCount: 0
        });
        toast.success("Module added successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error('Error adding module');
    }
  };

  const handleMenuClick = (e, moduleId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === moduleId ? null : moduleId);
  };

  const handleEdit = (module) => {
    setEditingModule(module);
  };

  const handleEditKeyPress = async (e, moduleId) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.put("/mod/updateModule", {
          newModuleName: editingModule.moduleName,
          newSubModuleName: editingModule.subModule,
          projectId: selectedProject.projectId,
          moduleId: moduleId
        });

        console.log(response.data.msg);
        if (response.data.msg === "Module updated successfully") {
          setModules(modules.map(mod =>
            mod._id === moduleId ? response.data.data : mod
          ));
          setEditingModule(null);
          toast.success("Module Updated Successfully");
        }
      } catch (error) {
        console.error('Error updating module:', error);
        toast.error("Failed to update module");
      }
    } else if (e.key === 'Escape') {
      setEditingModule(null);
    }
  };

  const handleRemove = async (moduleId) => {
    try {
      const response = await axios.delete("/mod/deleteModule", {
        data: {
          moduleId: moduleId,
          projectId: selectedProject.projectId
        },
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.data.msg === "Module deleted successfully") {
        setModules(modules.filter((module) => module._id !== moduleId));
        toast.success("Module removed successfully");
      }
    } catch (error) {
      console.error("Error removing module:", error);
      toast.error("Failed to remove module");
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

  // Pagination logic
  const indexOfLastModule = currentPage * modulesPerPage;
  const indexOfFirstModule = indexOfLastModule - modulesPerPage;
  const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);
  const totalPages = Math.ceil(filteredModules.length / modulesPerPage);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (activeMenu && actionMenuRef.current) {
      const menuRect = actionMenuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (menuRect.bottom > viewportHeight) {
        actionMenuRef.current.style.top = `-${menuRect.height}px`;
      } else {
        actionMenuRef.current.style.top = '20px';
      }
    }
  }, [activeMenu]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleModuleAdded();
    }
  };

  const handleCancelAdd = () => {
    setShowAddRow(false);
    setNewModuleData({
      moduleName: '',
      subModule: '',
      lastTestedBy: 'Not Tested',
      scenariosCount: 0,
      casesCount: 0
    });
  };

  if (loading) return <div className="loading">Loading modules...</div>;

  if (!selectedProject) {
    return <QuoteDisplay />;
  }

  return (
    <div className="modules-container">
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
          <button className="add-button" onClick={() => setShowAddRow(true)}>
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
            {showAddRow && (
              <tr>
                <td>
                  <input
                    type="text"
                    value={newModuleData.moduleName}
                    onChange={(e) => setNewModuleData({ ...newModuleData, moduleName: e.target.value })}
                    placeholder="Module Name"
                    className="input-field"
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={newModuleData.subModule}
                    onChange={(e) => setNewModuleData({ ...newModuleData, subModule: e.target.value })}
                    placeholder="Submodule Name"
                    className="input-field"
                    onKeyPress={handleKeyPress}
                  />
                </td>
                <td>{newModuleData.lastTestedBy}</td>
                <td>{newModuleData.scenariosCount}</td>
                <td>{newModuleData.casesCount}</td>
                <td>
                  <div className="edit-actions">
                    <button className="text-btn cancel" onClick={handleCancelAdd}>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {currentModules.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }} className="no-modules">
                  No modules found
                </td>
              </tr>
            ) : (
              currentModules.map((module) => (
                <tr key={module._id} className="module-row">
                  <td>
                    {editingModule?._id === module._id ? (
                      <input
                        type="text"
                        className="input-field"
                        value={editingModule.moduleName}
                        onChange={(e) => setEditingModule({
                          ...editingModule,
                          moduleName: e.target.value
                        })}
                        onKeyPress={(e) => handleEditKeyPress(e, module._id)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingModule(null)}
                        autoFocus
                      />
                    ) : (
                      <div className="content-cell" onClick={() => handleModuleClick(module._id, selectedProject.projectId)}>
                        <div>{module.moduleName}</div>
                        <div className="id-text">{module.moduleId}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingModule?._id === module._id ? (
                      <input
                        type="text"
                        className="input-field"
                        value={editingModule.subModule}
                        onChange={(e) => setEditingModule({
                          ...editingModule,
                          subModule: e.target.value
                        })}
                        onKeyPress={(e) => handleEditKeyPress(e, module._id)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingModule(null)}
                      />
                    ) : (
                      <div className="content-cell">{module.subModule}</div>
                    )}
                  </td>
                  <td>
                    <div className="content-cell">
                      <div>{module.lastTestedBy}</div>
                      <div className="date-text">
                        {module.lastTested === "Not Tested" ? module.lastTested : new Date(module.lastTested).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="content-cell">{module.scenariosCount || 0}</td>
                  <td className="content-cell">{module.casesCount || 0}</td>
                  <td>
                    {editingModule?._id === module._id ? (
                      <div className="edit-actions">
                        <button className="text-btn cancel" onClick={() => setEditingModule(null)}>
                          Clear
                        </button>
                      </div>
                    ) : (
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
                    )}
                  </td>
                </tr>
              ))
            )}</tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={modulesPerPage}
        onRowsPerPageChange={setModulesPerPage}
      />
      <ToastContainer />
      {showEditModal && (
        <EditModuleModal
          module={selectedModule}
          moduleId={selectedModule._id}
          projectId={selectedProject.projectId}
          onClose={() => setShowEditModal(false)}
          onModuleUpdated={handleModuleUpdated}
        />
      )}
    </div>
  );
};

export default Modules;
import './Dashboard.css';
import "react-toastify/ReactToastify.css";


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from './axios';

import AddModuleModal from './AddModuleModal';

import LogList from './LogList'; // Import LogList component
import { toast, ToastContainer } from "react-toastify";

const DEFAULT_QUICK_LINKS = [
  {
    name: 'Data Quality Standards',
    url: 'https://coda.io/d/SPAN-Data-Quality-Standards_diggZGrWc8s/Index_sumNp#_luGLX'
  },
  {
    name: 'Design Standards',
    url: 'https://coda.io/d/SPAN-UI-UX-Quality-Standard_dGUnN9xQ9Qp/TaxBandits-UI-UX-Standards_suAF7'
  },
  {
    name: 'Security Standards',
    url: 'https://coda.io/d/SPAN-Security-Standards_dD0NPKTIL0j/SPAN-Security-Standards_supqB#_lu3Cv'
  }
];

const Dashboard = ({ children, onProjectSelect, selectedProject }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname); // Set initial active tab based on current path
  // eslint-disable-next-line no-unused-vars
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quickLinks, setQuickLinks] = useState(DEFAULT_QUICK_LINKS);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  
  // eslint-disable-next-line no-unused-vars
  const [showLogs, setShowLogs] = useState(false); // State to show logs
  const [showAddQuickLinkModal, setShowAddQuickLinkModal] = useState(false); // State to show add quick link modal
  const [newQuickLink, setNewQuickLink] = useState({ name: '', url: '' }); // State for new quick link
  const [showEditQuickLinkModal, setShowEditQuickLinkModal] = useState(false);
  const [activeQuickLink, setActiveQuickLink] = useState(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [linkToRemove, setLinkToRemove] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', url: '' });

  const [newProject, setNewProject] = useState({
    projectName: '',
    logo: null
  });

  const loadFile = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setNewProject({
          ...newProject,
          logo: file, 
        });
      };
  
     
      reader.readAsDataURL(file);
    }
  };



  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/getproject');
        setProjects(response.data.projects);
        console.log(response.data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();

    const storedProject = localStorage.getItem('selectedProject');
    if (storedProject) {
      const project = JSON.parse(storedProject);
      onProjectSelect(project);
      fetchModules(project.projectId);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const fetchModules = async (projectId) => {
    if (!projectId) {
      console.error('Project ID is missing');
      return; // Don't proceed if projectId is invalid
    }
  
    try {
      const response = await axios.get(`/getModules/${projectId}`);
      const data = response.data;
      setModules(data); 
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const formData = new FormData();
    formData.append("projectName",newProject.projectName );
    formData.append("projectLogo", newProject.logo);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/createProject', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data.msg);
      if(response.data.msg){
        toast(response.data.msg)
        setTimeout(()=>{  window.location.reload();},2000)
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    setShowDropdown(false);
    console.log("projectlog :"+project.projectId);
    fetchModules(project.projectId); // Fetch modules for the selected project
    setActiveTab('/modules'); // Set active tab to modules
    navigate(`/modules?projectId=${project.projectId}`);
    // Save the selected project to local storage
    localStorage.setItem('selectedProject', JSON.stringify(project));
  };

  const handleNavClick = (tab) => {
    if (selectedProject) {
      setActiveTab(tab);
      navigate(tab);
    }
  };

  const handleModuleAdded = (newModule) => {
    console.log('New module added:', newModule);
    setModules(prevModules => [newModule, ...prevModules]);
  };

  const handleQuickLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleQuickLinkMenuClick = (e, index) => {
    e.stopPropagation();
    setActiveQuickLink(activeQuickLink === index ? null : index);
  };

  const handleEditQuickLink = (index) => {
    const linkToEdit = quickLinks[index];
    setEditingLink(index);
    setEditFormData({ name: linkToEdit.name, url: linkToEdit.url });
    setShowEditModal(true);
    setActiveQuickLink(null);
  };

  const handleRemoveQuickLink = (index) => {
    setLinkToRemove(index);
    setShowRemoveConfirmModal(true);
    setActiveQuickLink(null);
  };

  const confirmRemoveLink = () => {
    const updatedLinks = quickLinks.filter((_, i) => i !== linkToRemove);
    setQuickLinks(updatedLinks);
    setShowRemoveConfirmModal(false);
    setLinkToRemove(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedLinks = quickLinks.map((link, index) => 
      index === editingLink ? editFormData : link
    );
    setQuickLinks(updatedLinks);
    setShowEditModal(false);
    setEditingLink(null);
    setEditFormData({ name: '', url: '' });
  };

  
  



  const handleAddQuickLink = (e) => {
    e.preventDefault();
    setQuickLinks([...quickLinks, newQuickLink]);
    setNewQuickLink({ name: '', url: '' });
    setShowAddQuickLinkModal(false);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Logo Section */}
        <div className="logo-section">
          {/* <img src={logo} alt="VERIFY 360" className="logo" /> */}
          <h1>Quality Arc</h1>
        </div>

        {/* Project Dropdown */}
        <div className="project-dropdown-container">
          <div className="project-header">
            <span
              className="select-project"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedProject ? selectedProject.projectName : "Select Project"}
            </span>
            <button
              className="dropdown-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              ▼
            </button>
          </div>
          {showDropdown && (
            <div className="project-dropdown">
              <button 
                className="add-project-btn"
                onClick={() => setShowAddProjectModal(true)}
              >
                + Add Project
              </button>
              <div className="projects-list">
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <div 
                      key={project._id} 
                      className="project-item"
                      onClick={() => handleProjectSelect(project)} 
                    >
                      <div className="project-details">
                        {project.projectLogo && (
                          <img
                            src={`data:image/jpeg;base64,${project.projectLogo}`}
                            alt={project.projectName}  
                            style={{
                              width: '40px',  
                              height: '40px',  
                              objectFit: 'contain', 
                            }}
                          />
                        )}
                        {/* Display the project name */}
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',  
                            top: '-15px',
                            position: 'relative',  
                          }}
                        >
                          {project.projectName}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No projects available</p> // Fallback message if there are no projects
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <div 
            className={`nav-item ${activeTab === '/modules' ? 'active' : ''}`}
            onClick={() => handleNavClick('/modules')}
            style={{ backgroundColor: activeTab === '/modules' ? '#be5133' : '' }}
          >
            <span className="nav-icon">📊</span>
            <span>Modules</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/testrun' ? 'active' : ''}`}
            onClick={() => handleNavClick('/testrun')}
            style={{ backgroundColor: activeTab === '/testrun' ? '#be5133' : '' }}
          >
            <span className="nav-icon">📋</span>
            <span>Test Runs</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/metrics' ? 'active' : ''}`}
            onClick={() => handleNavClick('/metrics')}
            style={{ backgroundColor: activeTab === '/metrics' ? '#be5133' : '' }}
          >
            <span className="nav-icon">📈</span>
            <span>Metrics</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/activity' ? 'active' : ''}`}
            onClick={()=>handleNavClick('/activity')} // Update to handle click
            style={{ backgroundColor: activeTab === '/activity' ? '#be5133' : '' }}
          >
            <span className="nav-icon">📝</span>
            <span>Activity</span>
          </div>
        </nav>

        {/* Quick Links */}
        <div className="quick-links-section">
          <div className="quick-links-header">
            <h3>Quick Links</h3>
            <button className="add-quick-link">+</button>
          </div>
          <ul className="quick-links-list">
            {quickLinks.map((link, index) => (
              <li key={index} className="quick-link-item">
                <span 
                  className="quick-link-name"
                  onClick={() => handleQuickLinkClick(link.url)}
                >
                  {link.name}
                </span>
                <div className="quick-link-menu">
                  <button 
                    className="menu-dots"
                    onClick={(e) => handleQuickLinkMenuClick(e, index)}
                  >
                    ⋮
                  </button>
                  {activeQuickLink === index && (
                    <div className="menu-dropdown">
                      <button onClick={() => handleEditQuickLink(index)}>
                        <span>✏️</span> Edit
                      </button>
                      <button onClick={() => handleRemoveQuickLink(index)}>
                        <span>🗑️</span> Remove
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {showLogs ? <LogList /> : children} {/* Conditionally render LogList */}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.projectName}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    projectName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Project Logo</label>
                <div className="file-input">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={loadFile} // Use the loadFile function to handle the file
                  />
                  {newProject.logo && (
                    <div className="project-item">
                      <img src={URL.createObjectURL(newProject.logo)} alt="Project Logo" />
                      <span className="project-name">{newProject.projectName || "Project Name"}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddProjectModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer/>
      {/* Add Module Modal */}
      {showAddModuleModal && (
        <AddModuleModal
          projectId={selectedProject.projectId}
          onClose={() => setShowAddModuleModal(false)}
          onModuleAdded={handleModuleAdded}
        />
      )}

      {/* Add Quick Link Modal */}
      {showAddQuickLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Quick Link</h2>
            <form onSubmit={handleAddQuickLink}>
              <div className="form-group">
                <label>Link Name</label>
                <input
                  type="text"
                  value={newQuickLink.name}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Link URL</label>
                <input
                  type="url"
                  value={newQuickLink.url}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddQuickLinkModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditQuickLinkModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Document</h2>
      <form onSubmit={handleEditQuickLink}>
        <div className="form-group">
          <label>Document Name</label>
          <input
            type="text"
            value={newQuickLink.name}
            onChange={(e) => setNewQuickLink({ ...newQuickLink, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Document URL</label>
          <input
            type="url"
            value={newQuickLink.url}
            onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
            required
          />
        </div>
        <div className="modal-actions">
          <button 
            type="button" 
            onClick={() => setShowEditQuickLinkModal(false)}
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

{showRemoveConfirmModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Confirm Removal</h2>
      <p>Are you sure you want to remove this quick link?</p>
      <div className="modal-actions">
        <button 
          type="button" 
          onClick={() => setShowRemoveConfirmModal(false)}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={confirmRemoveLink}
          className="submit-btn"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Quick Link</h2>
      <form onSubmit={handleEditSubmit}>
        <div className="form-group">
          <label>Link Name</label>
          <input
            type="text"
            value={editFormData.name}
            onChange={(e) => setEditFormData({
              ...editFormData,
              name: e.target.value
            })}
            required
          />
        </div>
        <div className="form-group">
          <label>Link URL</label>
          <input
            type="url"
            value={editFormData.url}
            onChange={(e) => setEditFormData({
              ...editFormData,
              url: e.target.value
            })}
            required
          />
        </div>
        <div className="modal-actions">
          <button 
            type="button"
            className="cancel-btn"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="submit-btn"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}
</div>
);
};

export default Dashboard;
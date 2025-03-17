import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from './axios';
import './Dashboard.css';
import AddProjectModal from './AddProjectModal';
import AddModuleModal from './AddModuleModal';
import TestScenarios from './TestScenarios';
import Modules from './Modules';
import LogList from './LogList'; // Import LogList component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import logo from "../Assets/logo.ico";
import { FaAlignJustify, FaEdit, FaTrash } from 'react-icons/fa';

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
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickLinks, setQuickLinks] = useState(DEFAULT_QUICK_LINKS);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [view, setView] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);
  const [showLogs, setShowLogs] = useState(false); // State to show logs
  const [showAddQuickLinkModal, setShowAddQuickLinkModal] = useState(false); // State to show add quick link modal
  const [newQuickLink, setNewQuickLink] = useState({ name: '', url: '' }); // State for new quick link
  const [showEditQuickLinkModal, setShowEditQuickLinkModal] = useState(false);
  const [showRemoveQuickLinkModal, setShowRemoveQuickLinkModal] = useState(false);
  const [selectedQuickLink, setSelectedQuickLink] = useState(null);

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

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/getproject');
        setProjects(response.data.projects);
        console.log(response.data.projects);
        console.log(response.data.projects[11].projectLogo);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects(); // Call the function when the component is mounted
  }, []);

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
    navigate(`/modules?projectId=${project.projectId}`);
  };

  const handleNavClick = (tab) => {
    if (selectedProject) {
      setActiveTab(tab);
      navigate(tab);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleMenuClick = (e, projectId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === projectId ? null : projectId);
  };

  const handleMenuOption = (e, option, project) => {
    e.stopPropagation();
    switch(option) {
      case 'edit':
        console.log('Edit project:', project.name);
        break;
      case 'delete':
        console.log('Delete project:', project.name);
        break;
      default:
        break;
    }
    setActiveMenu(null);
  };

  const handleModuleAdded = (newModule) => {
    console.log('New module added:', newModule);
    setModules(prevModules => [newModule, ...prevModules]);
  };

  const handleQuickLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setView('scenarios');
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  const handleActivityClick = () => {
    setShowLogs(true);
    setActiveTab('/activity'); // Set active tab to activity
  };

  const handleAddQuickLink = (e) => {
    e.preventDefault();
    setQuickLinks([...quickLinks, newQuickLink]);
    setNewQuickLink({ name: '', url: '' });
    setShowAddQuickLinkModal(false);
  };

  const handleEditQuickLink = (e) => {
    e.preventDefault();
    setQuickLinks(quickLinks.map(link => link === selectedQuickLink ? newQuickLink : link));
    toast.success('Quick link updated successfully');
    setShowEditQuickLinkModal(false);
  };

  const handleRemoveQuickLink = () => {
    setQuickLinks(quickLinks.filter(link => link !== selectedQuickLink));
    toast.success('Quick link removed successfully');
    setShowRemoveQuickLinkModal(false);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Logo Section */}
        <div className="logo-section">
          <img src={logo} alt="VERIFY 360" className="logo" />
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
            style={{ backgroundColor: activeTab === '/modules' ? 'orange' : '' }}
          >
            <span className="nav-icon">📊</span>
            <span>Modules</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/testrun' ? 'active' : ''}`}
            onClick={() => handleNavClick('/testrun')}
            style={{ backgroundColor: activeTab === '/testrun' ? 'orange' : '' }}
          >
            <span className="nav-icon">📋</span>
            <span>Test Runs</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/metrics' ? 'active' : ''}`}
            onClick={() => handleNavClick('/metrics')}
            style={{ backgroundColor: activeTab === '/metrics' ? 'orange' : '' }}
          >
            <span className="nav-icon">📈</span>
            <span>Metrics</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/testers' ? 'active' : ''}`}
            onClick={() => handleNavClick('/testers')}
            style={{ backgroundColor: activeTab === '/testers' ? 'orange' : '' }}
          >
            <span className="nav-icon">👥</span>
            <span>Testers</span>
          </div>
          <div 
            className={`nav-item ${activeTab === '/activity' ? 'active' : ''}`}
            onClick={handleActivityClick} // Update to handle click
            style={{ backgroundColor: activeTab === '/activity' ? 'orange' : '' }}
          >
            <span className="nav-icon">📝</span>
            <span>Activity</span>
          </div>
        </nav>

        {/* Quick Links */}
        <div className="quick-links">
          <div className="quick-links-header">
            <span>Quick Links</span>
            <button 
              className="add-link"
              onClick={() => setShowAddQuickLinkModal(true)} // Show the add quick link modal
            >
              +
            </button>
          </div>
          <ul className="quick-links-list">
            {quickLinks.map((link, index) => (
              <li 
                key={index} 
                className="quick-link-item"
                onClick={() => handleQuickLinkClick(link.url)}
              >
                <span>{link.name}</span>
                <button className="more-options" onClick={(e) => handleMenuClick(e, link)}>⋮</button>
                {selectedQuickLink === link && (
                  <div className="action-menu">
                    <div className="action-item" onClick={() => setShowEditQuickLinkModal(true)}>
                      <FaEdit /> Edit
                    </div>
                    <div className="action-item" onClick={() => setShowRemoveQuickLinkModal(true)}>
                      <FaTrash /> Remove
                    </div>
                  </div>
                )}
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
                  placeholder="Enter the document name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Enter Document Link</label>
                <input
                  type="url"
                  value={newQuickLink.url}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, url: e.target.value })}
                  placeholder="Enter the document link"
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

      {showRemoveQuickLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Remove Document</h2>
            <p>Are you sure you want to remove this document named <strong>{selectedQuickLink.name}</strong>?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => setShowRemoveQuickLinkModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleRemoveQuickLink}
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

export default Dashboard;
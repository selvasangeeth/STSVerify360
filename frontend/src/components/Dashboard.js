import './Dashboard.css';
import "react-toastify/ReactToastify.css";

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from './axios';
import UserProfile from './UserProfile';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdDashboard, MdAssignment, MdTimeline, MdHistory } from 'react-icons/md';

import LogList from './LogList';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname); // Set initial active tab based on current path
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showAddQuickLinkModal, setShowAddQuickLinkModal] = useState(false);
  const [newQuickLink, setNewQuickLink] = useState({ name: '', url: '' });
  const [showEditQuickLinkModal, setShowEditQuickLinkModal] = useState(false);
  const [activeQuickLink, setActiveQuickLink] = useState(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const[showRemoveConfirmModalQuickLink,setShowRemoveConfirmModalQuickLink]=useState(false);
  const [linkToRemove, setLinkToRemove] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', url: '', id: '' });

  const [newProject, setNewProject] = useState({
    projectName: '',
    logo: null
  });

  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToRemove, setProjectToRemove] = useState(null);
  const [editProjectData, setEditProjectData] = useState({
    projectName: '',
    logo: null
  });

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openQuickLinkIndex, setOpenQuickLinkIndex] = useState(null);
  const dropdownRef = useRef(null);
  const quickLinksRef = useRef(null);

  // Add click outside handler for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setOpenMenuIndex(null);
      }
      if (quickLinksRef.current && !quickLinksRef.current.contains(event.target)) {
        setOpenQuickLinkIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/getproject');
      setProjects(response.data.projects);
      console.log(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchQuickLinks = async () => {
    try {
      const response = await axios.get("/api/getHyperLink");

      if (Array.isArray(response.data.data)) {
        setQuickLinks(response.data.data);
      } else {
        setQuickLinks([]); 
      }
    } catch (err) {
      console.log("Error fetching quick links:", err);
      setQuickLinks([]); 
    }
  };


  useEffect(() => {

    fetchProjects();
    fetchQuickLinks();

    const storedProject = localStorage.getItem('selectedProject');
    if (storedProject) {
      const project = JSON.parse(storedProject);
      onProjectSelect(project);
      fetchModules(project.projectId);
    }
  }, []);

  const fetchModules = async (projectId) => {
    if (!projectId) {
      console.error('Project ID is missing');
      return;
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
  formData.append("projectName", newProject.projectName);
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
      if (response.data.msg) {
        toast(response.data.msg)
        setTimeout(() => { window.location.reload(); }, 2000)
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };



  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    setShowDropdown(false);
    console.log("projectlog :" + project.projectId);
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

  const handleEditQuickLink = async (link) => {

    setEditFormData({ name: link.name, url: link.url, id: link._id });
    setShowEditModal(true);
    setActiveQuickLink(null);
  };

  const handleRemoveQuickLink = (link) => {
    setLinkToRemove(link._id);
    setShowRemoveConfirmModalQuickLink(true);
    setActiveQuickLink(null);
  };

  const confirmRemoveLink = async() => {
   
    try{
      console.log(linkToRemove)
      const response = await axios.delete(`/api/deleteHyperLink/${linkToRemove}`)

      if(response.data.msg === "Hyperlink deleted successfully"){
        setShowRemoveConfirmModalQuickLink(false);
        setLinkToRemove(null);
        fetchQuickLinks();
        toast.success("HyperLink Deleted Successfully")
        setTimeout(() => {
          window.location.reload();
    
        }, 1000);

      }      
      else{
        toast.error(response.data.msg);
      }
    }
    catch(err){
      console.log(err);
    }
  };

  const handleEditSubmit = async () => {

 
    setShowEditModal(false);
    setEditingLink(null);
    setEditFormData({ name: '', url: '' ,id :''});

  try{
    const response = await axios.put("/api/updateQuickLink", {
      editFormData
    })
    if(response.data.msg === "Hyperlink updated successfully"){
      toast.success(response.data.msg);
      fetchQuickLinks();
      setTimeout(() => {
        window.location.reload();
  
      }, 1000);
    }
    else{
      toast.err(response.data.msg);
    }
  }
  catch(err){
    console.log(err);
  }
};






const handleAddQuickLink = (e) => {
  e.preventDefault();
  setQuickLinks([...quickLinks, newQuickLink]);
  setNewQuickLink({ name: '', url: '' });
  setShowAddQuickLinkModal(false);
};

const handleEditProject = (project) => {
  setProjectToEdit(project);
  setEditProjectData({
    projectName: project.projectName,
    logo: null
  });
  setShowEditProjectModal(true);
  setActiveProject(null);
};

const handleRemoveProject = (project) => {
  setProjectToRemove(project);
  setShowRemoveConfirmModal(true);
  setActiveProject(null);
};

const handleQuickLinkAdd = async () => {
  try {

    const response = await axios.post("/api/createHyperLink",
      {
        name: newQuickLink.name,
        url: newQuickLink.url,
      }
    )
    console.log(response.data.msg);
    if(response.data.msg === "Hyperlink created successfully"){
      toast.success(response.data.msg);

      setTimeout(() => {
        window.location.reload();
  
      }, 1000);
    }
    else{
      toast.error(response.data.msg);
    }
 
  }
  catch (err) {
    console.log(err);
  }
}


const handleEditSubmitProject = async (project) => {
  const formData = new FormData();
  formData.append("projectId", project.projectId);
  formData.append("newProjectName", editProjectData.projectName);
  formData.append("projectLogo", editProjectData.logo);


  try {
    const response = await axios.put('/updateProject', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.data.msg) {
      toast(response.data.msg);
      // Update the projects list
      const updatedProjects = projects.map(p =>
        p._id === projectToEdit._id
          ? { ...p, projectName: editProjectData.projectName }
          : p
      );
      setProjects(updatedProjects);
      setShowEditProjectModal(false);
      setProjectToEdit(null);
    }
  } catch (error) {
    console.error('Error updating project:', error);
    toast.error('Failed to update project');
  }
};

const handleConfirmRemoveProject = async (project) => {
  try {
    const response = await axios.delete(`/deleteProject/${project.projectId}`);
    if (response.data.msg) {
      toast(response.data.msg);
      const updatedProjects = projects.filter(p => p._id !== projectToRemove._id);
      setProjects(updatedProjects);
      setShowRemoveConfirmModal(false);
      setProjectToRemove(null);
      fetchProjects();
    }

  } catch (error) {
    console.error('Error deleting project:', error);
    toast.error('Failed to delete project');
  }
};


const toggleMenu = (index, e) => {
  e.stopPropagation();
  setOpenMenuIndex(openMenuIndex === index ? null : index);
};

const toggleQuickLinkMenu = (index, e) => {
  e.stopPropagation();
  setOpenQuickLinkIndex(openQuickLinkIndex === index ? null : index);
};

const QuickLinkItem = ({ link, onEdit, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="quick-link-item">

      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-link-name"
      >
        {link.name}
      </a>
      <div className="quick-link-menu" ref={menuRef}>
        <button className="menu-dots" onClick={() => setShowMenu(!showMenu)}>
          ⋮
        </button>
        {showMenu && (
          <div className="menu-dropdown">
            <button onClick={onEdit}>
              <svg className="edit-icon" viewBox="0 0 576 512">
                <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z" />
              </svg>
              Edit
            </button>
            <button onClick={onRemove}>
              <svg className="remove-icon" viewBox="0 0 448 512">
                <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" />
              </svg>
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

return (
  <div className="dashboard-container">
    <header className="dashboard-header">
      <div className="header-left">


        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="toggle-icon"
          >
            <path d="M10 6c-2.2 0-4 1.8-4 4v44c0 2.2 1.8 4 4 4h44c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4H10z" />

            {/* Line 1 */}
            <rect x="18" y="14" width="28" height="8" rx="4" />
            <circle
              cx={isSidebarCollapsed ? "42" : "22"}
              cy="18"
              r="4"
              fill="currentColor"
            />

            {/* Line 2 */}
            <rect x="18" y="28" width="28" height="8" rx="4" />
            <circle
              cx={isSidebarCollapsed ? "22" : "42"}
              cy="32"
              r="4"
              fill="currentColor"
            />

            {/* Line 3 */}
            <rect x="18" y="42" width="28" height="8" rx="4" />
            <circle
              cx={isSidebarCollapsed ? "42" : "22"}
              cy="46"
              r="4"
              fill="currentColor"
            />
          </svg>
        </button>





      </div>
      <div className="header-right">
        <UserProfile />
      </div>
    </header>
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="logo-section">
        <h1>Quality Arc</h1>
      </div>

      {/* Project Dropdown */}
      <div className="project-dropdown-container" ref={dropdownRef}>
        <div className="project-header">
          {selectedProject && selectedProject.projectLogo ? (
            <img
              src={`data:image/jpeg;base64,${selectedProject.projectLogo}`}
              alt={selectedProject.projectName}
              className="selected-project-logo"
            />
          ) : (
            <div className="project-logo-placeholder"></div>
          )}
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
                projects.map((project, index) => (
                  <div
                    key={project._id}
                    className="project-item"
                  >
                    <div className="project-details" onClick={() => handleProjectSelect(project)}>
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
                    <div className="project-actions">
                      <button
                        className="menu-dots"
                        onClick={(e) => toggleMenu(index, e)}
                      >
                        ⋮
                      </button>
                      {openMenuIndex === index && (
                        <div
                          className="project-menu-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project);
                          }}>
                            <FaEdit className="edit-icon" /> Edit
                          </button>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProject(project);
                          }}>
                            <FaTrash className="remove-icon" /> Remove
                          </button>
                        </div>
                      )}
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
          <MdDashboard className="nav-icon" />
          <span>Modules</span>
        </div>
        <div
          className={`nav-item ${activeTab === '/testrun' ? 'active' : ''}`}
          onClick={() => handleNavClick('/testrun')}
          style={{ backgroundColor: activeTab === '/testrun' ? '#be5133' : '' }}
        >
          <MdAssignment className="nav-icon" />
          <span>Test Runs</span>
        </div>
        <div
          className={`nav-item ${activeTab === '/metrics' ? 'active' : ''}`}
          onClick={() => handleNavClick('/metrics')}
          style={{ backgroundColor: activeTab === '/metrics' ? '#be5133' : '' }}
        >
          <MdTimeline className="nav-icon" />
          <span>Metrics</span>
        </div>
        <div
          className={`nav-item ${activeTab === '/activity' ? 'active' : ''}`}
          onClick={() => handleNavClick('/activity')}
          style={{ backgroundColor: activeTab === '/activity' ? '#be5133' : '' }}
        >
          <MdHistory className="nav-icon" />
          <span>Activity</span>
        </div>
      </nav>

      {/* Quick Links */}
      <div className="quick-links-section" ref={quickLinksRef}>
        <div className="quick-links-header">
          <h3>Quick Links</h3>
          <button
            className="add-quick-link"
            onClick={() => setShowAddQuickLinkModal(true)}
          >
            +
          </button>
        </div>
        <div className="quick-links-list">
  {Array.isArray(quickLinks) && quickLinks.length === 0 ? (
    <p>No Hyperlink Found</p>
  ) : (
    quickLinks.map((link, index) => (
      <QuickLinkItem
        key={index}
        link={link}
        onEdit={() => handleEditQuickLink(link)} 
        onRemove={() => handleRemoveQuickLink(link)} 
      />
    ))
  )}
</div>


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
    <ToastContainer />

    {/* Add Quick Link Modal */}
    {showAddQuickLinkModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Add New Document</h2>
          <form onSubmit={handleAddQuickLink}>
            <div className="form-group">
              <label>Document Name</label>
              <input
                type="text"
                placeholder="Enter the document name"
                value={newQuickLink.name}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Enter Document Link</label>
              <input
                type="url"
                placeholder="Enter the document name"
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
              <button type="submit" className="submit-btn" onClick={handleQuickLinkAdd}>
                Add Document
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

    {showRemoveConfirmModalQuickLink && (
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

    {showEditProjectModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Project</h2>
          <form onSubmit={() => handleEditSubmitProject(projectToEdit)}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={editProjectData.projectName}
                onChange={(e) => setEditProjectData({
                  ...editProjectData,
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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditProjectData({
                          ...editProjectData,
                          logo: file
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {editProjectData.logo && (
                  <div className="project-item">
                    <img src={URL.createObjectURL(editProjectData.logo)} alt="Project Logo" />
                    <span className="project-name">{editProjectData.projectName || "Project Name"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowEditProjectModal(false);
                  setProjectToEdit(null);
                }}
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

    {showRemoveConfirmModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Confirm Removal</h2>
          <p>Are you sure you want to remove this project?</p>
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
              onClick={() => handleConfirmRemoveProject(projectToRemove)}
              className="submit-btn"
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
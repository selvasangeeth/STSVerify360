import React, { useState } from 'react';
import './AdminDashboard.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([
    'Project_name_2',
    'Project_name_3',
    'Project_name_4',
    'Project_name_5',
    'Project_name_6',
    'Project_name_7'
  ]);
  
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Surya Prabhu T',
      role: 'QA Manager',
      username: 'surya'
    }
  ]);

  const [newMember, setNewMember] = useState({
    fullName: '',
    role: '',
    username: '',
    password: ''
  });

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitMember = (e) => {
    e.preventDefault();
    if (newMember.fullName && newMember.role) {
      const newTeamMember = {
        id: teamMembers.length + 1,
        name: newMember.fullName,
        role: newMember.role,
        username: newMember.username
      };
      
      setTeamMembers([...teamMembers, newTeamMember]);
      setNewMember({
        fullName: '',
        role: '',
        username: '',
        password: ''
      });
      setShowAddMemberModal(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleAddProject = () => {
    setShowAddProjectModal(true);
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      setProjects([...projects, newProjectName.trim()]);
      setNewProjectName('');
      setShowAddProjectModal(false);
    }
  };

  const [showModules, setShowModules] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [projectModules, setProjectModules] = useState({});

  const handleModuleClick = (project) => {
    setSelectedProject(project);
  };

  const handleTestRunClick = (projectName) => {
    setSelectedProject(projectName);
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    if (newModuleName.trim() && selectedProject) {
      const newModule = {
        name: newModuleName,
        impactModules: [],
        createdBy: 'Surya Prabhu T',
        testScenarios: 30,
        testRuns: 30
      };

      setProjectModules(prev => ({
        ...prev,
        [selectedProject]: [...(prev[selectedProject] || []), newModule]
      }));

      setNewModuleName('');
      setShowAddModuleModal(false);
    }
  };

  const overallMetrics = {
    passed: 75,
    failed: 15,
    pending: 10,
    total: 100
  };

  const userMetrics = {
    passed: 35,
    failed: 10,
    pending: 5,
    total: 50
  };

  const renderMetricCircle = (data) => (
    <div className="metric-circle">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="3"
          strokeDasharray={`${(data.passed / data.total) * 100}, 100`}
        />
      </svg>
      <div className="metric-legend">
        <div className="metric-item">
          <span className="dot passed"></span>
          <span>Passed: {data.passed}</span>
        </div>
        <div className="metric-item">
          <span className="dot failed"></span>
          <span>Failed: {data.failed}</span>
        </div>
        <div className="metric-item">
          <span className="dot pending"></span>
          <span>Pending: {data.pending}</span>
        </div>
        <div className="metric-total">
          Total: {data.total}
        </div>
      </div>
    </div>
  );

  const renderMetricsBoxes = () => (
    <div className="top-metrics-boxes">
      <div className="metric-box">
        <h4>Overall Test Execution</h4>
        <div className="metric-details">
          <div className="metric-row">Passed: 75</div>
          <div className="metric-row">Failed: 15</div>
          <div className="metric-row">Pending: 10</div>
          <div className="metric-total">Total: 100</div>
        </div>
      </div>

      <div className="metric-box">
        <h4>Individual User Metrics</h4>
        <div className="metric-details">
          <div className="metric-row">Passed: 35</div>
          <div className="metric-row">Failed: 10</div>
          <div className="metric-row">Pending: 5</div>
          <div className="metric-total">Total: 50</div>
        </div>
      </div>
    </div>
  );

  const [activeTab, setActiveTab] = useState('modules');

  const handleTeamClick = (project) => {
    setSelectedProject(project);
    setShowModules(false);
    // Show team members section
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="admin-page">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="header">
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1>Test QA</h1>
        </div>

        <div className="projects-section">
          <div className="section-header">
            <h2>Projects</h2>
            <button className="add-button" onClick={handleAddProject}>+</button>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-wrapper">
                <div className={`project-item ${selectedProject === project ? 'selected' : ''}`}>
                  {project}
                  <div className="hover-menu">
                    <button 
                      className="menu-item"
                      onClick={() => handleModuleClick(project)}
                    >
                      Modules
                    </button>
                    <button 
                      className="menu-item"
                      onClick={() => handleTestRunClick(project)}
                    >
                      Test Runs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <button className="logout-button">Logout</button>
        </div>

        <div className="content-layout">
          {/* Metrics Section */}
          <div className="metrics-container">
            {/* Overall Test Execution Metrics */}
            <div className="metric-box">
              <div className="metric-header">
                <h3>Overall Test Execution</h3>
                <select className="time-filter">
                  <option>Last 90 days</option>
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-value success">85%</div>
                  <div className="metric-label">Pass Rate</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value warning">12%</div>
                  <div className="metric-label">Fail Rate</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value info">3%</div>
                  <div className="metric-label">Blocked</div>
                </div>
                <div className="metric-item total">
                  <div className="metric-value">324</div>
                  <div className="metric-label">Total Test Runs</div>
                </div>
              </div>
            </div>

            {/* Individual User Metrics */}
            <div className="metric-box">
              <div className="metric-header">
                <h3>Individual User Metrics</h3>
                <select className="time-filter">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              <div className="user-metrics">
                <div className="user-metric-row">
                  <div className="user-info">
                    <div className="user-avatar">SP</div>
                    <div className="user-name">Surya Prabhu</div>
                  </div>
                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-value">45</span>
                      <span className="stat-label">Tests</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value success">92%</span>
                      <span className="stat-label">Pass</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value error">8%</span>
                      <span className="stat-label">Fail</span>
                    </div>
                  </div>
                </div>
                <div className="user-metric-row">
                  <div className="user-info">
                    <div className="user-avatar">RK</div>
                    <div className="user-name">Raj Kumar</div>
                  </div>
                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-value">38</span>
                      <span className="stat-label">Tests</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value success">88%</span>
                      <span className="stat-label">Pass</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value error">12%</span>
                      <span className="stat-label">Fail</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="team-section">
            <div className="section-header">
              <h2>Team Members</h2>
              <button className="add-button" onClick={handleAddMember}>
                <span className="plus-icon">+</span> Add Member
              </button>
            </div>
            <div className="team-members">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="member-avatar">
                    {member.name.charAt(0)}
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules Section - Only show when showModules is true */}
          {showModules && (
            <div className="modules-section">
              <div className="modules-header">
                <div className="header-left">
                  <h2>Modules ({projectModules[selectedProject]?.length || 0})</h2>
                </div>
                <div className="header-right">
                  <div className="search-box">
                    <input 
                      type="text" 
                      placeholder="Search modules..."
                      className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                  </div>
                  <button className="add-module-btn" onClick={() => setShowAddModuleModal(true)}>+ Add Module</button>
                </div>
              </div>

              <div className="modules-table-container">
                <table className="modules-table">
                  <thead>
                    <tr>
                      <th>Module name</th>
                      <th>Impact Modules</th>
                      <th>Created By</th>
                      <th>No of Test Scenarios</th>
                      <th>No of Test Runs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectModules[selectedProject]?.map((module, index) => (
                      <tr key={index}>
                        <td>{module.name}</td>
                        <td>{module.impactModules || '-'}</td>
                        <td>{module.createdBy}</td>
                        <td>{module.testScenarios}</td>
                        <td>{module.testRuns}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Team Member</h3>
            <div className="modal-content">
              <input
                type="text"
                className="modal-input"
                placeholder="Full Name"
                name="fullName"
                value={newMember.fullName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className="modal-input"
                placeholder="Role"
                name="role"
                value={newMember.role}
                onChange={handleInputChange}
              />
              <input
                type="text"
                className="modal-input"
                placeholder="Username"
                name="username"
                value={newMember.username}
                onChange={handleInputChange}
              />
              <input
                type="password"
                className="modal-input"
                placeholder="Password"
                name="password"
                value={newMember.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button" 
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMember({
                    fullName: '',
                    role: '',
                    username: '',
                    password: ''
                  });
                }}
              >
                Cancel
              </button>
              <button 
                className="modal-button ok"
                onClick={handleSubmitMember}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Project</h3>
            <div className="modal-content">
              <input
                type="text"
                className="modal-input"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button 
                className="modal-button"
                onClick={() => {
                  setShowAddProjectModal(false);
                  setNewProjectName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="modal-button ok"
                onClick={handleSubmitProject}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Module to {selectedProject}</h2>
            <form onSubmit={handleAddModule}>
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Module Name"
                className="module-input"
                autoFocus
                required
              />
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setNewModuleName('');
                    setShowAddModuleModal(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
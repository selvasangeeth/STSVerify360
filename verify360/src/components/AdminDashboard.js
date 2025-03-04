
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { 
  ChevronDown, 
  LogOut, 
  Search, 
  Plus, 
  User
} from "lucide-react";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
    },
    {
      id: 2,
      name: 'Deva',
      role: 'QA Lead',
      username: 'deva'
    },
    {
      id: 3,
      name: 'Priya',
      role: 'QA Engineer',
      username: 'priya'
    },
    {
      id: 4,
      name: 'Dhyanesh',
      role: 'QA Engineer',
      username: 'dyanahesh'
    },

  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    username: '',
    password: ''
  });

  // Add state for hovering project
  const [hoveredProject, setHoveredProject] = useState(null);

  // Add state for previous state backup
  const [previousState, setPreviousState] = useState(null);

  // MetricsPanel state
  const [selectedUser, setSelectedUser] = useState('Deva');
  const teamMetrics = {
    totalTestCases: 150,
    totalTestScenarios: 75,
    passedTests: 120,
    failedTests: 30,
    blockedTests: 5,
    executedTests: 150,
  };
  const userMetrics = {
    "Surya Prabhu T": { testCases: 45, testScenarios: 20, passed: 38, failed: 7, executed: 45 },
    "Deva": { testCases: 30, testScenarios: 15, passed: 25, failed: 5, executed: 30 },
    "Priya": { testCases: 25, testScenarios: 12, passed: 20, failed: 5, executed: 25 },
    "Dyanahesh": { testCases: 28, testScenarios: 14, passed: 22, failed: 6, executed: 28 },
    "Pavithra": { testCases: 22, testScenarios: 14, passed: 15, failed: 7, executed: 22 },
  };
  const overallData = [
    { name: "Pass Rate", value: teamMetrics.passedTests },
    { name: "Fail Rate", value: teamMetrics.failedTests },
    { name: "Blocked", value: teamMetrics.blockedTests },
  ];
  const COLORS = ["#28A745", "#FFC107", "#0D6EFD"];

  // Modify handleAddMemberClick to backup current state
  const handleAddMemberClick = () => {
    setPreviousState({
      teamMembers: [...teamMembers]
    });
    setShowAddMemberModal(true);
  };

  // Add revert function
  const handleRevert = () => {
    if (previousState) {
      setTeamMembers(previousState.teamMembers);
      setPreviousState(null);
    }
  };

  // Modify handleCancel
  const handleCancel = () => {
    handleRevert(); // Revert to previous state
    setNewMember({
      name: '',
      role: '',
      username: '',
      password: ''
    });
    setShowAddMemberModal(false);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.username && newMember.password) {
      setTeamMembers([...teamMembers, {
        id: teamMembers.length + 1,
        name: newMember.name,
        role: newMember.role,
        username: newMember.username
      }]);
      setShowAddMemberModal(false);
      setNewMember({
        name: '',
        role: '',
        username: '',
        password: ''
      });
    }
  };

  // Modified to handle mouse events for hover menu
  const handleProjectMouseEnter = (project) => {
    setHoveredProject(project);
  };

  const handleProjectMouseLeave = () => {
    setHoveredProject(null);
  };

  const handleModuleClick = (project) => {
    setSelectedProject(project);
    setActiveTab('modules');
    setHoveredProject(null);
  };

  const handleTestRunClick = (project) => {
    setSelectedProject(project);
    setActiveTab('testruns');
    setHoveredProject(null);
  };

  const handleProjectClick = (project) => {
    // If we're not clicking on the hover menu, toggle selection
    if (hoveredProject !== project) {
      setSelectedProject(project);
      setActiveTab('modules');
    }
  };

  const [showProjectModal, setShowProjectModal] = useState(false);
  const handleAddProject = () => {
    setShowProjectModal(true);
  };

  const handleCancelProject = () => {
    setNewProjectName('');
    setShowProjectModal(false);
  };

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, newProjectName]);
      setNewProjectName('');
      setShowProjectModal(false);
    }
  };

  const [showModules, setShowModules] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [projectModules, setProjectModules] = useState({
    'Project_name_2': [
      { name: 'User Management', impactModules: 'Authentication', createdBy: 'Surya', testScenarios: 12, testRuns: 5 },
      { name: 'Reporting', impactModules: 'Dashboard', createdBy: 'Priya', testScenarios: 8, testRuns: 3 }
    ]
  });

  const [activeTab, setActiveTab] = useState('modules');

  const handleAddModule = (project) => {
    setSelectedProject(project);
    setShowAddModuleModal(true);
  };

  const handleCreateModule = () => {
    if (newModuleName.trim()) {
      const currentModules = projectModules[selectedProject] || [];
      const updatedModules = [...currentModules, {
        name: newModuleName,
        impactModules: '-',
        createdBy: 'Current User',
        testScenarios: 0,
        testRuns: 0
      }];
      
      setProjectModules({
        ...projectModules,
        [selectedProject]: updatedModules
      });
      
      setShowAddModuleModal(false);
      setNewModuleName('');
    }
  };

  // Handle user selection change from dropdown
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  return (
    <div className="admin-page">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="header">
          <div className="logo">QA</div>
          <h1>Test QA</h1>
        </div>

        <div className="projects-section">
          <div className="projects-header">
            <h2>Projects</h2>
            <button className="add-project-btn" onClick={handleAddProject}>
              <Plus size={16} />
            </button>
          </div>
          <div className="projects-list">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className={`project-item ${selectedProject === project ? 'selected' : ''}`}
                onClick={() => handleProjectClick(project)}
                onMouseEnter={() => handleProjectMouseEnter(project)}
                onMouseLeave={handleProjectMouseLeave}
              >
                {project}
                
                {/* Hover menu for project options */}
                {hoveredProject === project && (
                  <div className="project-hover-menu">
                    <button 
                      className="hover-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModuleClick(project);
                      }}
                    >
                      Modules
                    </button>
                    <button 
                      className="hover-option"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestRunClick(project);
                      }}
                    >
                      Test Runs
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-bar">
          <button className="logout-button">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className="content-layout">
          {/* Top Navigation Tabs - Only show when project is selected */}
          {selectedProject && (
            <div className="tab-container">
              <button 
                className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
                onClick={() => setActiveTab('modules')}
              >
                Modules
              </button>
              <button 
                className={`tab-button ${activeTab === 'testruns' ? 'active' : ''}`}
                onClick={() => setActiveTab('testruns')}
              >
                Test Runs
              </button>
            </div>
          )}

          {/* Metrics Panel */}
          <div className="metrics-panel">
            <div className="metrics-container">
              <div className="overall-metrics">
                <h3>Overall Test Execution</h3>
                <div className="chart-container">
                  <PieChart width={300} height={300}>
                    <Pie 
                      data={overallData} 
                      cx={150} 
                      cy={150} 
                      outerRadius={80} 
                      fill="#8884D8" 
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {overallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Tests']} />
                    <Legend />
                  </PieChart>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: "#28A745"}}></span>
                    <span>Pass Rate</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: "#FFC107"}}></span>
                    <span>Fail Rate</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: "#0D6EFD"}}></span>
                    <span>Blocked</span>
                  </div>
                </div>
              </div>
              
              <div className="user-metrics">
                <div className="user-dropdown-container">
                  <select 
                    className="user-dropdown"
                    value={selectedUser}
                    onChange={handleUserChange}
                  >
                    {Object.keys(userMetrics).map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedUser && (
                  <div className="metrics-card">
                    <h3>{selectedUser}'s Metrics</h3>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <span className="metric-value">{userMetrics[selectedUser].testCases}</span>
                        <span className="metric-label">Test Cases</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value">{userMetrics[selectedUser].testScenarios}</span>
                        <span className="metric-label">Test Scenarios</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value passed">{userMetrics[selectedUser].passed}</span>
                        <span className="metric-label">Passed</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value failed">{userMetrics[selectedUser].failed}</span>
                        <span className="metric-label">Failed</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value">{userMetrics[selectedUser].executed}</span>
                        <span className="metric-label">Executed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="team-section">
            <div className="section-header">
              <h2>Team Members</h2>
              <button className="add-member-btn" onClick={handleAddMemberClick}>
                <Plus size={16} />
                <span>Add Member</span>
              </button>
            </div>
            <div className="team-members-list">
              {teamMembers.map(member => (
                <div key={member.id} className="team-member">
                  <div className="member-avatar">{member.name.charAt(0)}</div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules and Test Runs Sections */}
          {selectedProject && (
            <>
              {activeTab === 'modules' && (
                <div className="modules-section">
                  <div className="section-header">
                    <h2>Modules ({projectModules[selectedProject]?.length || 0})</h2>
                    <div className="header-actions">
                      <div className="search-box">
                        <input 
                          type="text" 
                          placeholder="Search modules..."
                          className="search-input"
                        />
                        <span className="search-icon"><Search size={16} /></span>
                      </div>
                      <button className="add-module-btn" onClick={() => handleAddModule(selectedProject)}>
                        <Plus size={16} />
                        <span>Add Module</span>
                      </button>
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
                          <tr key={index} className="module-row">
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

              {activeTab === 'testruns' && (
                <div className="test-runs-section">
                  <div className="section-header">
                    <h2>Test Runs (50)</h2>
                    <div className="header-actions">
                      <div className="search-box">
                        <input 
                          type="text" 
                          placeholder="Search test runs..." 
                          className="search-input"
                        />
                        <span className="search-icon"><Search size={16} /></span>
                      </div>
                      <button className="add-module-btn">
                        <Plus size={16} />
                        <span>Add Test Run</span>
                      </button>
                    </div>
                  </div>
                  <div className="test-runs-table-container">
                    <table className="test-runs-table">
                      <thead>
                        <tr>
                          <th>Task ID</th>
                          <th>Sub Task ID</th>
                          <th>Test Scenario ID</th>
                          <th>Test Scenario</th>
                          <th>Tested By</th>
                          <th>Region</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="test-run-row">
                          <td>SP-232</td>
                          <td>SP-232</td>
                          <td>SpanPeople_SS_TS001</td>
                          <td>Verify the user able to request the timeoff on Past and Future saturdays</td>
                          <td>Surya Prabhu T<br/>24th Feb 2025</td>
                          <td>APAC</td>
                          <td>
                            <select className="status-select">
                              <option value="">Select</option>
                              <option value="pass">Pass</option>
                              <option value="fail">Fail</option>
                              <option value="blocked">Blocked</option>
                            </select>
                          </td>
                        </tr>
                        <tr className="test-run-row">
                          <td>SP-233</td>
                          <td>SP-233</td>
                          <td>SpanPeople_SS_TS002</td>
                          <td>Validate error message on invalid login</td>
                          <td>Priya<br/>25th Feb 2025</td>
                          <td>EMEA</td>
                          <td>
                            <select className="status-select">
                              <option value="">Select</option>
                              <option value="pass">Pass</option>
                              <option value="fail">Fail</option>
                              <option value="blocked">Blocked</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Team Member</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Full Name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Username"
                value={newMember.username}
                onChange={(e) => setNewMember({...newMember, username: e.target.value})}
                className="modal-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={newMember.password}
                onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAddMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Project</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelProject}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Module to {selectedProject}</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Module Name"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                className="modal-input"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddModuleModal(false);
                  setNewModuleName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={handleCreateModule}
              >
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

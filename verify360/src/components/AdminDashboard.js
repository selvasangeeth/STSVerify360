import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
    ChevronDown, 
    Search, 
    Edit, 
    Plus, 
    MoreVertical, 
    Trash, 
    Eye, 
    Users as UsersIcon,
    LogOut
} from "lucide-react"
import "./AdminDashboard.css"
import AddProjectModal from "./models/AddProjectModal"
import AddDocumentModal from "./models/AddDocumentModal"
import AddModuleModal from "./models/AddModuleModal"
import Testers from "./Testers/Testers"
import Activity from './Activity/Activity'
import Users from './Users/Users'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [showAddDocument, setShowAddDocument] = useState(false)
  const [showAddModule, setShowAddModule] = useState(false)
  const [projects, setProjects] = useState([
    { id: 1, name: "Project name 1", logo: "/logo.png" },
    { id: 2, name: "Project name 2", logo: "/logo.png" },
  ])
  const [documents, setDocuments] = useState([
    { id: 1, name: "SOP 3 Defect Management Notes" },
    { id: 2, name: "SOP 3 Defect Management Notes" },
    { id: 3, name: "SOP 3 Defect Management Notes" },
  ])
  const [modules, setModules] = useState([
    {
      id: 1,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 2,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 3,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 4,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 5,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 6,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 7,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
    {
      id: 8,
      moduleName: "Module Name 1",
      moduleId: "Mod_001",
      submoduleName: "Submodule Name 1",
      submoduleId: "Mod_001_Sub_001",
      lastTested: "March 03 2023",
      scenarios: 50,
      runs: 50,
    },
  ])
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [scenarios, setScenarios] = useState([
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu, T",
      createdDate: "March 05 2025",
      cases: 50
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_02",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu, T",
      createdDate: "March 05 2025",
      cases: 50
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_03",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu, T",
      createdDate: "March 05 2025",
      cases: 50
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_04",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu, T",
      createdDate: "March 05 2025",
      cases: 50
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      testScenario: "SpanPeople_SS_TS_05",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu, T",
      createdDate: "March 05 2025",
      cases: 50
    }
  ]);
  const [showAddScenario, setShowAddScenario] = useState(false);
  const [selectedModuleForScenarios, setSelectedModuleForScenarios] = useState(null);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [testCases, setTestCases] = useState([
    {
      id: "SpanPeople_SS_TS001_TC001",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: "Positive",
      createdDate: "March 05 2025",
      updatedDate: "March 05 2025"
    },
    {
      id: "SpanPeople_SS_TS001_TC002",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: "Negative",
      createdDate: "March 05 2025",
      updatedDate: "March 05 2025"
    },
    {
      id: "SpanPeople_SS_TS001_TC003",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: "Positive",
      createdDate: "March 05 2025",
      updatedDate: "March 05 2025"
    },
    {
      id: "SpanPeople_SS_TS001_TC004",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: "Negative",
      createdDate: "March 05 2025",
      updatedDate: "March 05 2025"
    },
    {
      id: "SpanPeople_SS_TS001_TC005",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays. Verify the user able to request the Timeoff on Past and Future saturdays",
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: "Positive",
      createdDate: "March 05 2025",
      updatedDate: "March 05 2025"
    }
  ]);
  const [scenarioForm, setScenarioForm] = useState({
    taskId: '',
    subTaskId: '',
    testScenario: '',
    description: ''
  });
  const [showAddTestCase, setShowAddTestCase] = useState(false);
  const [testCaseForm, setTestCaseForm] = useState({
    id: '',
    description: '',
    caseType: 'Positive'
  });

  const handleAddProject = (project) => {
    setProjects([...projects, { id: Date.now(), ...project }])
  }

  const handleAddDocument = (document) => {
    setDocuments([...documents, { id: Date.now(), ...document }])
  }

  const handleAddModule = (module) => {
    const newModule = {
      id: Date.now(),
      moduleName: module.moduleName,
      moduleId: `Mod_${Date.now()}`,
      submoduleName: module.submoduleName,
      submoduleId: `Sub_${Date.now()}`,
      lastTested: new Date().toLocaleDateString(),
      scenarios: 50,
      runs: 50,
    }
    setModules([...modules, newModule])
    setShowAddModule(false)
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    setShowProjectDropdown(false)
  }

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem)
    if (selectedProject) {
      // ... any other existing code in this function
    } else {
      alert("Please select a project first")
    }
  }

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter((doc) => doc.id !== documentId))
    setShowConfirmDelete(null)
  }

  const handleDocumentAction = (action, document) => {
    if (action === 'edit') {
      console.log('Edit document:', document)
    } else if (action === 'remove') {
      setShowConfirmDelete(document)
    }
    setShowDocumentDropdown(null)
  }

  const handleLogout = () => {
    // Navigate back to login page
    navigate("/")
  }

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setActiveMenuItem("Test Scenarios");
  }

  const handleScenarioFormChange = (e) => {
    const { name, value } = e.target;
    setScenarioForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddScenario = (e) => {
    e.preventDefault();
    const newScenario = {
      taskId: scenarioForm.taskId,
      subTaskId: scenarioForm.subTaskId,
      testScenario: scenarioForm.testScenario,
      description: scenarioForm.description,
      createdBy: "Surya Prabhu T",
      createdDate: new Date().toLocaleDateString(),
      cases: 50
    };
    setScenarios([...scenarios, newScenario]);
    setScenarioForm({
      taskId: '',
      subTaskId: '',
      testScenario: '',
      description: ''
    });
    setShowAddScenario(false);
  };

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
    setActiveMenuItem("Test Cases");
  };

  const handleTestCaseFormChange = (e) => {
    const { name, value } = e.target;
    setTestCaseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTestCase = (e) => {
    e.preventDefault();
    const newTestCase = {
      id: testCaseForm.id,
      description: testCaseForm.description,
      createdBy: "Surya Prabhu T",
      updatedBy: "Surya Prabhu T",
      caseType: testCaseForm.caseType,
      createdDate: new Date().toLocaleDateString(),
      updatedDate: new Date().toLocaleDateString()
    };
    setTestCases([...testCases, newTestCase]);
    setTestCaseForm({
      id: '',
      description: '',
      caseType: 'Positive'
    });
    setShowAddTestCase(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Add the new header profile */}
      <div className="header-profile">
        <div className="header-avatar">
          <img src="/profile-image.jpg" alt="Profile" />
        </div>
        <div className="header-user-info">
          <span className="header-user-name">John Doe</span>
          <span className="header-user-role">Administrator</span>
        </div>
        <button className="header-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
            <span>VERIFY 360</span>
          </div>
        </div>

        <div className="project-section">
          <div className="project-selector" onClick={() => setShowProjectDropdown(!showProjectDropdown)}>
            <span>{selectedProject?.name || "Select Project"}</span>
            <ChevronDown size={16} />
          </div>

          {showProjectDropdown && (
            <div className="project-dropdown">
              {projects.map((project) => (
                <div key={project.id} className="project-item" onClick={() => handleProjectSelect(project)}>
                  <span>{project.name}</span>
                </div>
              ))}
              <button className="add-project-btn" onClick={() => setShowAddProject(true)}>
                <Plus size={16} />
                Add Project
              </button>
            </div>
          )}
        </div>

        <div className="menu-items">
          <div
            className={`menu-item ${activeMenuItem === "Modules" ? "active" : ""}`}
            onClick={() => handleMenuClick("Modules")}
          >
            <div className="menu-icon">
              <div className="icon-box"></div>
            </div>
            <span>Modules</span>
          </div>

          <div
            className={`menu-item ${activeMenuItem === "Test Runs" ? "active" : ""}`}
            onClick={() => handleMenuClick("Test Runs")}
          >
            <div className="menu-icon">
              <div className="icon-box"></div>
            </div>
            <span>Test Runs</span>
          </div>

          <div
            className={`menu-item ${activeMenuItem === "Metrics" ? "active" : ""}`}
            onClick={() => handleMenuClick("Metrics")}
          >
            <div className="menu-icon">
              <div className="icon-box"></div>
            </div>
            <span>Metrics</span>
          </div>

          <div
            className={`menu-item ${activeMenuItem === "Testers" ? "active" : ""}`}
            onClick={() => handleMenuClick("Testers")}
          >
            <div className="menu-icon">
              <div className="icon-box"></div>
            </div>
            <span>Testers</span>
          </div>

          <div
            className={`menu-item ${activeMenuItem === "Activity" ? "active" : ""}`}
            onClick={() => handleMenuClick("Activity")}
          >
            <div className="menu-icon">
              <div className="icon-box"></div>
            </div>
            <span>Activity</span>
          </div>

          <div
            className={`menu-item ${activeMenuItem === "Users" ? "active" : ""}`}
            onClick={() => handleMenuClick("Users")}
          >
            <UsersIcon size={20} />
            <span>Users</span>
          </div>
        </div>

        <div className="documents-section">
          <div className="documents-header">
            <span>Documents</span>
            <button className="add-document-btn" onClick={() => setShowAddDocument(true)}>
              <Plus size={16} />
            </button>
          </div>

          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <span>{doc.name}</span>
                <div className="document-actions">
                  <button 
                    className="document-action-btn"
                    onClick={() => setShowDocumentDropdown(doc.id === showDocumentDropdown ? null : doc.id)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {showDocumentDropdown === doc.id && (
                    <div className="document-dropdown">
                      <div className="document-dropdown-item" onClick={() => handleDocumentAction('edit', doc)}>
                        <Edit size={16} />
                        <span>Edit</span>
                      </div>
                      <div className="document-dropdown-item remove" onClick={() => handleDocumentAction('remove', doc)}>
                        <Trash size={16} />
                        <span>Remove</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeMenuItem === "Modules" && selectedProject && (
          <>
            <div className="header">
              <div className="breadcrumb">
                <span>{selectedProject.name}</span>
                <span>/</span>
                <span>Modules</span>
              </div>

              <div className="search-container">
                <div className="search-box">
                  <Search size={16} color="#666" />
                  <input type="text" placeholder="Search by Module Name / Module ID / Submodule Name / Submodule ID" />
                </div>

                <button className="add-module-btn" onClick={() => setShowAddModule(true)}>
                  <Plus size={16} />
                  Add Module
                </button>
              </div>
            </div>

            <div className="modules-section">
              <div className="modules-table-container">
                <table className="modules-table">
                  <thead>
                    <tr>
                      <th>Module Name</th>
                      <th>Submodule Name</th>
                      <th>Last Tested</th>
                      <th>No of Scenarios</th>
                      <th>No of Runs</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.id}>
                        <td>
                          <div className="module-name clickable" onClick={() => handleModuleClick(module)}>
                            <div>{module.moduleName}</div>
                            <span className="module-id">{module.moduleId}</span>
                          </div>
                        </td>
                        <td>
                          <div className="submodule-name">
                            <div>{module.submoduleName}</div>
                            <span className="submodule-id">{module.submoduleId}</span>
                          </div>
                        </td>
                        <td>
                          <div className="last-tested">
                            <div>Surya Prabhu, T</div>
                            <div className="test-date">{module.lastTested}</div>
                          </div>
                        </td>
                        <td>{module.scenarios}</td>
                        <td>{module.runs}</td>
                        <td>
                          <button className="edit-btn">
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeMenuItem === "Testers" && selectedProject && (
          <Testers />
        )}

        {activeMenuItem === "Test Scenarios" && selectedModule && (
          <div className="scenarios-view">
            <div className="scenarios-fixed-header">
              <div className="breadcrumb">
                <span>Project name 1</span>
                <span>/</span>
                <span>Module name 1</span>
                <span>/</span>
                <span>Submodule Name 1</span>
                <span>/</span>
                <span>Scenarios</span>
              </div>

              <div className="scenarios-header">
                <div className="title-search">
                  <span>Scenarios</span>
                  <div className="search-box">
                    <Search size={16} color="#666" />
                    <input type="text" placeholder="Search by Test Scenario ID" />
                  </div>
                </div>
                <div className="header-right">
                  <div className="module-selector" onClick={() => setShowModuleDropdown(!showModuleDropdown)}>
                    <div className="module-name">
                      <span>Module name 1</span>
                      <ChevronDown size={16} color="#666" />
                    </div>
                    {showModuleDropdown && (
                      <div className="module-dropdown-list">
                        {modules.map((module) => (
                          <div
                            key={module.id}
                            className="module-dropdown-item"
                            onClick={() => {
                              setSelectedModuleForScenarios(module);
                              setShowModuleDropdown(false);
                            }}
                          >
                            {module.moduleName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="add-scenario-btn" onClick={() => setShowAddScenario(true)}>
                    <Plus size={16} />
                    Add Scenario
                  </button>
                </div>
              </div>
            </div>

            <div className="scenarios-scrollable-content">
              <div className="scenarios-table-container">
                <table className="scenarios-table">
                  <thead>
                    <tr>
                      <th>Task ID</th>
                      <th>Sub Task ID</th>
                      <th>Test Scenario</th>
                      <th>Created By</th>
                      <th>No of Cases</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario, index) => (
                      <tr key={index}>
                        <td>{scenario.taskId}</td>
                        <td>{scenario.subTaskId}</td>
                        <td 
                          className="test-scenario-column"
                          onClick={() => handleScenarioClick(scenario)}
                        >
                          <div className="test-scenario-title">{scenario.testScenario}</div>
                          <div className="test-scenario-desc">
                            {scenario.description}
                          </div>
                        </td>
                        <td>{scenario.createdBy}</td>
                        <td>{scenario.cases}</td>
                        <td>
                          <button className="edit-btn">
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenuItem === "Test Cases" && selectedScenario && (
          <div className="test-cases-view">
            <div className="scenarios-fixed-header">
              <div className="breadcrumb">
                <span>{selectedProject?.name}</span>
                <span>/</span>
                <span>{selectedModule?.moduleName}</span>
                <span>/</span>
                <span>{selectedModule?.submoduleName}</span>
                <span>/</span>
                <span>{selectedScenario?.testScenario}</span>
                <span>/</span>
                <span>Test Cases</span>
              </div>

              <div className="scenarios-header">
                <div className="title-search">
                  <span>Test Cases</span>
                  <div className="search-box">
                    <Search size={16} color="#666" />
                    <input type="text" placeholder="Search by Test Case ID" />
                  </div>
                </div>
                <div className="header-right">
                  <div className="module-selector">
                    <div className="module-name">
                      <span>{selectedScenario?.testScenario}</span>
                      <ChevronDown size={16} color="#666" />
                    </div>
                  </div>
                  <button className="add-scenario-btn" onClick={() => setShowAddTestCase(true)}>
                    <Plus size={16} />
                    Add Case
                  </button>
                </div>
              </div>
            </div>

            <div className="scenarios-scrollable-content">
              <div className="scenarios-table-container">
                <table className="scenarios-table">
                  <thead>
                    <tr>
                      <th>Test Case</th>
                      <th>Created By</th>
                      <th>Updated By</th>
                      <th>Case Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCases.map((testCase) => (
                      <tr key={testCase.id}>
                        <td>
                          <div className="test-scenario-column">
                            <div className="test-scenario-title">{testCase.id}</div>
                            <div className="test-scenario-desc">{testCase.description}</div>
                          </div>
                        </td>
                        <td>
                          <div>{testCase.createdBy}</div>
                          <div className="date">{testCase.createdDate}</div>
                        </td>
                        <td>
                          <div>{testCase.updatedBy}</div>
                          <div className="date">{testCase.updatedDate}</div>
                        </td>
                        <td>
                          <span className={`status-badge ${testCase.caseType.toLowerCase()}`}>
                            {testCase.caseType}
                          </span>
                        </td>
                        <td>
                          <button className="edit-btn">
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenuItem === "Activity" && (
          <div>
            <h1>Activity Test</h1>
            <Activity />
          </div>
        )}

        {activeMenuItem === "Users" && selectedProject && (
          <Users />
        )}
      </div>

      {/* Modals */}
      <AddProjectModal isOpen={showAddProject} onClose={() => setShowAddProject(false)} onAdd={handleAddProject} />

      <AddDocumentModal isOpen={showAddDocument} onClose={() => setShowAddDocument(false)} onAdd={handleAddDocument} />

      <AddModuleModal isOpen={showAddModule} onClose={() => setShowAddModule(false)} onAdd={handleAddModule} />

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-modal-header">
              <div className="warning-icon">!</div>
              <h2>Confirm Remove Document</h2>
            </div>
            <div className="confirm-modal-content">
              <p>Are you sure you want to remove this document named</p>
              <p className="document-name">{showConfirmDelete.name}?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmDelete(null)}>
                Cancel
              </button>
              <button className="btn-remove" onClick={() => handleDeleteDocument(showConfirmDelete.id)}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Scenario Modal */}
      {showAddScenario && (
        <div className="modal-overlay">
          <div className="add-scenario-modal">
            <h2>Add New Scenario</h2>
            <form onSubmit={handleAddScenario}>
              <div className="form-group">
                <label>Task ID</label>
                <input
                  type="text"
                  name="taskId"
                  placeholder="Enter Task ID"
                  value={scenarioForm.taskId}
                  onChange={handleScenarioFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sub Task ID</label>
                <input
                  type="text"
                  name="subTaskId"
                  placeholder="Enter Sub Task ID"
                  value={scenarioForm.subTaskId}
                  onChange={handleScenarioFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Test Scenario</label>
                <input
                  type="text"
                  name="testScenario"
                  placeholder="Enter Test Scenario"
                  value={scenarioForm.testScenario}
                  onChange={handleScenarioFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  value={scenarioForm.description}
                  onChange={handleScenarioFormChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddScenario(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Case Modal */}
      {showAddTestCase && (
        <div className="modal-overlay">
          <div className="add-scenario-modal">
            <h2>Add New Test Case</h2>
            <form onSubmit={handleAddTestCase}>
              <div className="form-group">
                <label>Test Case ID</label>
                <input
                  type="text"
                  name="id"
                  placeholder="Enter Test Case ID"
                  value={testCaseForm.id}
                  onChange={handleTestCaseFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter Description"
                  value={testCaseForm.description}
                  onChange={handleTestCaseFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Case Type</label>
                <select
                  name="caseType"
                  value={testCaseForm.caseType}
                  onChange={handleTestCaseFormChange}
                  required
                >
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddTestCase(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Test Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard



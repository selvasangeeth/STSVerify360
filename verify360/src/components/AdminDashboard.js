"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Search, Edit, Plus, MoreVertical, Trash } from "lucide-react"
import "./AdminDashboard.css"
import AddProjectModal from "./models/AddProjectModal"
import AddDocumentModal from "./models/AddDocumentModal"
import AddModuleModal from "./models/AddModuleModal"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeMenuItem, setActiveMenuItem] = useState("")
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
    if (selectedProject) {
      setActiveMenuItem(menuItem)
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

  return (
    <div className="admin-dashboard">
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
        <div className="user-profile">
          <div className="user-avatar">
            <img src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
          </div>
          <div className="user-info">
            <div className="user-name">SURYA PRABHU, T</div>
            <div className="user-role">JUNIOR QA TRAINEE</div>
          </div>
          <div className="logout-btn" onClick={handleLogout}>
            <span>Logout</span>
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
                  <Search size={16} />
                  <input type="text" placeholder="Search by Module Name / Module ID / Submodule Name / Submodule ID" />
                </div>

                <button className="add-module-btn" onClick={() => setShowAddModule(true)}>
                  <Plus size={16} />
                  <span>Add Module</span>
                </button>
              </div>
            </div>

            <div className="modules-section visible">
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
                          <div className="module-name">
                            {module.moduleName}
                            <span className="module-id">{module.moduleId}</span>
                          </div>
                        </td>
                        <td>
                          <div className="submodule-name">
                            {module.submoduleName}
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
    </div>
  )
}

export default AdminDashboard


"use client"

import { useState } from "react"
import "./Modal.css"

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
  const [projectName, setProjectName] = useState("")
  const [projectLogo, setProjectLogo] = useState(null)
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
    // ... other modules
  ])
  const [showAddModule, setShowAddModule] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name: projectName, logo: projectLogo })
    setProjectName("")
    setProjectLogo(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter the project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Project logo</label>
            <div className="file-input">
              <input type="file" onChange={(e) => setProjectLogo(e.target.files[0])} accept="image/*" />
              <span className="file-icon">📎</span>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProjectModal


"use client"

import { useState } from "react"
import "./Modal.css"
import { Plus } from "lucide-react"

const AddModuleModal = ({ isOpen, onClose, onAdd }) => {
  const [moduleName, setModuleName] = useState("")
  const [submoduleName, setSubmoduleName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Create new module object
    const newModule = {
      moduleName: moduleName,
      submoduleName: submoduleName
    }
    
    // Pass to parent component
    onAdd(newModule)
    
    // Reset form
    setModuleName("")
    setSubmoduleName("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Module</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Module Name</label>
            <input
              type="text"
              placeholder="Enter module name"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Submodule Name</label>
            <input
              type="text"
              placeholder="Enter submodule name"
              value={submoduleName}
              onChange={(e) => setSubmoduleName(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModuleModal


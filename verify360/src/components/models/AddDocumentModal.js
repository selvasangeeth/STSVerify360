"use client"

import { useState } from "react"
import "./Modal.css"

const AddDocumentModal = ({ isOpen, onClose, onAdd }) => {
  const [documentName, setDocumentName] = useState("")
  const [documentLink, setDocumentLink] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name: documentName, link: documentLink })
    setDocumentName("")
    setDocumentLink("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Document</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Enter the document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Enter Document Link</label>
            <input
              type="url"
              placeholder="Enter the document link"
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDocumentModal


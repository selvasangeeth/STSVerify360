"use client"

import { useState } from "react"
import "./Modal.css"

const AddDocumentModal = ({ isOpen, onClose, onAdd }) => {
  // Predefined document options
  const documentOptions = [
    {
      name: "Data Quality Standards",
      link: "https://coda.io/d/SPAN-Data-Quality-Standards_diggZGrWc8s/Index_sumNp#_luGLX"
    },
    {
      name: "Design Standards",
      link: "https://coda.io/d/SPAN-UI-UX-Quality-Standard_dGUnN9xQ9Qp/TaxBandits-UI-UX-Standards_suAF7?searchClick=d111e04a-59d7-4c1f-8230-8af8b84bf59c_GUnN9xQ9Qp#_luoIL"
    },
    {
      name: "Security Standards",
      link: "https://coda.io/d/SPAN-Security-Standards_dD0NPKTIL0j/SPAN-Security-Standards_supqB#_lu3Cv"
    }
  ];

  const [selectedDocument, setSelectedDocument] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const document = documentOptions.find(doc => doc.name === selectedDocument);
    if (document) {
      onAdd(document);
      setSelectedDocument("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Document</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Document</label>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              required
              className="document-select"
            >
              <option value="">Select a document</option>
              {documentOptions.map((doc) => (
                <option key={doc.name} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!selectedDocument}>
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal;


import React, { useState } from 'react';
import axios from './axios';
import './EditModuleModal.css';

const EditModuleModal = ({ module, onClose, onModuleUpdated }) => {
  const [moduleName, setModuleName] = useState(module.moduleName);
  const [subModule, setSubModule] = useState(module.subModule);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/updateModule/${module._id}`, {
        moduleName,
        subModule
      });
      if (response.data.msg === "Module Updated Success") {
        onModuleUpdated(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Module</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Module Name</label>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Submodule Name</label>
            <input
              type="text"
              value={subModule}
              onChange={(e) => setSubModule(e.target.value)}
              required
            />
          </div>
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModuleModal;
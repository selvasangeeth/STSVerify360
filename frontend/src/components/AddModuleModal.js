import React, { useState } from 'react';
import axios from './axios';
import './AddModuleModal.css';
import { toast } from "react-toastify";

const AddModuleModal = ({ projectId, onClose, onModuleAdded }) => {
  const [moduleData, setModuleData] = useState({
    moduleName: '',
    subModule: '',
    projectId: projectId
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const response = await axios.post('/createModule', {
        projectId,
        ...moduleData
      });

      if (response.data.msg === "Module Created Successfully") {
        // Call onModuleAdded with the new module data
        onModuleAdded(response.data.data);
        // Close the modal
        onClose();
        // Show single success message
        toast.success("Module created successfully!");
      } else {
        toast.error(response.data.message || "Failed to create module");
      }
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error(error.response?.data?.message || 'Error adding module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Module</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Module Name</label>
            <input
              type="text"
              value={moduleData.moduleName}
              onChange={(e) => setModuleData({
                ...moduleData,
                moduleName: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Submodule Name</label>
            <input
              type="text"
              value={moduleData.subModule}
              onChange={(e) => setModuleData({
                ...moduleData,
                subModule: e.target.value
              })}
              required
            />
          </div>
          <div className="modal-buttons">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="add-button"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;
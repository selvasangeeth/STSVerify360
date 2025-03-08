import React, { useState } from "react";
import "./AddTestCaseModal.css";

const AddTestCaseModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    testCaseId: "",
    testCaseDescription: "",
    testCaseType: "Positive",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.testCaseId || !formData.testCaseDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    onAdd(formData);
    setFormData({
      testCaseId: "",
      testCaseDescription: "",
      testCaseType: "Positive",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Test Case</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Test Case ID</label>
            <input
              type="text"
              name="testCaseId"
              placeholder="Enter Test Case ID"
              value={formData.testCaseId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="testCaseDescription"
              placeholder="Enter Description"
              value={formData.testCaseDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Case Type</label>
            <select
              name="testCaseType"
              value={formData.testCaseType}
              onChange={handleChange}
            >
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Add Test Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCaseModal;

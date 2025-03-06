import React from "react";
import "./AddProject.css"; // Add CSS file for styling

const AddProject = () => {
  return (
    <div className="add-project-container">
      <h2>Add a New Project</h2>
      <form>
        <label>Project Name:</label>
        <input type="text" placeholder="Enter project name" required />

        <label>Description:</label>
        <textarea placeholder="Enter project description" required></textarea>

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default AddProject;

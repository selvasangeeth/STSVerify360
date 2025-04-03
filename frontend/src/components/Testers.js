import React, { useState, useEffect } from "react";
import axios from "./axios"; // Import axios to make API requests
import './Testers.css'; // Import the CSS file

const Testers = ({ selectedProject }) => {
  const [testers, setTesters] = useState([]); // Store testers related to projectId
  const [searchTerm, setSearchTerm] = useState(""); // Store search term

  // Fetch testers when projectId is selected
  useEffect(() => {
    if (selectedProject && selectedProject.projectId) { // Ensure selectedProject is not null and contains projectId
      axios
        .get(`/testers/getTesters/${selectedProject.projectId}`) 
        .then((response) => setTesters(response.data))
        .catch((error) => console.error("Error fetching testers:", error));
    }
  }, [selectedProject]);

  // Filter testers based on search term
  const filteredTesters = testers.filter(tester =>
    tester.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tester.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTester = () => {
    // Implement add tester functionality here
    console.log("Add Tester button clicked");
  };

  return (
    <div className="testers-container">
      <div className="testers-header">
        <h3>Testers for {selectedProject ? selectedProject.projectName : "Project"}</h3>
        <button className="add-tester-button" onClick={handleAddTester}>Add Tester</button>
      </div>
      <input
        type="text"
        placeholder="Search By Tester ID / Tester Name / Tester Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <table className="testers-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Added Date & Time</th>
            <th>Position</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTesters.map((tester) => (
            <tr key={tester._id}>
              <td>{tester.userName}</td>
              <td>{tester.email}</td>
              <td>{new Date(tester.addedDate).toLocaleString()}</td>
              <td>{tester.position}</td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(tester._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const handleDelete = (id) => {
  // Implement delete functionality here
  console.log("Delete tester with id:", id);
};

export default Testers;
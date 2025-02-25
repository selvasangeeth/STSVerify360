import React from "react";
import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="user-container">
      <h1>Welcome, User!</h1>
      <img src="/user-dashboard.jpg" alt="User Dashboard" className="dashboard-image" />
    </div>
  );
};

export default UserDashboard;

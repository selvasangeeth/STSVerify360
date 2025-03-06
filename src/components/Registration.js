import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registration.css"; // Make sure the path to your CSS is correct

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registered Successfully!", formData);
    navigate("/"); // Updated to navigate back to the login page
  };

  return (
    <div className="register-container">
      <h2>Get Started with SPAN</h2>
      <form onSubmit={handleSubmit}>
        <label>Role</label>
        <input
          type="text"
          name="role"
          placeholder="Enter your role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="link" onClick={() => navigate("/")}> 
          Login Here
        </span>
      </p>
    </div>
  );
};

export default Registration;

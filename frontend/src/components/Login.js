import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from "./axios";
import './Login.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/login',
        {
          Email: formData.email,
          Password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.msg === "LoginSuccess" && response.data.user) {
        // Store user data in localStorage
       
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Get the last path from localStorage
        const lastPath = localStorage.getItem('lastPath');
        
        // Show success message
        toast.success("Login successful!");
        
        // Navigate to last path or dashboard after a short delay
        setTimeout(() => {
          if (lastPath && lastPath !== '/login') {
            localStorage.removeItem('lastPath'); // Clear the stored path
            navigate(lastPath);
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        toast.error(response.data.msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.msg || 'Error during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to QA Management Tool</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

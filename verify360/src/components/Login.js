import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Ensure email and password are trimmed (removes spaces)
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Debugging: Console log values to check
    console.log("Email:", trimmedEmail);
    console.log("Password:", trimmedPassword);

    // Hardcoded credentials for testing
    const adminEmail = "admin@test.com";
    const adminPassword = "admin123";
    const userEmail = "user@test.com";
    const userPassword = "user123";

    if (trimmedEmail === adminEmail && trimmedPassword === adminPassword) {
      navigate("/admin-dashboard");
    } else if (trimmedEmail === userEmail && trimmedPassword === userPassword) {
      navigate("/user-dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-container full-screen">
      <div className="left-section no-shadow">
        <img src="/logo.png" alt="SPAN Logo" className="logo" />
        <h1 className="tool-name">
          <span className="tool-span">SPAN</span>
          <br />
          <span className="tool-testing">TESTING</span>
          <br />
          <span className="tool-tool">TOOL</span>
        </h1>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2 className="welcome-text">Welcome Back</h2>
          <p className="sub-text">Sign in to continue your progress</p>
          <form onSubmit={handleLogin}>
            <label className="input-label">Email / Username</label>
            <input
              type="text"
              placeholder="Enter your email/username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field cement-color"
            />
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field cement-color"
            />
            <div className="options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <button type="submit" className="signin-btn">Sign In</button>
          </form>
          <p className="register-text">
            Don't have an account?{" "}
            <a href="/register" className="register-link">
              Register Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

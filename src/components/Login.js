import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure the path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const adminEmail = "admin@test.com";
    const adminPassword = "admin123";
    const userEmail = "user@test.com";
    const userPassword = "user123";

    if (trimmedEmail === adminEmail && trimmedPassword === adminPassword) {
      navigate("/admin-dashboard");
    } else if (trimmedEmail === userEmail && trimmedPassword === userPassword) {
      navigate("/user-dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="single-container"> {/* Unified single container */}
      <header className="header">
        <img src="/logo.png" alt="SPAN Logo" />
        <h1 className="main-heading">Unlock Seamless Testing</h1>
        <p className="sub-heading">Your All-in-One SPAN Testing Tool</p>
      </header>
      <form onSubmit={handleLogin} className="form-container">
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        <div className="input-group">
          <label className="input-label">Email / Username</label>
          <input
            type="text"
            placeholder="Enter your email/username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="options">
          <label className="remember-me">
            <input type="checkbox" /> Remember me
          </label>
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>
        <button type="submit" className="signin-btn">
          Sign In
        </button>
      </form>
      <p className="register-text">
        Don't have an account?
        <span className="register-link" onClick={() => navigate("/register")}>
          {" "}
          Register Here
        </span>
      </p>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import "../index.css";
import "./AuthScreen.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Check user role and redirect accordingly
        if (data.data.role === "admin") {
          // Store admin token and user data
          localStorage.setItem("adminToken", data.data.token);
          localStorage.setItem("adminUser", JSON.stringify(data.data));

          // Redirect to admin dashboard
          window.location.href = "/admin/dashboard";
        } else {
          // Store regular user token and user data
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data));

          // Redirect to home page instead of user dashboard
          window.location.href = "/";
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <FaLeaf size={48} className="auth-logo-icon" />
          <span className="auth-logo-text">ReWear</span>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="auth-title">Login</h1>
          {error && <div className="auth-error">{error}</div>}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="login-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

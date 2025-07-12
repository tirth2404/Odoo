import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {error && (
          <div style={{ color: "salmon", textAlign: "center" }}>{error}</div>
        )}
        <label htmlFor="name">Name</label>
        <input
          name="name"
          id="name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <label htmlFor="email">Email</label>
        <input
          name="email"
          id="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
        />
        <label htmlFor="location">Location</label>
        <input
          name="location"
          id="location"
          value={form.location}
          onChange={handleChange}
        />
        <label htmlFor="bio">Bio</label>
        <textarea
          name="bio"
          id="bio"
          value={form.bio}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

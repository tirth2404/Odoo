// Example React component
// ...existing code...
import React from "react";
import "../index.css";

export default function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h1>Login</h1>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="you@example.com" required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
        <p className="login-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "../../index.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    featuredItems: 0,
    totalSwaps: 0,
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3000/api/admin/dashboard", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>🎯 ReWear Admin Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Welcome back, Administrator
          </p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>👥 Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Registered community members
            </p>
          </div>
          
          <div className="stat-card">
            <h3>👕 Total Items</h3>
            <p className="stat-number">{stats.totalItems}</p>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Items in the marketplace
            </p>
          </div>
          
          <div className="stat-card">
            <h3>⏳ Pending Items</h3>
            <p className="stat-number pending">{stats.pendingItems}</p>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Awaiting approval
            </p>
          </div>
          
          <div className="stat-card">
            <h3>⭐ Featured Items</h3>
            <p className="stat-number">{stats.featuredItems}</p>
            <p style={{ margin: '10px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
              Highlighted items
            </p>
          </div>
        </div>

        <div className="admin-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => window.location.href = "/admin/items"}
              className="action-btn"
            >
              📋 Review Pending Items
            </button>
            <button 
              onClick={() => window.location.href = "/admin/users"}
              className="action-btn"
            >
              👥 Manage Users
            </button>
            <button 
              onClick={() => window.location.href = "/admin/featured"}
              className="action-btn"
            >
              ⭐ Manage Featured Items
            </button>
            <button 
              onClick={() => window.location.href = "/admin/analytics"}
              className="action-btn"
            >
              📊 View Analytics
            </button>
          </div>
        </div>

        <div className="category-stats">
          <h2>📊 Items by Category</h2>
          <div className="category-list">
            {stats.categoryStats.length > 0 ? (
              stats.categoryStats.map((category, index) => (
                <div key={index} className="category-item">
                  <span className="category-name">{category._id}</span>
                  <span className="category-count">{category.count}</span>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
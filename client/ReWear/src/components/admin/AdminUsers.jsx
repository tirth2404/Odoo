import React, { useState, useEffect } from "react";
import "../../index.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3000/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const handleBackToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Update user in the list
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
        alert(`✅ User ${newStatus} successfully!`);
      } else {
        alert("❌ " + (data.message || "Failed to update user status"));
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading users...
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <h1>👤 User Profile</h1>
            <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
              {selectedUser.name}
            </p>
          </div>
          <div className="header-actions">
            <button onClick={handleBack} className="back-btn">
              ← Back to Users
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="user-profile-card">
            <div className="user-profile-header">
              <div className="user-avatar">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h2>{selectedUser.name}</h2>
                <p className="user-email">{selectedUser.email}</p>
                <span className={`user-role ${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="user-details-grid">
              <div className="detail-item">
                <strong>📧 Email:</strong>
                <span>{selectedUser.email}</span>
              </div>
              <div className="detail-item">
                <strong>📅 Joined:</strong>
                <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <strong>💎 Points:</strong>
                <span>{selectedUser.points || 0}</span>
              </div>
              <div className="detail-item">
                <strong>📊 Status:</strong>
                <span className={`status-badge ${selectedUser.status || 'active'}`}>
                  {selectedUser.status || 'active'}
                </span>
              </div>
              <div className="detail-item">
                <strong>👕 Items Listed:</strong>
                <span>{selectedUser.itemsCount || 0}</span>
              </div>
              <div className="detail-item">
                <strong>🔄 Swaps Completed:</strong>
                <span>{selectedUser.swapsCount || 0}</span>
              </div>
            </div>

            <div className="user-actions">
              <button 
                onClick={() => handleToggleUserStatus(selectedUser._id, selectedUser.status)}
                className={`status-toggle-btn ${selectedUser.status === 'suspended' ? 'activate' : 'suspend'}`}
              >
                {selectedUser.status === 'suspended' ? '✅ Activate User' : '⏸️ Suspend User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>👥 Manage Users</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            {filteredUsers.length} users found
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleBackToDashboard} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="admin-content">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="users-grid">
          {filteredUsers.length === 0 ? (
            <div className="no-items">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h2>No Users Found</h2>
              <p>Try adjusting your search terms</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card" onClick={() => handleUserClick(user)}>
                <div className="user-card-header">
                  <div className="user-avatar-small">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-card-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                  <span className={`user-role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </div>
                <div className="user-card-details">
                  <div className="user-stats">
                    <span>💎 {user.points || 0} pts</span>
                    <span>👕 {user.itemsCount || 0} items</span>
                    <span>🔄 {user.swapsCount || 0} swaps</span>
                  </div>
                  <span className={`status-badge ${user.status || 'active'}`}>
                    {user.status || 'active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
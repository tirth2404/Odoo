import React, { useState, useEffect } from "react";
import "../../index.css";

export default function AdminItems() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3000/api/admin/items/pending", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setPendingItems(data.data);
      } else {
        setError(data.message || "Failed to load pending items");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:3000/api/admin/items/${itemId}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        // Remove item from pending list
        setPendingItems(prev => prev.filter(item => item._id !== itemId));
        alert("✅ Item approved successfully!");
      } else {
        alert("❌ " + (data.message || "Failed to approve item"));
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    }
  };

  const handleReject = async (itemId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:3000/api/admin/items/${itemId}/reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();

      if (data.success) {
        // Remove item from pending list
        setPendingItems(prev => prev.filter(item => item._id !== itemId));
        alert("✅ Item rejected successfully!");
      } else {
        alert("❌ " + (data.message || "Failed to reject item"));
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    }
  };

  const handleBack = () => {
    window.location.href = "/admin/dashboard";
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading pending items...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>📋 Pending Items Review</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            {pendingItems.length} items awaiting approval
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleBack} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="admin-content">
        {pendingItems.length === 0 ? (
          <div className="no-items">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
            <h2>No Pending Items</h2>
            <p>All items have been reviewed and processed!</p>
            <button 
              onClick={handleBack}
              className="action-btn"
              style={{ marginTop: '20px', maxWidth: '200px' }}
            >
              ← Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {pendingItems.map((item) => (
              <div key={item._id} className="item-card">
                <div className="item-header">
                  <h3>👕 {item.title}</h3>
                  <span className="item-category">{item.category}</span>
                </div>
                
                <div className="item-details">
                  <p><strong>📝 Description:</strong> {item.description}</p>
                  <p><strong>🏷️ Brand:</strong> {item.brand || 'N/A'}</p>
                  <p><strong>📏 Size:</strong> {item.size}</p>
                  <p><strong>✨ Condition:</strong> {item.condition}</p>
                  <p><strong>💎 Points Value:</strong> {item.pointsValue}</p>
                  <p><strong>👤 Owner:</strong> {item.owner?.name || 'Unknown'}</p>
                  <p><strong>📍 Location:</strong> {item.location || 'N/A'}</p>
                </div>

                <div className="item-actions">
                  <button 
                    onClick={() => handleApprove(item._id)}
                    className="approve-btn"
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(item._id)}
                    className="reject-btn"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
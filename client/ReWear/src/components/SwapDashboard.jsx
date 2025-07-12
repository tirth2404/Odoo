import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaClock, FaCheck, FaTimes, FaComments, FaPlus } from "react-icons/fa";
import "../index.css";

export default function SwapDashboard() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchSwaps();
    fetchSwapStats();
  }, []);

  const fetchSwaps = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:3000/api/swaps", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSwaps(data.data);
      } else {
        setError(data.message || "Failed to load swaps");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/swaps/stats", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.log("Failed to fetch swap stats");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaClock className="text-yellow-500" />;
      case "accepted": return <FaCheck className="text-green-500" />;
      case "completed": return <FaExchangeAlt className="text-blue-500" />;
      case "rejected": return <FaTimes className="text-red-500" />;
      case "cancelled": return <FaTimes className="text-gray-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSwaps = activeTab === "all" 
    ? swaps 
    : swaps.filter(swap => swap.status === activeTab);

  const handleBackToDashboard = () => {
    window.location.href = "/userDashboard";
  };

  const handleViewSwap = (swapId) => {
    window.location.href = `/swaps/${swapId}`;
  };

  if (loading) {
    return (
      <div className="swap-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading swaps...
        </div>
      </div>
    );
  }

  return (
    <div className="swap-container">
      <header className="swap-header">
        <div>
          <h1>🔄 Swap Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Manage your clothing exchanges
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleBackToDashboard} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="swap-content">
        {/* Swap Statistics */}
        <div className="swap-stats">
          <div className="stat-card">
            <h3>⏳ Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
          <div className="stat-card">
            <h3>✅ Accepted</h3>
            <p className="stat-number">{stats.accepted}</p>
          </div>
          <div className="stat-card">
            <h3>🔄 Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>❌ Rejected</h3>
            <p className="stat-number">{stats.rejected}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="swap-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Swaps ({swaps.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted ({stats.accepted})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Swaps List */}
        <div className="swaps-list">
          {filteredSwaps.length === 0 ? (
            <div className="no-swaps">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
              <h2>No Swaps Found</h2>
              <p>
                {activeTab === 'all' 
                  ? "You haven't participated in any swaps yet. Start by browsing items!"
                  : `No ${activeTab} swaps found.`
                }
              </p>
              {activeTab === 'all' && (
                <button 
                  onClick={() => window.location.href = '/browse'}
                  className="browse-btn"
                >
                  Browse Items
                </button>
              )}
            </div>
          ) : (
            filteredSwaps.map((swap) => (
              <div key={swap._id} className="swap-card" onClick={() => handleViewSwap(swap._id)}>
                <div className="swap-header-card">
                  <div className="swap-status">
                    {getStatusIcon(swap.status)}
                    <span className={`status-badge ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                  </div>
                  <div className="swap-date">
                    {new Date(swap.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="swap-items">
                  <div className="swap-item">
                    <div className="item-label">You're offering:</div>
                    <div className="item-details">
                      <h4>{swap.offeredItem?.title || 'Unknown Item'}</h4>
                      <p>{swap.offeredItem?.category || 'Unknown Category'}</p>
                      <span className="points-badge">💎 {swap.offeredItem?.pointsValue || 0} pts</span>
                    </div>
                  </div>

                  <div className="swap-arrow">⇄</div>

                  <div className="swap-item">
                    <div className="item-label">You're requesting:</div>
                    <div className="item-details">
                      <h4>{swap.requestedItem?.title || 'Unknown Item'}</h4>
                      <p>{swap.requestedItem?.category || 'Unknown Category'}</p>
                      <span className="points-badge">💎 {swap.requestedItem?.pointsValue || 0} pts</span>
                    </div>
                  </div>
                </div>

                <div className="swap-footer">
                  <div className="swap-users">
                    <span>With: {swap.recipient?.name || swap.requester?.name}</span>
                  </div>
                  <div className="swap-actions">
                    <span className="message-count">
                      <FaComments /> {swap.messages?.length || 0}
                    </span>
                    <button className="view-swap-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
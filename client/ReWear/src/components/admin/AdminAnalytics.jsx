import React, { useState, useEffect } from "react";
import "../../index.css";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("month");

  // Static analytics data
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      totalItems: 3421,
      totalSwaps: 1893,
      activeUsers: 892,
      newUsersThisMonth: 156,
      itemsListedThisMonth: 234,
      swapsThisMonth: 145,
      averageRating: 4.6
    },
    monthlyStats: {
      "January": { users: 120, items: 280, swaps: 150 },
      "February": { users: 145, items: 320, swaps: 180 },
      "March": { users: 180, items: 380, swaps: 220 },
      "April": { users: 200, items: 420, swaps: 250 },
      "May": { users: 220, items: 450, swaps: 280 },
      "June": { users: 240, items: 480, swaps: 300 },
      "July": { users: 260, items: 520, swaps: 320 },
      "August": { users: 280, items: 550, swaps: 340 },
      "September": { users: 300, items: 580, swaps: 360 },
      "October": { users: 320, items: 620, swaps: 380 },
      "November": { users: 340, items: 650, swaps: 400 },
      "December": { users: 360, items: 680, swaps: 420 }
    },
    categoryStats: [
      { category: "Men's Clothing", items: 1250, swaps: 680, percentage: 36.5 },
      { category: "Women's Clothing", items: 1450, swaps: 820, percentage: 42.4 },
      { category: "Kids", items: 320, swaps: 180, percentage: 9.4 },
      { category: "Accessories", items: 280, swaps: 150, percentage: 8.2 },
      { category: "Footwear", items: 220, swaps: 120, percentage: 6.4 },
      { category: "Outerwear", items: 180, swaps: 100, percentage: 5.2 }
    ],
    topUsers: [
      { name: "Sarah Johnson", items: 45, swaps: 32, points: 1250 },
      { name: "Mike Chen", items: 38, swaps: 28, points: 1100 },
      { name: "Emma Davis", items: 42, swaps: 25, points: 980 },
      { name: "Alex Rodriguez", items: 35, swaps: 22, points: 890 },
      { name: "Lisa Wang", items: 31, swaps: 20, points: 820 }
    ],
    recentActivity: [
      { type: "swap", user: "Sarah Johnson", action: "completed swap", item: "Blue Denim Jacket", time: "2 hours ago" },
      { type: "item", user: "Mike Chen", action: "listed new item", item: "Vintage T-Shirt", time: "4 hours ago" },
      { type: "user", user: "New User", action: "joined platform", item: "", time: "6 hours ago" },
      { type: "swap", user: "Emma Davis", action: "completed swap", item: "Leather Boots", time: "8 hours ago" },
      { type: "item", user: "Alex Rodriguez", action: "listed new item", item: "Summer Dress", time: "12 hours ago" }
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleBackToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "swap": return "🔄";
      case "item": return "👕";
      case "user": return "👤";
      default: return "📊";
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>📊 Analytics Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Platform insights and performance metrics
          </p>
        </div>
        <div className="header-actions">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button onClick={handleBackToDashboard} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="admin-content">
        {/* Overview Stats */}
        <div className="analytics-overview">
          <h2>📈 Platform Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <h3>👥 Total Users</h3>
              <p className="overview-number">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <p className="overview-change positive">+{analyticsData.overview.newUsersThisMonth} this month</p>
            </div>
            <div className="overview-card">
              <h3>👕 Total Items</h3>
              <p className="overview-number">{analyticsData.overview.totalItems.toLocaleString()}</p>
              <p className="overview-change positive">+{analyticsData.overview.itemsListedThisMonth} this month</p>
            </div>
            <div className="overview-card">
              <h3>🔄 Total Swaps</h3>
              <p className="overview-number">{analyticsData.overview.totalSwaps.toLocaleString()}</p>
              <p className="overview-change positive">+{analyticsData.overview.swapsThisMonth} this month</p>
            </div>
            <div className="overview-card">
              <h3>⭐ Average Rating</h3>
              <p className="overview-number">{analyticsData.overview.averageRating}</p>
              <p className="overview-change">Based on {analyticsData.overview.totalSwaps} swaps</p>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="analytics-section">
          <h2>📊 Category Performance</h2>
          <div className="category-performance">
            {analyticsData.categoryStats.map((category, index) => (
              <div key={index} className="category-performance-card">
                <div className="category-header">
                  <h3>{category.category}</h3>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
                <div className="category-stats">
                  <div className="stat-item">
                    <span className="stat-label">Items:</span>
                    <span className="stat-value">{category.items}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Swaps:</span>
                    <span className="stat-value">{category.swaps}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users and Recent Activity */}
        <div className="analytics-row">
          <div className="analytics-column">
            <h2>🏆 Top Users</h2>
            <div className="top-users-list">
              {analyticsData.topUsers.map((user, index) => (
                <div key={index} className="top-user-card">
                  <div className="user-rank">#{index + 1}</div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                    <div className="user-metrics">
                      <span>👕 {user.items} items</span>
                      <span>🔄 {user.swaps} swaps</span>
                      <span>💎 {user.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-column">
            <h2>⚡ Recent Activity</h2>
            <div className="activity-list">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{activity.user}</strong> {activity.action}
                      {activity.item && <span className="activity-item"> "{activity.item}"</span>}
                    </p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Growth Chart */}
        <div className="analytics-section">
          <h2>📈 Monthly Growth</h2>
          <div className="growth-chart">
            {Object.entries(analyticsData.monthlyStats).map(([month, data]) => (
              <div key={month} className="month-bar">
                <div className="bar-container">
                  <div 
                    className="bar users-bar" 
                    style={{ height: `${(data.users / 400) * 100}%` }}
                    title={`${data.users} users`}
                  ></div>
                  <div 
                    className="bar items-bar" 
                    style={{ height: `${(data.items / 700) * 100}%` }}
                    title={`${data.items} items`}
                  ></div>
                  <div 
                    className="bar swaps-bar" 
                    style={{ height: `${(data.swaps / 450) * 100}%` }}
                    title={`${data.swaps} swaps`}
                  ></div>
                </div>
                <span className="month-label">{month}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color users-color"></div>
              <span>Users</span>
            </div>
            <div className="legend-item">
              <div className="legend-color items-color"></div>
              <span>Items</span>
            </div>
            <div className="legend-item">
              <div className="legend-color swaps-color"></div>
              <span>Swaps</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
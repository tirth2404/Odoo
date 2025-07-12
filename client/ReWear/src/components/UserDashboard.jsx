import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import { 
  FaUserCircle, 
  FaTshirt, 
  FaExchangeAlt, 
  FaCoins, 
  FaShoppingBag, 
  FaChartLine, 
  FaBell, 
  FaPlus, 
  FaSearch, 
  FaHeart, 
  FaStar, 
  FaCalendarAlt,
  FaClock,
  FaSpinner,
  FaArrowLeft
} from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User data
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [swapStats, setSwapStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Get user info from localStorage (or fetch from API if needed)
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);

      // Fetch user's items
      const itemsResponse = await fetch(`${API_BASE_URL}/items/my-items`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const itemsData = await itemsResponse.json();
      if (itemsData.success) {
        setUserItems(itemsData.data);
      }

      // Fetch user's swaps
      const swapsResponse = await fetch(`${API_BASE_URL}/swaps`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const swapsData = await swapsResponse.json();
      if (swapsData.success) {
        setUserSwaps(swapsData.data);
      }

      // Fetch swap statistics
      const statsResponse = await fetch(`${API_BASE_URL}/swaps/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setSwapStats(statsData.data);
      }

    } catch (err) {
      setError("Failed to load user data");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);



  // Generate recent activity from real data
  const generateRecentActivity = () => {
    const activities = [];

    // Add recent swaps
    userSwaps.slice(0, 3).forEach(swap => {
      activities.push({
        id: swap._id,
        type: 'swap',
        title: `Swap: ${swap.requestedItem?.title || 'Unknown Item'}`,
        description: `Status: ${swap.status}`,
        time: new Date(swap.createdAt).toLocaleDateString(),
        points: swap.pointsExchange?.requesterPoints || 0
      });
    });

    // Add recent items
    userItems.slice(0, 2).forEach(item => {
      activities.push({
        id: item._id,
        type: 'listing',
        title: `Listed: ${item.title}`,
        description: `Status: ${item.status}`,
        time: new Date(item.createdAt).toLocaleDateString(),
        points: item.pointsValue || 0
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  };

  const recentActivity = generateRecentActivity();

  const quickActions = [
    { icon: FaPlus, label: 'Add Item', action: 'add' },
    { icon: FaSearch, label: 'Browse', action: 'browse' },
    { icon: FaExchangeAlt, label: 'My Swaps', action: 'swaps' },
    { icon: FaCoins, label: 'Redeem', action: 'redeem' }
  ];

  const renderOverview = () => (
    <div className={styles.overviewContent}>
      {/* Quick Actions */}
      <section className={styles.quickActionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <button 
              key={index} 
              className={styles.quickActionBtn}
              onClick={() => handleQuickAction(action.action)}
            >
              <action.icon className={styles.actionIcon} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.activitySection}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityList}>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {activity.type === 'swap' && <FaExchangeAlt />}
                  {activity.type === 'redeem' && <FaCoins />}
                  {activity.type === 'listing' && <FaTshirt />}
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityDescription}>{activity.description}</div>
                  <div className={styles.activityMeta}>
                    <FaClock className={styles.metaIcon} />
                    <span>{activity.time}</span>
                  </div>
                </div>
                <div className={`${styles.activityPoints} ${activity.points > 0 ? styles.positive : styles.negative}`}>
                  {activity.points > 0 ? '+' : ''}{activity.points} pts
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noActivity}>
              <p>No recent activity. Start by adding an item or browsing for swaps!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderCloset = () => (
    <div className={styles.closetContent}>
      <div className={styles.closetHeader}>
        <h2>My Closet</h2>
        <button 
          className={styles.addItemBtn}
          onClick={() => navigate('/add-item')}
        >
          <FaPlus /> Add New Item
        </button>
      </div>
      <div className={styles.closetGrid}>
        {userItems.length > 0 ? (
          userItems.map((item) => (
            <div className={styles.closetItem} key={item._id}>
              <div className={styles.itemImage}>
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].url} 
                    alt={item.title}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                ) : (
                  <FaTshirt size={40} color="#7ed957" />
                )}
              </div>
              <div className={styles.itemInfo}>
                <h3>{item.title}</h3>
                <p>{item.category} • Size {item.size}</p>
                <div className={styles.itemStatus}>
                  {item.status === 'available' ? 'Available for Swap' : 
                   item.status === 'pending' ? 'Pending Approval' :
                   item.status === 'swapped' ? 'Swapped' : item.status}
                </div>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.actionBtn}>Edit</button>
                <button className={styles.actionBtn}>View</button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noItems}>
            <p>No items in your closet yet. Add your first item!</p>
            <button 
              className={styles.addItemBtn}
              onClick={() => navigate('/add-item')}
            >
              <FaPlus /> Add Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className={styles.statsContent}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaChartLine className={styles.statIcon} />
            <h3>Monthly Progress</h3>
          </div>
          <div className={styles.statValue}>
            {userItems.length > 0 ? Math.min(85, Math.round((swapStats.completed / userItems.length) * 100)) : 0}%
          </div>
          <div className={styles.statLabel}>Sustainability Goal</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaExchangeAlt className={styles.statIcon} />
            <h3>Total Swaps</h3>
          </div>
          <div className={styles.statValue}>{swapStats.completed || 0}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaCoins className={styles.statIcon} />
            <h3>Points Earned</h3>
          </div>
          <div className={styles.statValue}>{user?.points || 0}</div>
          <div className={styles.statLabel}>Total Points</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaHeart className={styles.statIcon} />
            <h3>Active Items</h3>
          </div>
          <div className={styles.statValue}>
            {userItems.filter(item => item.status === 'available' || item.status === 'approved').length}
          </div>
          <div className={styles.statLabel}>Available for Swap</div>
        </div>
      </div>
    </div>
  );

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add':
        navigate('/add-item');
        break;
      case 'browse':
        navigate('/');
        break;
      case 'swaps':
        navigate('/swaps');
        break;
      case 'redeem':
        navigate('/');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <FaSpinner className={styles.spinner} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px' }}>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <p>Error: {error}</p>
          <button onClick={fetchUserData} style={{ marginLeft: '10px' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTop}>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              <FaArrowLeft /> Back
            </button>
            <h1 className={styles.title}>👤 ReWear Dashboard</h1>
          </div>
          <p className={styles.subtitle}>Sustainable Fashion Exchange Platform</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationBadge}>
            <FaBell className={styles.notificationIcon} />
            {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
          </div>
          <div className={styles.userInfo}>
            <FaUserCircle size={40} />
            <span>{user?.name || 'User'}</span>
          </div>
        </div>
      </header>

      {/* Profile Stats */}
      <section className={styles.profileSection}>
        <div className={styles.profilePic}>
          <FaUserCircle size={80} color="#fff" />
        </div>
        <div className={styles.profileStats}>
          <div className={styles.statBox}>
            <FaCoins className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{user?.points || 0}</div>
              <div className={styles.statLabel}>Total Points</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaExchangeAlt className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{swapStats.completed || 0}</div>
              <div className={styles.statLabel}>Total Swaps</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaTshirt className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>
                {userItems.filter(item => item.status === 'available' || item.status === 'approved').length}
              </div>
              <div className={styles.statLabel}>Active Listings</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaShoppingBag className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userItems.length}</div>
              <div className={styles.statLabel}>Total Items</div>
            </div>
          </div>
        </div>
        <div className={styles.profileDesc}>
          <h3>Welcome back, <span className={styles.userName}>{user?.name || 'User'}</span>!</h3>
          <p>Welcome to your sustainable fashion dashboard!</p>
          <div className={styles.memberSince}>
            <FaCalendarAlt className={styles.calendarIcon} />
            <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}</span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className={styles.tabNavigation}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'closet' ? styles.active : ''}`}
          onClick={() => setActiveTab('closet')}
        >
          My Closet
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'stats' ? styles.active : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </nav>

      {/* Tab Content */}
      <main className={styles.tabContent}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'closet' && renderCloset()}
        {activeTab === 'stats' && renderStats()}
      </main>
    </div>
  );
};

export default UserDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserDashboard.module.css";
import { 
  FaUserCircle, 
  FaTshirt, 
  FaExchangeAlt, 
  FaCoins, 
  FaShoppingBag, 
  FaLeaf, 
  FaChartLine, 
  FaBell, 
  FaPlus, 
  FaSearch, 
  FaHeart, 
  FaStar, 
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaRecycle,
  FaTree,
  FaWater,
  FaFire
} from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);

  const sustainabilityStats = {
    carbonSaved: 45.2,
    waterSaved: 1200,
    treesEquivalent: 2.3,
    itemsRecycled: 8
  };

  const recentActivity = [
    {
      id: 1,
      type: 'swap',
      title: 'Swapped Blue Jeans',
      description: 'Successfully exchanged with Sarah M.',
      time: '2 hours ago',
      points: 50
    },
    {
      id: 2,
      type: 'redeem',
      title: 'Redeemed Vintage Jacket',
      description: 'Used 200 points for leather jacket',
      time: '1 day ago',
      points: -200
    },
    {
      id: 3,
      type: 'listing',
      title: 'Listed Summer Dress',
      description: 'Added new item to your closet',
      time: '2 days ago',
      points: 25
    }
  ];

  const quickActions = [
    { icon: FaPlus, label: 'Add Item', action: 'add' },
    { icon: FaSearch, label: 'Browse', action: 'browse' },
    { icon: FaExchangeAlt, label: 'My Swaps', action: 'swaps' },
    { icon: FaCoins, label: 'Redeem', action: 'redeem' }
  ];

  const renderOverview = () => (
    <div className={styles.overviewContent}>
      {/* Sustainability Impact Section */}
      <section className={styles.sustainabilitySection}>
        <h2 className={styles.sectionTitle}>
          <FaLeaf className={styles.sectionIcon} />
          Your Sustainability Impact
        </h2>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <FaTree className={styles.impactIcon} />
            <div className={styles.impactValue}>{sustainabilityStats.carbonSaved}kg</div>
            <div className={styles.impactLabel}>CO₂ Saved</div>
          </div>
          <div className={styles.impactCard}>
            <FaWater className={styles.impactIcon} />
            <div className={styles.impactValue}>{sustainabilityStats.waterSaved}L</div>
            <div className={styles.impactLabel}>Water Saved</div>
          </div>
          <div className={styles.impactCard}>
            <FaRecycle className={styles.impactIcon} />
            <div className={styles.impactValue}>{sustainabilityStats.itemsRecycled}</div>
            <div className={styles.impactLabel}>Items Recycled</div>
          </div>
          <div className={styles.impactCard}>
            <FaFire className={styles.impactIcon} />
            <div className={styles.impactValue}>{sustainabilityStats.treesEquivalent}</div>
            <div className={styles.impactLabel}>Trees Equivalent</div>
          </div>
        </div>
      </section>

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
          {recentActivity.map((activity) => (
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
          ))}
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
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className={styles.closetItem} key={item}>
            <div className={styles.itemImage}>
              <FaTshirt size={40} color="#7ed957" />
            </div>
            <div className={styles.itemInfo}>
              <h3>Item {item}</h3>
              <p>Category • Size M</p>
              <div className={styles.itemStatus}>Available for Swap</div>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.actionBtn}>Edit</button>
              <button className={styles.actionBtn}>View</button>
            </div>
          </div>
        ))}
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
          <div className={styles.statValue}>85%</div>
          <div className={styles.statLabel}>Sustainability Goal</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaExchangeAlt className={styles.statIcon} />
            <h3>Total Swaps</h3>
          </div>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaCoins className={styles.statIcon} />
            <h3>Points Earned</h3>
          </div>
          <div className={styles.statValue}>450</div>
          <div className={styles.statLabel}>This Month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <FaHeart className={styles.statIcon} />
            <h3>Community Rating</h3>
          </div>
          <div className={styles.statValue}>4.8</div>
          <div className={styles.statLabel}>
            <FaStar className={styles.starIcon} />
            <FaStar className={styles.starIcon} />
            <FaStar className={styles.starIcon} />
            <FaStar className={styles.starIcon} />
            <FaStar className={styles.starIcon} />
          </div>
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
        navigate('/browse');
        break;
      case 'swaps':
        navigate('/swaps');
        break;
      case 'redeem':
        navigate('/redeem');
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>👤 ReWear Dashboard</h1>
          <p className={styles.subtitle}>Sustainable Fashion Exchange Platform</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.notificationBadge}>
            <FaBell className={styles.notificationIcon} />
            {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
          </div>
          <div className={styles.userInfo}>
            <FaUserCircle size={40} />
            <span>Jane Doe</span>
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
              <div className={styles.statNumber}>1,250</div>
              <div className={styles.statLabel}>Total Points</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaExchangeAlt className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>24</div>
              <div className={styles.statLabel}>Total Swaps</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaTshirt className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>8</div>
              <div className={styles.statLabel}>Active Listings</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <FaShoppingBag className={styles.statIcon} />
            <div className={styles.statContent}>
              <div className={styles.statNumber}>15</div>
              <div className={styles.statLabel}>Items Redeemed</div>
            </div>
          </div>
        </div>
        <div className={styles.profileDesc}>
          <h3>Welcome back, <span className={styles.userName}>Jane Doe</span>!</h3>
          <p>You've saved <strong>{sustainabilityStats.carbonSaved}kg of CO₂</strong> this month by choosing sustainable fashion.</p>
          <div className={styles.memberSince}>
            <FaCalendarAlt className={styles.calendarIcon} />
            <span>Member since March 2024</span>
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

import React, { useState, useEffect } from "react";
import "../../index.css";

export default function AdminFeatured() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    "all",
    "Men's Clothing",
    "Women's Clothing", 
    "Kids",
    "Accessories",
    "Footwear",
    "Outerwear"
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, categoryFilter, items]);

  const fetchItems = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }

      // Try to fetch from admin items endpoint first
      let response = await fetch("http://localhost:3000/api/admin/items", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      });

      // If admin endpoint doesn't exist, try the regular items endpoint
      if (!response.ok) {
        response = await fetch("http://localhost:3000/api/items", {
          headers: {
            "Authorization": `Bearer ${adminToken}`
          }
        });
      }

      const data = await response.json();

      if (data.success) {
        setItems(data.data);
      } else {
        // If API fails, use mock data for testing
        console.log("Using mock data for testing");
        const mockItems = [
          {
            _id: "1",
            title: "Blue Denim Jacket",
            description: "Classic blue denim jacket in excellent condition",
            category: "Men's Clothing",
            brand: "Levi's",
            size: "M",
            condition: "Excellent",
            pointsValue: 150,
            owner: { name: "John Doe" },
            location: "New York",
            createdAt: new Date().toISOString(),
            featured: false
          },
          {
            _id: "2",
            title: "Vintage T-Shirt",
            description: "Retro vintage t-shirt with unique design",
            category: "Men's Clothing",
            brand: "Nike",
            size: "L",
            condition: "Good",
            pointsValue: 80,
            owner: { name: "Mike Chen" },
            location: "Los Angeles",
            createdAt: new Date().toISOString(),
            featured: true
          },
          {
            _id: "3",
            title: "Summer Dress",
            description: "Beautiful summer dress perfect for warm weather",
            category: "Women's Clothing",
            brand: "Zara",
            size: "S",
            condition: "Excellent",
            pointsValue: 120,
            owner: { name: "Sarah Johnson" },
            location: "Chicago",
            createdAt: new Date().toISOString(),
            featured: false
          },
          {
            _id: "4",
            title: "Leather Boots",
            description: "High-quality leather boots for winter",
            category: "Footwear",
            brand: "Dr. Martens",
            size: "9",
            condition: "Good",
            pointsValue: 200,
            owner: { name: "Emma Davis" },
            location: "Boston",
            createdAt: new Date().toISOString(),
            featured: true
          },
          {
            _id: "5",
            title: "Kids Winter Coat",
            description: "Warm winter coat for children",
            category: "Kids",
            brand: "Gap Kids",
            size: "6-7",
            condition: "Excellent",
            pointsValue: 100,
            owner: { name: "Lisa Wang" },
            location: "Seattle",
            createdAt: new Date().toISOString(),
            featured: false
          },
          {
            _id: "6",
            title: "Designer Handbag",
            description: "Elegant designer handbag in great condition",
            category: "Accessories",
            brand: "Coach",
            size: "One Size",
            condition: "Excellent",
            pointsValue: 180,
            owner: { name: "Alex Rodriguez" },
            location: "Miami",
            createdAt: new Date().toISOString(),
            featured: false
          }
        ];
        setItems(mockItems);
      }
    } catch (err) {
      console.log("Network error, using mock data");
      // Use mock data if network fails
      const mockItems = [
        {
          _id: "1",
          title: "Blue Denim Jacket",
          description: "Classic blue denim jacket in excellent condition",
          category: "Men's Clothing",
          brand: "Levi's",
          size: "M",
          condition: "Excellent",
          pointsValue: 150,
          owner: { name: "John Doe" },
          location: "New York",
          createdAt: new Date().toISOString(),
          featured: false
        },
        {
          _id: "2",
          title: "Vintage T-Shirt",
          description: "Retro vintage t-shirt with unique design",
          category: "Men's Clothing",
          brand: "Nike",
          size: "L",
          condition: "Good",
          pointsValue: 80,
          owner: { name: "Mike Chen" },
          location: "Los Angeles",
          createdAt: new Date().toISOString(),
          featured: true
        },
        {
          _id: "3",
          title: "Summer Dress",
          description: "Beautiful summer dress perfect for warm weather",
          category: "Women's Clothing",
          brand: "Zara",
          size: "S",
          condition: "Excellent",
          pointsValue: 120,
          owner: { name: "Sarah Johnson" },
          location: "Chicago",
          createdAt: new Date().toISOString(),
          featured: false
        },
        {
          _id: "4",
          title: "Leather Boots",
          description: "High-quality leather boots for winter",
          category: "Footwear",
          brand: "Dr. Martens",
          size: "9",
          condition: "Good",
          pointsValue: 200,
          owner: { name: "Emma Davis" },
          location: "Boston",
          createdAt: new Date().toISOString(),
          featured: true
        },
        {
          _id: "5",
          title: "Kids Winter Coat",
          description: "Warm winter coat for children",
          category: "Kids",
          brand: "Gap Kids",
          size: "6-7",
          condition: "Excellent",
          pointsValue: 100,
          owner: { name: "Lisa Wang" },
          location: "Seattle",
          createdAt: new Date().toISOString(),
          featured: false
        },
        {
          _id: "6",
          title: "Designer Handbag",
          description: "Elegant designer handbag in great condition",
          category: "Accessories",
          brand: "Coach",
          size: "One Size",
          condition: "Excellent",
          pointsValue: 180,
          owner: { name: "Alex Rodriguez" },
          location: "Miami",
          createdAt: new Date().toISOString(),
          featured: false
        }
      ];
      setItems(mockItems);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleToggleFeatured = async (itemId, currentFeatured) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const newFeatured = !currentFeatured;
      
      // Try to update via API first
      try {
        const response = await fetch(`http://localhost:3000/api/admin/items/${itemId}/featured`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${adminToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ featured: newFeatured })
        });

        const data = await response.json();

        if (data.success) {
          // Update item in the list
          setItems(prev => prev.map(item => 
            item._id === itemId ? { ...item, featured: newFeatured } : item
          ));
          alert(`✅ Item ${newFeatured ? 'featured' : 'unfeatured'} successfully!`);
          return;
        }
      } catch (apiErr) {
        console.log("API not available, using local state update");
      }

      // If API fails or doesn't exist, update local state for demo
      setItems(prev => prev.map(item => 
        item._id === itemId ? { ...item, featured: newFeatured } : item
      ));
      alert(`✅ Item ${newFeatured ? 'featured' : 'unfeatured'} successfully! (Demo mode)`);
      
    } catch (err) {
      alert("❌ Error updating item. Please try again.");
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading items...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>⭐ Manage Featured Items</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            {filteredItems.length} items found
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
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search items by title, description, brand, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <div className="no-items">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <h2>No Items Found</h2>
              <p>Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className={`item-card ${item.featured ? 'featured-item' : ''}`}>
                <div className="item-header">
                  <h3>👕 {item.title}</h3>
                  <div className="item-badges">
                    <span className="item-category">{item.category}</span>
                    {item.featured && (
                      <span className="featured-badge">⭐ Featured</span>
                    )}
                  </div>
                </div>
                
                <div className="item-details">
                  <p><strong>📝 Description:</strong> {item.description}</p>
                  <p><strong>🏷️ Brand:</strong> {item.brand || 'N/A'}</p>
                  <p><strong>📏 Size:</strong> {item.size}</p>
                  <p><strong>✨ Condition:</strong> {item.condition}</p>
                  <p><strong>💎 Points Value:</strong> {item.pointsValue}</p>
                  <p><strong>👤 Owner:</strong> {item.owner?.name || 'Unknown'}</p>
                  <p><strong>📍 Location:</strong> {item.location || 'N/A'}</p>
                  <p><strong>📅 Listed:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="item-actions">
                  <button 
                    onClick={() => handleToggleFeatured(item._id, item.featured)}
                    className={`feature-toggle-btn ${item.featured ? 'unfeature' : 'feature'}`}
                  >
                    {item.featured ? '❌ Remove from Featured' : '⭐ Mark as Featured'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
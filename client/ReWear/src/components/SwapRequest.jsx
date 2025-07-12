import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaExchangeAlt, FaCoins, FaPaperPlane } from "react-icons/fa";
import "../index.css";

export default function SwapRequest() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [requestedItem, setRequestedItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [pointsAdjustment, setPointsAdjustment] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch requested item details
      const itemResponse = await fetch(`http://localhost:3000/api/items/${itemId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const itemData = await itemResponse.json();
      if (itemData.success) {
        setRequestedItem(itemData.data);
      } else {
        setError("Failed to load item details");
        return;
      }

      // Fetch user's items
      const userItemsResponse = await fetch("http://localhost:3000/api/items/my-items", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const userItemsData = await userItemsResponse.json();
      if (userItemsData.success) {
        setUserItems(userItemsData.data.filter(item => item.status === "approved" || item.status === "available"));
      }

      // Fetch user points
      const userResponse = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const userData = await userResponse.json();
      if (userData.success) {
        setUserPoints(userData.data.points || 0);
      }

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem) {
      alert("Please select an item to offer");
      return;
    }
    if (selectedItem._id === requestedItem._id) {
      alert("You cannot offer the same item you are requesting.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/swaps", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requestedItemId: itemId,
          offeredItemId: selectedItem._id,
          requesterNote: note,
          pointsExchange: {
            requesterPoints: Math.max(0, pointsAdjustment),
            recipientPoints: Math.max(0, -pointsAdjustment)
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/swaps"), 1500);
      } else {
        alert("Failed to send swap request: " + data.message);
      }
    } catch (err) {
      alert("Failed to send swap request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePointsDifference = () => {
    if (!selectedItem || !requestedItem) return 0;
    return (requestedItem.pointsValue || 0) - (selectedItem.pointsValue || 0);
  };

  const getPointsMessage = () => {
    const difference = calculatePointsDifference();
    if (difference > 0) {
      return `You'll need to pay ${difference} points extra`;
    } else if (difference < 0) {
      return `You'll receive ${Math.abs(difference)} points extra`;
    } else {
      return "Items are of equal value";
    }
  };

  if (loading) {
    return (
      <div className="swap-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading swap request form...
        </div>
      </div>
    );
  }

  if (error || !requestedItem) {
    return (
      <div className="swap-container">
        <div className="error-message">❌ {error || "Item not found"}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="swap-container">
        <div className="success-message">✅ Swap request sent successfully!</div>
      </div>
    );
  }

  return (
    <div className="swap-container">
      <header className="swap-header">
        <div>
          <h1>🔄 Request Swap</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Propose a clothing exchange
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </header>

      <div className="swap-content">
        {/* Requested Item */}
        <div className="requested-item-section">
          <h2>👕 Item You Want</h2>
          <div className="item-card">
            {requestedItem.images && requestedItem.images.length > 0 ? (
              <img
                src={`http://localhost:3000${requestedItem.images[0].url}`}
                alt={requestedItem.title}
                className="swap-item-image"
                style={{ maxWidth: 120, borderRadius: 8, marginBottom: 8 }}
              />
            ) : (
              <div className="swap-item-placeholder">No Image</div>
            )}
            <div className="item-header">
              <h3>{requestedItem.title}</h3>
              <span className="item-category">{requestedItem.category}</span>
            </div>
            <div className="item-details">
              <p><strong>Description:</strong> {requestedItem.description}</p>
              <p><strong>Brand:</strong> {requestedItem.brand || 'N/A'}</p>
              <p><strong>Size:</strong> {requestedItem.size}</p>
              <p><strong>Condition:</strong> {requestedItem.condition}</p>
              <p><strong>Points Value:</strong> 💎 {requestedItem.pointsValue}</p>
              <p><strong>Owner:</strong> {requestedItem.owner?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Item Selection */}
        <div className="item-selection-section">
          <h2>👕 Select Your Item to Offer</h2>
          {userItems.length === 0 ? (
            <div className="no-items">
              <p>You don't have any items available for swap.</p>
              <button onClick={() => navigate("/userDashboard")} className="add-item-btn">
                Add New Item
              </button>
            </div>
          ) : (
            <div className="user-items-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {userItems.map(item => (
                <div
                  key={item._id}
                  className={`user-item-card ${selectedItem && selectedItem._id === item._id ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    cursor: 'pointer',
                    border: selectedItem && selectedItem._id === item._id ? '2px solid #4f46e5' : '1px solid #ccc',
                    borderRadius: 8,
                    padding: 8,
                    margin: 4,
                    background: selectedItem && selectedItem._id === item._id ? '#f0f4ff' : '#fff',
                    minWidth: 120,
                    maxWidth: 160,
                    textAlign: 'center',
                  }}
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={`http://localhost:3000${item.images[0].url}`}
                      alt={item.title}
                      className="swap-item-image"
                      style={{ maxWidth: 80, borderRadius: 6, marginBottom: 4 }}
                    />
                  ) : (
                    <div className="swap-item-placeholder">No Image</div>
                  )}
                  <div><strong>{item.title}</strong></div>
                  <div>Points: {item.pointsValue}</div>
                  <div>Size: {item.size}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points Adjustment */}
        {selectedItem && (
          <div className="points-section" style={{ marginTop: 24 }}>
            <h2>💎 Points Adjustment</h2>
            <div style={{ marginBottom: 8 }}>{getPointsMessage()}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaCoins />
              <input
                type="number"
                value={pointsAdjustment}
                onChange={e => setPointsAdjustment(Number(e.target.value))}
                min={-userPoints}
                max={userPoints}
                style={{ width: 80, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
                disabled={submitting}
              />
              <span style={{ color: '#6c757d', fontSize: 12 }}>
                (You have {userPoints} points)
              </span>
            </div>
          </div>
        )}

        {/* Note Field */}
        <div className="note-section" style={{ marginTop: 24 }}>
          <h2>📝 Add a Note (optional)</h2>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc', padding: 8 }}
            placeholder="Add a message for the recipient..."
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button
            className="swap-submit-btn"
            onClick={handleSubmit}
            disabled={submitting || !selectedItem}
            style={{
              background: '#4f46e5',
              color: '#fff',
              padding: '12px 32px',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              cursor: submitting || !selectedItem ? 'not-allowed' : 'pointer',
              opacity: submitting || !selectedItem ? 0.6 : 1,
              boxShadow: '0 2px 8px rgba(79,70,229,0.08)'
            }}
          >
            {submitting ? 'Sending...' : <><FaPaperPlane style={{ marginRight: 8 }} /> Send Swap Request</>}
          </button>
        </div>
      </div>
    </div>
  );
} 
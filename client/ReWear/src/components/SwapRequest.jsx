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
        setUserItems(userItemsData.data.filter(item => item.status === "approved"));
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
        alert("Swap request sent successfully!");
        navigate("/swaps");
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
            <div className="items-grid">
              {userItems.map((item) => (
                <div 
                  key={item._id} 
                  className={`item-card ${selectedItem?._id === item._id ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-header">
                    <h3>{item.title}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  <div className="item-details">
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Brand:</strong> {item.brand || 'N/A'}</p>
                    <p><strong>Size:</strong> {item.size}</p>
                    <p><strong>Condition:</strong> {item.condition}</p>
                    <p><strong>Points Value:</strong> 💎 {item.pointsValue}</p>
                  </div>
                  {selectedItem?._id === item._id && (
                    <div className="selection-indicator">✅ Selected</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Points Exchange */}
        {selectedItem && (
          <div className="points-exchange-section">
            <h2>💰 Points Exchange</h2>
            <div className="points-breakdown">
              <div className="points-item">
                <span>Your item value:</span>
                <span className="points-value">💎 {selectedItem.pointsValue}</span>
              </div>
              <div className="points-item">
                <span>Requested item value:</span>
                <span className="points-value">💎 {requestedItem.pointsValue}</span>
              </div>
              <div className="points-difference">
                <span>Difference:</span>
                <span className={`points-value ${calculatePointsDifference() > 0 ? 'negative' : 'positive'}`}>
                  {calculatePointsDifference() > 0 ? '-' : '+'}💎 {Math.abs(calculatePointsDifference())}
                </span>
              </div>
            </div>
            <p className="points-message">{getPointsMessage()}</p>
            
            {calculatePointsDifference() > 0 && (
              <div className="points-adjustment">
                <label>Additional points to offer:</label>
                <input
                  type="number"
                  min="0"
                  max={userPoints}
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                  className="points-input"
                />
                <span className="points-available">Available: 💎 {userPoints}</span>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        <div className="note-section">
          <h2>📝 Add a Note (Optional)</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal message to the item owner..."
            maxLength={200}
            className="note-input"
          />
          <span className="char-count">{note.length}/200</span>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button 
            onClick={handleSubmit}
            disabled={!selectedItem || submitting}
            className="submit-btn"
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                Sending Request...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send Swap Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 
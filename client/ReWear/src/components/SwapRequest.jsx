import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaExchangeAlt, FaCoins, FaPaperPlane, FaTshirt, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./SwapRequest.module.css";

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
        // Filter items that are available for swap (either approved or available status)
        setUserItems(userItemsData.data.filter(item => 
          (item.status === "available" || item.status === "approved") && 
          item._id !== itemId // Don't allow swapping the same item
        ));
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUserPoints(userData.points || 0);

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
      <div className={styles.swapContainer}>
        <div className={styles.loading}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading swap request form...
        </div>
      </div>
    );
  }

  if (error || !requestedItem) {
    return (
      <div className={styles.swapContainer}>
        <div className={styles.errorMessage}>❌ {error || "Item not found"}</div>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.swapContainer}>
        <div className={styles.successMessage}>✅ Swap request sent successfully!</div>
      </div>
    );
  }

  return (
    <div className={styles.swapContainer}>
      <header className={styles.swapHeader}>
        <div className={styles.headerTitle}>
          <h1>🔄 Request Swap</h1>
          <p>Propose a clothing exchange</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </header>

      <div className={styles.swapContent}>
        {/* Requested Item */}
        <div className={styles.requestedItemSection}>
          <h2 className={styles.sectionTitle}>
            <FaTshirt /> Item You Want
          </h2>
          <div className={styles.itemCard}>
            {requestedItem.images && requestedItem.images.length > 0 ? (
              <img
                src={requestedItem.images[0].url}
                alt={requestedItem.title}
                className={styles.swapItemImage}
              />
            ) : (
              <div className={styles.swapItemPlaceholder}>No Image</div>
            )}
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{requestedItem.title}</h3>
              <span className={styles.itemCategory}>{requestedItem.category}</span>
            </div>
            <div className={styles.itemDetails}>
              <p><strong>Description:</strong> {requestedItem.description}</p>
              <p><strong>Brand:</strong> {requestedItem.brand || 'N/A'}</p>
              <p><strong>Size:</strong> {requestedItem.size}</p>
              <p><strong>Condition:</strong> {requestedItem.condition}</p>
              <p><strong>Points Value:</strong> 💎 {requestedItem.pointsValue}</p>
              <p><strong>Owner:</strong> <FaUser /> {requestedItem.owner?.name || 'Unknown'}</p>
              <p><strong>Location:</strong> <FaMapMarkerAlt /> {requestedItem.location || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Item Selection */}
        <div className={styles.itemSelectionSection}>
          <h2 className={styles.sectionTitle}>
            <FaTshirt /> Select Your Item to Offer
          </h2>
          {userItems.length === 0 ? (
            <div className={styles.noItems}>
              <p>You don't have any items available for swap.</p>
              <button onClick={() => navigate("/userDashboard")} className={styles.addItemBtn}>
                Add New Item
              </button>
            </div>
          ) : (
            <div className={styles.userItemsGrid}>
              {userItems.map(item => (
                <div
                  key={item._id}
                  className={`${styles.userItemCard} ${selectedItem && selectedItem._id === item._id ? styles.selected : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].url}
                      alt={item.title}
                    />
                  ) : (
                    <div className={styles.swapItemPlaceholder}>No Image</div>
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
          <div className={styles.pointsSection}>
            <h2 className={styles.sectionTitle}>
              <FaCoins /> Points Adjustment
            </h2>
            <div style={{ marginBottom: '1rem', color: '#d0d0d0' }}>{getPointsMessage()}</div>
            <div className={styles.pointsAdjustment}>
              <FaCoins />
              <input
                type="number"
                value={pointsAdjustment}
                onChange={e => setPointsAdjustment(Number(e.target.value))}
                min={-userPoints}
                max={userPoints}
                className={styles.pointsInput}
                disabled={submitting}
              />
              <span className={styles.pointsInfo}>
                (You have {userPoints} points)
              </span>
            </div>
          </div>
        )}

        {/* Note Field */}
        <div className={styles.noteSection}>
          <h2 className={styles.sectionTitle}>📝 Add a Note (optional)</h2>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            className={styles.noteTextarea}
            placeholder="Add a message for the recipient..."
            disabled={submitting}
          />
        </div>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button
            className={styles.swapSubmitBtn}
            onClick={handleSubmit}
            disabled={submitting || !selectedItem}
          >
            {submitting ? 'Sending...' : <><FaPaperPlane /> Send Swap Request</>}
          </button>
        </div>
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaExchangeAlt, FaClock, FaCheck, FaTimes, FaComments, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import "../index.css";

export default function SwapDetail() {
  const { swapId } = useParams();
  const navigate = useNavigate();
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSwapDetails();
  }, [swapId]);

  const fetchSwapDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/swaps/${swapId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setSwap(data.data);
      } else {
        setError(data.message || "Failed to load swap details");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/swaps/${swapId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: newMessage })
      });

      const data = await response.json();

      if (data.success) {
        setSwap(data.data);
        setNewMessage("");
      } else {
        alert("Failed to send message: " + data.message);
      }
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSwapAction = async (action, data = {}) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/swaps/${swapId}/${action}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setSwap(result.data);
        alert(`Swap ${action}ed successfully!`);
        if (action === 'complete') {
          navigate("/swaps");
        }
      } else {
        alert("Failed to " + action + " swap: " + result.message);
      }
    } catch (err) {
      alert("Failed to " + action + " swap. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const isCurrentUserRequester = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser && swap && swap.requester._id === currentUser._id;
  };

  const canAccept = () => {
    return !isCurrentUserRequester() && swap && swap.status === "pending";
  };

  const canComplete = () => {
    return swap && swap.status === "accepted";
  };

  const canCancel = () => {
    return swap && (swap.status === "pending" || swap.status === "accepted");
  };

  if (loading) {
    return (
      <div className="swap-container">
        <div className="loading">
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          Loading swap details...
        </div>
      </div>
    );
  }

  if (error || !swap) {
    return (
      <div className="swap-container">
        <div className="error-message">❌ {error || "Swap not found"}</div>
        <button onClick={() => navigate("/swaps")} className="back-btn">
          ← Back to Swaps
        </button>
      </div>
    );
  }

  return (
    <div className="swap-container">
      <header className="swap-header">
        <div>
          <h1>🔄 Swap Details</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)} • {new Date(swap.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/swaps")} className="back-btn">
            <FaArrowLeft /> Back to Swaps
          </button>
        </div>
      </header>

      <div className="swap-content">
        {/* Swap Status */}
        <div className="swap-status-section">
          <div className={`status-indicator ${swap.status}`}>
            {swap.status === "pending" && <FaClock />}
            {swap.status === "accepted" && <FaCheck />}
            {swap.status === "completed" && <FaExchangeAlt />}
            {swap.status === "rejected" && <FaTimes />}
            {swap.status === "cancelled" && <FaTimes />}
            <span>{swap.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Swap Items */}
        <div className="swap-items-section">
          <div className="swap-items-container">
            <div className="swap-item-card">
              <div className="item-header">
                <h3>👕 {isCurrentUserRequester() ? "You're offering:" : "They're offering:"}</h3>
              </div>
              <div className="item-content">
                <h4>{swap.offeredItem?.title || "Unknown Item"}</h4>
                <p className="item-category">{swap.offeredItem?.category || "Unknown Category"}</p>
                <p className="item-description">{swap.offeredItem?.description || "No description available"}</p>
                <div className="item-points">💎 {swap.offeredItem?.pointsValue || 0} points</div>
              </div>
            </div>

            <div className="swap-exchange-arrow">
              <FaExchangeAlt />
            </div>

            <div className="swap-item-card">
              <div className="item-header">
                <h3>👕 {isCurrentUserRequester() ? "You're requesting:" : "They're requesting:"}</h3>
              </div>
              <div className="item-content">
                <h4>{swap.requestedItem?.title || "Unknown Item"}</h4>
                <p className="item-category">{swap.requestedItem?.category || "Unknown Category"}</p>
                <p className="item-description">{swap.requestedItem?.description || "No description available"}</p>
                <div className="item-points">💎 {swap.requestedItem?.pointsValue || 0} points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Points Exchange */}
        {(swap.pointsExchange.requesterPoints > 0 || swap.pointsExchange.recipientPoints > 0) && (
          <div className="points-exchange-section">
            <h3>💰 Points Exchange</h3>
            <div className="points-breakdown">
              <div className="points-item">
                <span>{swap.requester.name} pays:</span>
                <span className="points-value">💎 {swap.pointsExchange.requesterPoints}</span>
              </div>
              <div className="points-item">
                <span>{swap.recipient.name} pays:</span>
                <span className="points-value">💎 {swap.pointsExchange.recipientPoints}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {(swap.requesterNote || swap.recipientNote) && (
          <div className="notes-section">
            {swap.requesterNote && (
              <div className="note">
                <h4>📝 {swap.requester.name}'s note:</h4>
                <p>{swap.requesterNote}</p>
              </div>
            )}
            {swap.recipientNote && (
              <div className="note">
                <h4>📝 {swap.recipient.name}'s note:</h4>
                <p>{swap.recipientNote}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="swap-actions-section">
          {canAccept() && (
            <div className="action-buttons">
              <button 
                onClick={() => {
                  const note = prompt("Add a note (optional):");
                  handleSwapAction("accept", { recipientNote: note });
                }}
                className="accept-btn"
                disabled={actionLoading}
              >
                ✅ Accept Swap
              </button>
              <button 
                onClick={() => {
                  const reason = prompt("Reason for rejection:");
                  handleSwapAction("reject", { reason });
                }}
                className="reject-btn"
                disabled={actionLoading}
              >
                ❌ Reject Swap
              </button>
            </div>
          )}

          {canComplete() && (
            <button 
              onClick={() => handleSwapAction("complete")}
              className="complete-btn"
              disabled={actionLoading}
            >
              🎉 Complete Swap
            </button>
          )}

          {canCancel() && (
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to cancel this swap?")) {
                  handleSwapAction("cancel");
                }
              }}
              className="cancel-btn"
              disabled={actionLoading}
            >
              🚫 Cancel Swap
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="messages-section">
          <h3>💬 Messages ({swap.messages?.length || 0})</h3>
          
          <div className="messages-list">
            {swap.messages && swap.messages.length > 0 ? (
              swap.messages.map((message, index) => (
                <div key={index} className={`message ${message.sender._id === JSON.parse(localStorage.getItem("user"))?._id ? 'own' : 'other'}`}>
                  <div className="message-header">
                    <span className="message-sender">{message.sender.name}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))
            ) : (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {swap.status !== "completed" && swap.status !== "cancelled" && (
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={sendingMessage}
              />
              <button 
                onClick={sendMessage}
                disabled={sendingMessage || !newMessage.trim()}
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
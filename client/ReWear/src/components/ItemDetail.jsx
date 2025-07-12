import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ItemDetail.module.css";
import {
  FaArrowLeft,
  FaTshirt,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaHeart,
  FaExchangeAlt,
  FaSpinner,
  FaStar,
  FaEye,
  FaCalendarAlt,
  FaTag,
  FaRuler,
  FaPalette
} from "react-icons/fa";

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const API_BASE_URL = 'http://localhost:3000/api';

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/items/${itemId}`);
      const data = await response.json();

      if (data.success) {
        setItem(data.data);
      } else {
        setError(data.message || 'Failed to fetch item details');
      }
    } catch (err) {
      setError('Network error while fetching item details');
      console.error('Error fetching item details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/swap-request/${itemId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const nextImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? item.images.length - 1 : prev - 1
      );
    }
  };

  const getItemEmoji = (category) => {
    const emojiMap = {
      "men's clothing": "👔",
      "women's clothing": "👗",
      "kids": "👶",
      "accessories": "👜",
      "footwear": "👟",
      "outerwear": "🧥"
    };
    return emojiMap[category?.toLowerCase()] || "👕";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={fetchItemDetails} className={styles.retryBtn}>
            Retry
          </button>
          <button onClick={handleBack} className={styles.backBtn}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Item not found</p>
          <button onClick={handleBack} className={styles.backBtn}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h1 className={styles.pageTitle}>Item Details</h1>
      </header>

      <div className={styles.content}>
        {/* Image Gallery */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            {item.images && item.images.length > 0 ? (
              <>
                <img 
                  src={item.images[currentImageIndex].url} 
                  alt={item.title}
                  className={styles.mainImage}
                />
                {item.images.length > 1 && (
                  <>
                    <button className={styles.imageNavBtn} onClick={prevImage}>
                      ‹
                    </button>
                    <button className={styles.imageNavBtn} onClick={nextImage}>
                      ›
                    </button>
                    <div className={styles.imageCounter}>
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={styles.noImage}>
                <span className={styles.itemEmoji}>{getItemEmoji(item.category)}</span>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {item.images && item.images.length > 1 && (
            <div className={styles.thumbnailGallery}>
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${item.title} ${index + 1}`}
                  className={`${styles.thumbnail} ${currentImageIndex === index ? styles.activeThumbnail : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Item Information */}
        <div className={styles.infoSection}>
          <div className={styles.itemHeader}>
            <h2 className={styles.itemTitle}>{item.title}</h2>
            <div className={styles.itemBadge}>
              <FaTshirt />
              {item.category}
            </div>
          </div>

          <div className={styles.itemStats}>
            <div className={styles.statItem}>
              <FaEye />
              <span>{item.views || 0} views</span>
            </div>
            <div className={styles.statItem}>
              <FaHeart />
              <span>{item.likes?.length || 0} likes</span>
            </div>
            <div className={styles.statItem}>
              <FaStar />
              <span>{item.pointsValue} points</span>
            </div>
          </div>

          <div className={styles.itemDescription}>
            <h3>Description</h3>
            <p>{item.description || 'No description available.'}</p>
          </div>

          <div className={styles.itemDetails}>
            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <FaTag />
                <span>Condition: {item.condition}</span>
              </div>
              <div className={styles.detailItem}>
                <FaRuler />
                <span>Size: {item.size}</span>
              </div>
            </div>
            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <FaPalette />
                <span>Color: {item.color || 'Not specified'}</span>
              </div>
              <div className={styles.detailItem}>
                <FaMapMarkerAlt />
                <span>Location: {item.location}</span>
              </div>
            </div>
          </div>

          <div className={styles.ownerInfo}>
            <h3>Owner Information</h3>
            <div className={styles.ownerCard}>
              <div className={styles.ownerAvatar}>
                <FaUser />
              </div>
              <div className={styles.ownerDetails}>
                <h4>{item.owner?.name || 'Anonymous'}</h4>
                <p>Member since {item.owner?.createdAt ? new Date(item.owner.createdAt).toLocaleDateString() : 'recently'}</p>
              </div>
            </div>
          </div>

          <div className={styles.itemMeta}>
            <div className={styles.metaItem}>
              <FaCalendarAlt />
              <span>Listed on {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.metaItem}>
              <FaClock />
              <span>Last updated {new Date(item.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.swapRequestBtn} onClick={handleSwapRequest}>
              <FaExchangeAlt />
              Request Swap
            </button>
            <button className={styles.favoriteBtn}>
              <FaHeart />
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 
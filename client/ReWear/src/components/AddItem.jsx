import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaTrash, FaPlus } from "react-icons/fa";
import "../index.css";

export default function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    type: "",
    size: "",
    condition: "",
    brand: "",
    color: "",
    material: "",
    season: "",
    pointsValue: "",
    location: "",
    tags: []
  });
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "men's clothing",
    "women's clothing", 
    "kids",
    "accessories",
    "footwear",
    "outerwear"
  ];

  const types = ["casual", "formal", "sportswear", "vintage", "designer", "other"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "Other"];
  const conditions = ["new", "like-new", "good", "fair", "poor"];
  const seasons = ["spring", "summer", "fall", "winter", "all-season"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      imageFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      const response = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        alert("Item added successfully! It will be reviewed by admin.");
        navigate("/userDashboard");
      } else {
        setError(data.message || "Failed to add item");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.category &&
      formData.type &&
      formData.size &&
      formData.condition &&
      formData.pointsValue &&
      images.length > 0
    );
  };

  return (
    <div className="add-item-container">
      <header className="add-item-header">
        <div>
          <h1>👕 Add New Item</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '16px' }}>
            Share your clothing with the community
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/userDashboard")} className="back-btn">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </header>

      {error && <div className="error-message">❌ {error}</div>}

      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h2>📝 Basic Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Item Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Denim Jacket"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item in detail..."
                  maxLength={500}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory</label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="e.g., Jeans, Dresses, etc."
                />
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="form-section">
            <h2>🔍 Item Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="size">Size *</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="condition">Condition *</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Nike, Levi's"
                />
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Blue, Black, Red"
                />
              </div>

              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Cotton, Denim, Polyester"
                />
              </div>

              <div className="form-group">
                <label htmlFor="season">Season</label>
                <select
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                >
                  <option value="">Select Season</option>
                  {seasons.map(season => (
                    <option key={season} value={season}>
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Points & Tags */}
          <div className="form-section">
            <h2>💰 Points & Tags</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pointsValue">Points Value *</label>
                <input
                  type="number"
                  id="pointsValue"
                  name="pointsValue"
                  value={formData.pointsValue}
                  onChange={handleInputChange}
                  placeholder="10-1000"
                  min="10"
                  max="1000"
                  required
                />
                <small>Points value between 10-1000</small>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag and press Enter"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag} className="add-tag-btn">
                    <FaPlus />
                  </button>
                </div>
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="remove-tag-btn"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="form-section">
            <h2>📸 Photos</h2>
            <div className="photo-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageUpload" className="upload-label">
                  <FaUpload className="upload-icon" />
                  <span>Click to upload photos</span>
                  <small>Maximum 5 images, 5MB each</small>
                </label>
              </div>

              {images.length > 0 && (
                <div className="image-preview">
                  <h3>Uploaded Images ({images.length}/5)</h3>
                  <div className="image-grid">
                    {images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="submit-btn"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Adding Item...
              </>
            ) : (
              <>
                <FaPlus />
                Add Item
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
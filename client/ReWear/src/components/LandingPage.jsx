import React, { useState, useEffect, useRef } from "react";
import styles from "./LandingPage.module.css";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaSearch,
  FaHome,
  FaTshirt,
  FaExchangeAlt,
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaRecycle,
  FaTree,
  FaWater,
  FaSpinner,
} from "react-icons/fa";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  // API data states
  const [featuredItems, setFeaturedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    featured: true,
    products: true,
    categories: true
  });
  const [error, setError] = useState({
    featured: null,
    products: null,
    categories: null
  });

  // Refs for sections
  const categoriesSectionRef = useRef(null);
  const productsSectionRef = useRef(null);
  const carouselSectionRef = useRef(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch featured items
  const fetchFeaturedItems = async () => {
    try {
      setLoading(prev => ({ ...prev, featured: true }));
      setError(prev => ({ ...prev, featured: null }));
      
      const response = await fetch(`${API_BASE_URL}/items/featured`);
      const data = await response.json();
      
      if (data.success) {
        setFeaturedItems(data.data);
      } else {
        setError(prev => ({ ...prev, featured: data.message || 'Failed to fetch featured items' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, featured: 'Network error while fetching featured items' }));
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError(prev => ({ ...prev, products: null }));
      
      const response = await fetch(`${API_BASE_URL}/items?limit=20&sort=newest`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(prev => ({ ...prev, products: data.message || 'Failed to fetch products' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, products: 'Network error while fetching products' }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      setError(prev => ({ ...prev, categories: null }));
      
      const response = await fetch(`${API_BASE_URL}/items/categories`);
      const data = await response.json();
      
      if (data.success) {
        // Transform categories to match the expected format
        const transformedCategories = data.data.map((category, index) => ({
          id: index + 1,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          icon: getCategoryIcon(category),
          count: `${Math.floor(Math.random() * 5) + 1}K items` // Mock count for now
        }));
        setCategories(transformedCategories);
      } else {
        setError(prev => ({ ...prev, categories: data.message || 'Failed to fetch categories' }));
      }
    } catch (err) {
      setError(prev => ({ ...prev, categories: 'Network error while fetching categories' }));
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Get category icon based on category name
  const getCategoryIcon = (category) => {
    const iconMap = {
      "men's clothing": "👔",
      "women's clothing": "👗",
      "kids": "👶",
      "accessories": "👜",
      "footwear": "👟",
      "outerwear": "🧥"
    };
    return iconMap[category.toLowerCase()] || "👕";
  };

  // Get item emoji based on category
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

  // Load data on component mount
  useEffect(() => {
    fetchFeaturedItems();
    fetchProducts();
    fetchCategories();
  }, []);

  // Testimonials (keeping static for now)
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      quote:
        "ReWear has completely changed how I think about fashion. I've saved money and the planet!",
      rating: 5,
      avatar: "👩‍🦰",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Environmental Advocate",
      quote:
        "Finally, a platform that makes sustainable fashion accessible and fun for everyone.",
      rating: 5,
      avatar: "👨‍🦱",
    },
  ];

  // Smooth scroll to section
  const scrollToSection = (sectionRef, offset = 100) => {
    if (sectionRef.current) {
      const elementPosition = sectionRef.current.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Filter products based on active filter
  const getFilteredProducts = () => {
    if (activeFilter === "All") return products;

    return products.filter((product) => {
      switch (activeFilter) {
        case "Trending":
          return featuredItems.some((item) => item._id === product._id);
        case "New":
          return (
            product.condition === "Like New" ||
            product.condition === "Excellent"
          );
        case "Popular":
          return product.pointsValue > 150;
        default:
          return product.category === activeFilter;
      }
    });
  };

  // Search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();

      // Search in products
      const productResults = products.filter(
        (product) =>
          product.title?.toLowerCase().includes(lowerQuery) ||
          product.category?.toLowerCase().includes(lowerQuery) ||
          product.condition?.toLowerCase().includes(lowerQuery) ||
          product.location?.toLowerCase().includes(lowerQuery)
      );

      // Search in categories
      const categoryResults = categories.filter((category) =>
        category.name.toLowerCase().includes(lowerQuery)
      );

      // Search in featured items
      const featuredResults = featuredItems.filter(
        (item) =>
          item.title?.toLowerCase().includes(lowerQuery) ||
          item.category?.toLowerCase().includes(lowerQuery) ||
          item.location?.toLowerCase().includes(lowerQuery)
      );

      const allResults = [
        ...productResults.map((item) => ({ ...item, type: "product" })),
        ...categoryResults.map((item) => ({ ...item, type: "category" })),
        ...featuredResults.map((item) => ({ ...item, type: "featured" })),
      ];

      setSearchResults(allResults);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      console.log("Searching for:", searchQuery);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    console.log("Selected result:", result);
    setSearchQuery(result.title || result.name);
    setShowSearchResults(false);

    // Navigate to appropriate section based on result type
    if (result.type === "category") {
      // Scroll to categories section and highlight the category
      scrollToSection(categoriesSectionRef);
      // You could add additional logic to highlight the specific category
    } else if (result.type === "product") {
      // Scroll to products section and filter by category if applicable
      scrollToSection(productsSectionRef);
      if (result.category) {
        setActiveFilter(result.category);
      }
    } else if (result.type === "featured") {
      // Scroll to carousel section
      scrollToSection(carouselSectionRef);
    }

    // Add a visual feedback
    setTimeout(() => {
      // You could add a highlight effect here
      console.log(`Navigated to ${result.type} section for: ${result.title || result.name}`);
    }, 500);
  };

  // Handle filter button clicks
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchContainer}`)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (featuredItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [featuredItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredItems.length) % featuredItems.length
    );
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className={styles.landingPage}>
      {/* Header Navigation */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>
              <FaLeaf className={styles.logoIcon} />
              <span className={styles.logoText}>ReWear</span>
            </div>

            <nav className={styles.navigation}>
              <a href="#home" className={styles.navLink}>
                <FaHome className={styles.navIcon} />
                Home
              </a>
              <a href="#browse" className={styles.navLink}>
                <FaTshirt className={styles.navIcon} />
                Browse
              </a>
            </nav>
          </div>

          <div className={styles.headerCenter}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchContainer}>
                <div className={styles.searchBar}>
                  <FaSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search for items, categories, or locations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                  />
                  {isSearching && <div className={styles.searchSpinner}></div>}
                </div>

                {showSearchResults && (
                  <div className={styles.searchResults}>
                    {searchResults.length > 0 ? (
                      <>
                        <div className={styles.searchResultsHeader}>
                          <span>Search Results ({searchResults.length})</span>
                        </div>
                        {searchResults.slice(0, 8).map((result, index) => (
                          <div
                            key={`${result.type}-${result._id || result.id}-${index}`}
                            className={styles.searchResultItem}
                            onClick={() => handleSearchResultClick(result)}
                          >
                            <div className={styles.searchResultIcon}>
                              {result.type === "product" && <FaTshirt />}
                              {result.type === "category" && <FaLeaf />}
                              {result.type === "featured" && <FaStar />}
                            </div>
                            <div className={styles.searchResultContent}>
                              <div className={styles.searchResultName}>
                                {result.title || result.name}
                              </div>
                              <div className={styles.searchResultMeta}>
                                {result.type === "product" && (
                                  <>
                                    <span>{result.condition}</span>
                                    <span>{result.pointsValue} pts</span>
                                    <span>{result.location}</span>
                                  </>
                                )}
                                {result.type === "category" && (
                                  <span>{result.count}</span>
                                )}
                                {result.type === "featured" && (
                                  <>
                                    <span>{result.category}</span>
                                    <span>{result.pointsValue} pts</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {searchResults.length > 8 && (
                          <div className={styles.searchResultsFooter}>
                            <span>View all {searchResults.length} results</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className={styles.noResults}>
                        <span>No results found for "{searchQuery}"</span>
                        <span>Try different keywords or browse categories</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className={styles.headerRight}>
            <Link to="/login" className={styles.authLink}>
              Login
            </Link>
            <Link
              to="/register"
              className={`${styles.authLink} ${styles.signupBtn}`}
            >
              Sign Up
            </Link>
            <button className={styles.profileBtn}>
              <FaUserCircle size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Sustainable Fashion for a Better Tomorrow
            </h1>
            <p className={styles.heroSubtitle}>
              Join thousands of fashion-conscious individuals making sustainable
              choices. Swap, share, and save the planet one outfit at a time.
            </p>
            <div className={styles.heroButtons}>
              <button className={`${styles.heroBtn} ${styles.primaryBtn}`}>
                <FaExchangeAlt className={styles.btnIcon} />
                Start Swapping
              </button>
              <button className={`${styles.heroBtn} ${styles.secondaryBtn}`}>
                <FaTshirt className={styles.btnIcon} />
                Browse Items
              </button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImage}>
              <div className={styles.floatingItems}>
                <span className={styles.floatingItem}>👕</span>
                <span className={styles.floatingItem}>👗</span>
                <span className={styles.floatingItem}>👟</span>
                <span className={styles.floatingItem}>👜</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section ref={carouselSectionRef} className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Items</h2>
          <div className={styles.carouselControls}>
            <button className={styles.carouselBtn} onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <button className={styles.carouselBtn} onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {loading.featured ? (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.spinner} />
            <p>Loading featured items...</p>
          </div>
        ) : error.featured ? (
          <div className={styles.errorContainer}>
            <p>Error: {error.featured}</p>
            <button onClick={fetchFeaturedItems} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        ) : featuredItems.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>No featured items available</p>
          </div>
        ) : (
          <div className={styles.carouselContainer}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredItems.map((item, index) => (
                <div key={item._id} className={styles.carouselItem}>
                  <div className={styles.featuredCard}>
                    <div className={styles.itemImage}>
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={`http://localhost:3000${item.images[0].url}`} 
                          alt={item.title}
                          className={styles.itemImage}
                        />
                      ) : (
                        <span className={styles.itemEmoji}>
                          {getItemEmoji(item.category)}
                        </span>
                      )}
                      <div className={styles.itemBadge}>
                        <span className={styles.featuredBadge}>
                          ⭐ Featured
                        </span>
                      </div>
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.title}</h3>
                      <p className={styles.itemCategory}>{item.category}</p>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemSize}>Size: {item.size}</span>
                        <span className={styles.itemCondition}>
                          {item.condition}
                        </span>
                      </div>
                      <div className={styles.itemMeta}>
                        <span className={styles.itemPoints}>
                          {item.pointsValue} pts
                        </span>
                        <span className={styles.itemLocation}>
                          <FaMapMarkerAlt className={styles.locationIcon} />
                          {item.location}
                        </span>
                      </div>
                      <button className={styles.swapBtn}>Request Swap</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {featuredItems.length > 0 && (
          <div className={styles.carouselDots}>
            {featuredItems.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.activeDot : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section ref={categoriesSectionRef} className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse Categories</h2>
        </div>

        {loading.categories ? (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.spinner} />
            <p>Loading categories...</p>
          </div>
        ) : error.categories ? (
          <div className={styles.errorContainer}>
            <p>Error: {error.categories}</p>
            <button onClick={fetchCategories} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        ) : (
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <span className={styles.categoryEmoji}>{category.icon}</span>
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryCount}>{category.count}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Listings */}
      <section ref={productsSectionRef} className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Available Items</h2>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${
                activeFilter === "All" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("All")}
            >
              All
            </button>
            <button
              className={`${styles.filterBtn} ${
                activeFilter === "Trending" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("Trending")}
            >
              Trending
            </button>
            <button
              className={`${styles.filterBtn} ${
                activeFilter === "New" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("New")}
            >
              New
            </button>
            <button
              className={`${styles.filterBtn} ${
                activeFilter === "Popular" ? styles.active : ""
              }`}
              onClick={() => handleFilterClick("Popular")}
            >
              Popular
            </button>
          </div>
        </div>

        {loading.products ? (
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.spinner} />
            <p>Loading products...</p>
          </div>
        ) : error.products ? (
          <div className={styles.errorContainer}>
            <p>Error: {error.products}</p>
            <button onClick={fetchProducts} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>No products available</p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`http://localhost:3000${product.images[0].url}`} 
                      alt={product.title}
                      className={styles.productImage}
                    />
                  ) : (
                    <span className={styles.productEmoji}>
                      {getItemEmoji(product.category)}
                    </span>
                  )}
                  <button className={styles.favoriteBtn}>
                    <FaHeart className={styles.heartIcon} />
                  </button>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.title}</h3>
                  <div className={styles.productDetails}>
                    <span className={styles.productSize}>
                      Size: {product.size}
                    </span>
                    <span className={styles.productCondition}>
                      {product.condition}
                    </span>
                  </div>
                  <div className={styles.productMeta}>
                    <span className={styles.productPoints}>
                      {product.pointsValue} pts
                    </span>
                    <span className={styles.productLocation}>
                      <FaMapMarkerAlt className={styles.locationIcon} />
                      {product.location}
                    </span>
                  </div>
                  <div className={styles.productActions}>
                    <button className={styles.viewBtn}>View Details</button>
                    <button className={styles.swapRequestBtn}>
                      Request Swap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials & Impact Metrics */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Community Impact</h2>
        </div>

        <div className={styles.testimonialsContent}>
          <div className={styles.impactMetrics}>
            <div className={styles.metricCard}>
              <FaRecycle className={styles.metricIcon} />
              <div className={styles.metricValue}>2,000+</div>
              <div className={styles.metricLabel}>
                Garments Saved from Landfill
              </div>
            </div>
            <div className={styles.metricCard}>
              <FaTree className={styles.metricIcon} />
              <div className={styles.metricValue}>15,000kg</div>
              <div className={styles.metricLabel}>CO₂ Emissions Reduced</div>
            </div>
            <div className={styles.metricCard}>
              <FaWater className={styles.metricIcon} />
              <div className={styles.metricValue}>50,000L</div>
              <div className={styles.metricLabel}>Water Saved</div>
            </div>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.testimonialAvatar}>
                    <span className={styles.avatarEmoji}>
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className={styles.testimonialInfo}>
                    <h4 className={styles.testimonialName}>
                      {testimonial.name}
                    </h4>
                    <p className={styles.testimonialRole}>{testimonial.role}</p>
                    <div className={styles.testimonialRating}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className={styles.starIcon} />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className={styles.testimonialQuote}>
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <FaLeaf className={styles.logoIcon} />
              <span className={styles.logoText}>ReWear</span>
            </div>
            <p className={styles.footerDescription}>
              Making sustainable fashion accessible to everyone through clothing
              exchanges.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <a href="#about" className={styles.footerLink}>
              About Us
            </a>
            <a href="#how-it-works" className={styles.footerLink}>
              How It Works
            </a>
            <a href="#sustainability" className={styles.footerLink}>
              Sustainability
            </a>
            <a href="#contact" className={styles.footerLink}>
              Contact
            </a>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Support</h4>
            <a href="#help" className={styles.footerLink}>
              Help Center
            </a>
            <a href="#faq" className={styles.footerLink}>
              FAQ
            </a>
            <a href="#terms" className={styles.footerLink}>
              Terms of Service
            </a>
            <a href="#privacy" className={styles.footerLink}>
              Privacy Policy
            </a>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#twitter" className={styles.socialLink}>
                Twitter
              </a>
              <a href="#instagram" className={styles.socialLink}>
                Instagram
              </a>
              <a href="#facebook" className={styles.socialLink}>
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 ReWear. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

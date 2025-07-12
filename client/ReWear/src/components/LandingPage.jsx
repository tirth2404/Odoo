import React, { useState, useEffect } from "react";
import styles from "./LandingPage.module.css";
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
  FaWater
} from "react-icons/fa";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Featured items for carousel
  const featuredItems = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      category: "Outerwear",
      size: "M",
      condition: "Excellent",
      points: 150,
      image: "👕",
      type: "trending",
      location: "New York"
    },
    {
      id: 2,
      name: "Summer Floral Dress",
      category: "Dresses",
      size: "S",
      condition: "Good",
      points: 120,
      image: "👗",
      type: "popular",
      location: "Los Angeles"
    },
    {
      id: 3,
      name: "Classic White Sneakers",
      category: "Footwear",
      size: "8",
      condition: "Like New",
      points: 200,
      image: "👟",
      type: "recent",
      location: "Chicago"
    },
    {
      id: 4,
      name: "Leather Crossbody Bag",
      category: "Accessories",
      size: "One Size",
      condition: "Excellent",
      points: 180,
      image: "👜",
      type: "trending",
      location: "Miami"
    },
    {
      id: 5,
      name: "Cozy Winter Sweater",
      category: "Sweaters",
      size: "L",
      condition: "Good",
      points: 100,
      image: "🧥",
      type: "popular",
      location: "Seattle"
    }
  ];

  // Categories
  const categories = [
    { id: 1, name: "Men's Clothing", icon: "👔", count: "2.5K items" },
    { id: 2, name: "Women's Clothing", icon: "👗", count: "4.2K items" },
    { id: 3, name: "Kids", icon: "👶", count: "1.8K items" },
    { id: 4, name: "Accessories", icon: "👜", count: "3.1K items" },
    { id: 5, name: "Footwear", icon: "👟", count: "2.9K items" },
    { id: 6, name: "Outerwear", icon: "🧥", count: "1.6K items" }
  ];

  // Product listings
  const products = [
    {
      id: 1,
      name: "Blue Denim Jeans",
      size: "32x32",
      condition: "Excellent",
      points: 120,
      image: "👖",
      location: "New York"
    },
    {
      id: 2,
      name: "Red Summer Dress",
      size: "M",
      condition: "Good",
      points: 90,
      image: "👗",
      location: "Los Angeles"
    },
    {
      id: 3,
      name: "Black Leather Jacket",
      size: "L",
      condition: "Like New",
      points: 250,
      image: "🧥",
      location: "Chicago"
    },
    {
      id: 4,
      name: "White Sneakers",
      size: "9",
      condition: "Excellent",
      points: 180,
      image: "👟",
      location: "Miami"
    },
    {
      id: 5,
      name: "Floral Blouse",
      size: "S",
      condition: "Good",
      points: 75,
      image: "👚",
      location: "Seattle"
    },
    {
      id: 6,
      name: "Designer Handbag",
      size: "One Size",
      condition: "Excellent",
      points: 300,
      image: "👜",
      location: "Boston"
    },
    {
      id: 7,
      name: "Striped T-shirt",
      size: "M",
      condition: "Good",
      points: 60,
      image: "👕",
      location: "Austin"
    },
    {
      id: 8,
      name: "Winter Boots",
      size: "7",
      condition: "Like New",
      points: 220,
      image: "👢",
      location: "Denver"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      quote: "ReWear has completely changed how I think about fashion. I've saved money and the planet!",
      rating: 5,
      avatar: "👩‍🦰"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Environmental Advocate",
      quote: "Finally, a platform that makes sustainable fashion accessible and fun for everyone.",
      rating: 5,
      avatar: "👨‍🦱"
    }
  ];

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
      const productResults = products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery) ||
        product.condition.toLowerCase().includes(lowerQuery) ||
        product.location.toLowerCase().includes(lowerQuery)
      );

      // Search in categories
      const categoryResults = categories.filter(category =>
        category.name.toLowerCase().includes(lowerQuery)
      );

      // Search in featured items
      const featuredResults = featuredItems.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery)
      );

      const allResults = [
        ...productResults.map(item => ({ ...item, type: 'product' })),
        ...categoryResults.map(item => ({ ...item, type: 'category' })),
        ...featuredResults.map(item => ({ ...item, type: 'featured' }))
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
    setSearchQuery(result.name);
    setShowSearchResults(false);
    // Here you would typically navigate to the item or filter the view
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchContainer}`)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

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
                            key={`${result.type}-${result.id}-${index}`}
                            className={styles.searchResultItem}
                            onClick={() => handleSearchResultClick(result)}
                          >
                            <div className={styles.searchResultIcon}>
                              {result.type === 'product' && <FaTshirt />}
                              {result.type === 'category' && <FaLeaf />}
                              {result.type === 'featured' && <FaStar />}
                            </div>
                            <div className={styles.searchResultContent}>
                              <div className={styles.searchResultName}>{result.name}</div>
                              <div className={styles.searchResultMeta}>
                                {result.type === 'product' && (
                                  <>
                                    <span>{result.condition}</span>
                                    <span>{result.points} pts</span>
                                    <span>{result.location}</span>
                                  </>
                                )}
                                {result.type === 'category' && (
                                  <span>{result.count}</span>
                                )}
                                {result.type === 'featured' && (
                                  <>
                                    <span>{result.category}</span>
                                    <span>{result.points} pts</span>
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
            <a href="#login" className={styles.authLink}>Login</a>
            <a href="#signup" className={`${styles.authLink} ${styles.signupBtn}`}>Sign Up</a>
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
              Join thousands of fashion-conscious individuals making sustainable choices. 
              Swap, share, and save the planet one outfit at a time.
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
      <section className={styles.carouselSection}>
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
        
        <div className={styles.carouselContainer}>
          <div 
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredItems.map((item, index) => (
              <div key={item.id} className={styles.carouselItem}>
                <div className={styles.featuredCard}>
                  <div className={styles.itemImage}>
                    <span className={styles.itemEmoji}>{item.image}</span>
                    <div className={styles.itemBadge}>
                      {item.type === 'trending' && <span className={styles.trendingBadge}>🔥 Trending</span>}
                      {item.type === 'popular' && <span className={styles.popularBadge}>⭐ Popular</span>}
                      {item.type === 'recent' && <span className={styles.recentBadge}>🆕 Recent</span>}
                    </div>
                  </div>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemCategory}>{item.category}</p>
                    <div className={styles.itemDetails}>
                      <span className={styles.itemSize}>Size: {item.size}</span>
                      <span className={styles.itemCondition}>{item.condition}</span>
                    </div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPoints}>{item.points} pts</span>
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
        
        <div className={styles.carouselDots}>
          {featuredItems.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Browse Categories</h2>
        </div>
        
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
      </section>

      {/* Product Listings */}
      <section className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Available Items</h2>
          <div className={styles.filterButtons}>
            <button className={styles.filterBtn}>All</button>
            <button className={styles.filterBtn}>Trending</button>
            <button className={styles.filterBtn}>New</button>
            <button className={styles.filterBtn}>Popular</button>
          </div>
        </div>
        
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <span className={styles.productEmoji}>{product.image}</span>
                <button className={styles.favoriteBtn}>
                  <FaHeart className={styles.heartIcon} />
                </button>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productDetails}>
                  <span className={styles.productSize}>Size: {product.size}</span>
                  <span className={styles.productCondition}>{product.condition}</span>
                </div>
                <div className={styles.productMeta}>
                  <span className={styles.productPoints}>{product.points} pts</span>
                  <span className={styles.productLocation}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    {product.location}
                  </span>
                </div>
                <div className={styles.productActions}>
                  <button className={styles.viewBtn}>View Details</button>
                  <button className={styles.swapRequestBtn}>Request Swap</button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              <div className={styles.metricLabel}>Garments Saved from Landfill</div>
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
                    <span className={styles.avatarEmoji}>{testimonial.avatar}</span>
                  </div>
                  <div className={styles.testimonialInfo}>
                    <h4 className={styles.testimonialName}>{testimonial.name}</h4>
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
              Making sustainable fashion accessible to everyone through clothing exchanges.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <a href="#about" className={styles.footerLink}>About Us</a>
            <a href="#how-it-works" className={styles.footerLink}>How It Works</a>
            <a href="#sustainability" className={styles.footerLink}>Sustainability</a>
            <a href="#contact" className={styles.footerLink}>Contact</a>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Support</h4>
            <a href="#help" className={styles.footerLink}>Help Center</a>
            <a href="#faq" className={styles.footerLink}>FAQ</a>
            <a href="#terms" className={styles.footerLink}>Terms of Service</a>
            <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#twitter" className={styles.socialLink}>Twitter</a>
              <a href="#instagram" className={styles.socialLink}>Instagram</a>
              <a href="#facebook" className={styles.socialLink}>Facebook</a>
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
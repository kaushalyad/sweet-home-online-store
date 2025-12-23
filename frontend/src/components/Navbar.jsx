import { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaGift, FaBirthdayCake, FaHeart, FaSearch, FaShoppingCart, FaUserAlt, FaTruck, FaExclamationTriangle } from "react-icons/fa";
import AccountMenuSkeleton from "./AccountMenuSkeleton";

// Define as a named function declaration instead of a function expression
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const bannerRef = useRef(null);
  const categoryRef = useRef(null);
  const navScrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation menu structure - Haldiram's style
  const navigationMenu = {
    "Christmas Special": {
      type: "simple",
      path: "/collection?occasion=christmas",
      badge: "New"
    },
    "Wedding Special": {
      type: "simple",
      path: "/collection?occasion=wedding",
      badge: "Popular"
    },
    "Sweets": {
      type: "dropdown",
      items: [
        { name: "Packed Sweets", path: "/collection?category=packed-sweets", hasOffer: false },
        { name: "Exotic Collection", path: "/collection?category=exotic", hasOffer: false },
        { name: "Tin Sweets", path: "/collection?category=tin-sweets", hasOffer: false },
        { name: "Festive Treats", path: "/collection?category=festive", hasOffer: false },
        { name: "Signature Collection", path: "/collection?category=signature", hasOffer: false },
        { name: "Fresh Pops", path: "/collection?category=fresh-pops", hasOffer: true }
      ]
    },
    "Savories": {
      type: "dropdown",
      items: [
        { name: "Namkeen", path: "/collection?category=namkeen", hasOffer: true },
        { name: "Papad", path: "/collection?category=papad", hasOffer: false },
        { name: "Ready to Cook", path: "/collection?category=ready-to-cook", hasOffer: true },
        { name: "Chai Ke Saath", path: "/collection?category=chai-snacks", hasOffer: false }
      ]
    },
    "Cookies": {
      type: "simple",
      path: "/collection?category=cookies"
    },
    "Ready to Eat": {
      type: "simple",
      path: "/collection?category=ready-to-eat"
    },
    "Ghee": {
      type: "simple",
      path: "/collection?category=ghee"
    },
    "Refreshments": {
      type: "simple",
      path: "/collection?category=refreshments"
    }
  };

  // Quick order categories
  const sweetCategories = [
    { name: "Traditional Sweets", path: "/collection?category=traditional" },
    { name: "Milk-based Sweets", path: "/collection?category=milk" },
    { name: "Dry Fruit Sweets", path: "/collection?category=dryfruits" },
    { name: "Bengali Sweets", path: "/collection?category=bengali" },
    { name: "Namkeens & Snacks", path: "/collection?category=namkeen" },
    { name: "Festive Specials", path: "/collection?category=festive" },
    { name: "Gift Boxes", path: "/collection?category=giftbox" }
  ];

  // Special occasions menu
  const specialOccasions = [
    { name: "Birthday Celebrations", path: "/collection?occasion=birthday", icon: <FaBirthdayCake className="mr-2" /> },
    { name: "Wedding Favors", path: "/collection?occasion=wedding", icon: <FaHeart className="mr-2" /> },
    { name: "Corporate Gifts", path: "/collection?occasion=corporate", icon: <FaGift className="mr-2" /> },
    { name: "Festival Specials", path: "/collection?occasion=festival", icon: <FaGift className="mr-2" /> }
  ];

  const {
    setShowSearch,
    getCartCount,
    token,
    logout,
    showSearch,
    userData,
    userDataLoading,
    search,
    setSearch
  } = useContext(ShopContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  console.log("userData",userData);
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if banner should be shown on mount
  useEffect(() => {
    // Reset the banner visibility to make it visible again
    localStorage.removeItem('promoBannerClosedAt');
    setShowPromoBanner(true);
    
    // Listen for custom event from other components to show banner
    const handleShowBanner = () => setShowPromoBanner(true);
    window.addEventListener('showPromoBanner', handleShowBanner);
    
    return () => {
      window.removeEventListener('showPromoBanner', handleShowBanner);
    };
  }, []);

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryMenu(false);
      }
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showCategoryMenu]);

  // Toggle profile dropdown menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close profile dropdown when clicking outside
  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // Close promo banner and store preference
  const closePromoBanner = () => {
    setShowPromoBanner(false);
    
    // Store the closing timestamp instead of a boolean
    const closeTime = new Date().getTime();
    localStorage.setItem('promoBannerClosedAt', closeTime);
    
    // Dispatch custom event for App component to detect
    window.dispatchEvent(new Event('promoBannerClosed'));
    
    // Set a timeout to show the banner again after 5 minutes
    setTimeout(() => {
      setShowPromoBanner(true);
      localStorage.removeItem('promoBannerClosedAt');
      window.dispatchEvent(new Event('showPromoBanner'));
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  };

  // Toggle category menu
  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };

  // Direct navigation methods that don't use preventDefault which can block navigation
  const handleNavigation = (path) => {
    closeProfileMenu();
    setVisible(false);
    setShowCategoryMenu(false);
    navigate(path);
  };

  return (
    <>
      {/* Top Announcement Banner - Haldiram's Style */}
      {showPromoBanner && (
        <div 
          ref={bannerRef}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-400 overflow-hidden shadow-md"
        >
          <div className="flex items-center justify-between py-1.5">
            <div className="animate-marquee inline-flex items-center gap-4 text-black text-base font-medium">
              <FaTruck className="text-black flex-shrink-0 w-5 h-5" />
              <span className="font-bold">Delivering PAN India</span>
              <span>& Free Shipping across India on Orders above</span>
              <span className="font-bold">₹500</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Estimated Standard Delivery Timeline of 3-5 Working Days, Though Delivery Time May Vary Depending On Pin Code</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline text-red-600 font-bold">CAUTION - Beware of Fraud!!</span>
              <span className="hidden sm:inline text-sm">We do not accept/encourage online payments with respect to super stockist/distributorship/franchisee/employment.</span>
            </div>
            <div className="flex items-center gap-4 text-base font-medium pr-4 hidden md:flex">
              <Link 
                to="/track-order" 
                className="text-black hover:text-gray-800 transition-colors whitespace-nowrap"
              >
                Track Order
              </Link>
              <span className="text-black">|</span>
              <Link 
                to="/e-coupons" 
                className="text-black hover:text-gray-800 transition-colors whitespace-nowrap"
              >
                E-Coupons
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar - Haldiram's Style */}
      <div 
        className={`fixed left-0 right-0 z-[57] bg-white shadow-md transition-all duration-300`}
        style={{ top: showPromoBanner ? '32px' : '0' }}
      >
        <div className="container mx-auto px-4">
          {/* Top Row: Logo, Search, Icons */}
          <div className="flex items-center justify-between py-2.5">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={assets.logo} 
                className="w-14 sm:w-16 md:w-20 h-auto transition-transform duration-300 hover:scale-105" 
                alt="Sweet Home Logo" 
              />
            </Link>

            {/* Left Search Bar */}
            <div className="flex-1 max-w-md ml-4 mr-auto hidden md:block">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors pointer-events-none">
                  <FaSearch className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for sweets, snacks, ghee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm transition-all shadow-sm hover:shadow-md hover:border-orange-300 placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && search.trim()) {
                      navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
                    }
                  }}
                  onClick={() => setShowSearch(true)}
                />
                <button 
                  onClick={() => {
                    if (search.trim()) {
                      navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
                    } else {
                      navigate('/collection');
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg text-xs font-semibold"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Right Icons: Wishlist, Profile, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search Icon */}
              <button 
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="md:hidden p-2 hover:bg-orange-50 rounded-full transition-all group"
              >
                <FaSearch className="w-5 h-5 text-gray-700 group-hover:text-orange-600 transition-colors" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2 hover:bg-orange-50 rounded-full transition-all relative group hidden sm:flex items-center justify-center">
                <FaHeart className="w-5 h-5 text-gray-700 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Wishlist</span>
              </Link>

              {/* User Profile */}
              <div className="relative profile-menu">
                {token ? (
                  <>
                    <button
                      onClick={toggleProfileMenu}
                      className="p-2 hover:bg-orange-50 rounded-full transition-all group relative"
                    >
                      <FaUserAlt className="w-5 h-5 text-gray-700 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Profile</span>
                    </button>
                    
                    {showProfileMenu && (
                      userDataLoading ? (
                        <AccountMenuSkeleton />
                      ) : (
                        <div className="absolute right-0 top-full mt-2 w-60 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-200">
                            <p className="text-sm text-gray-500">Welcome back!</p>
                            <p className="font-semibold text-gray-800">{userData?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-400 mt-1">{userData?.email || ''}</p>
                          </div>
                          <div className="py-2">
                            <button 
                              onClick={() => handleNavigation('/profile')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                            >
                              <span>Profile Information</span>
                            </button>
                            <button 
                              onClick={() => handleNavigation('/orders')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                            >
                              <span>My Orders</span>
                            </button>
                            <button 
                              onClick={() => handleNavigation('/wishlist')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                            >
                              <span>My Wishlist</span>
                            </button>
                            <button 
                              onClick={() => handleNavigation('/settings')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-2"
                            >
                              <span>Account Settings</span>
                            </button>
                            <div className="border-t border-gray-200 mt-2 pt-2">
                              <button 
                                onClick={() => {
                                  logout();
                                  closeProfileMenu();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Logout
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-orange-50 rounded-full transition-all group flex items-center justify-center">
                <FaShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-orange-600 group-hover:scale-110 transition-all" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-md animate-pulse">
                  {getCartCount()}
                </span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Cart</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setVisible(true)}
                className="lg:hidden p-2 hover:bg-orange-50 rounded transition-all group"
              >
                <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Row: Navigation Menu */}
          <div className="hidden lg:block border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-center justify-evenly py-2.5 px-4">
              {Object.entries(navigationMenu).map(([key, value]) => (
                  <div key={key} className="relative group flex-shrink-0">
                    {value.type === "simple" ? (
                      <button
                        onClick={() => navigate(value.path)}
                        className="relative text-gray-800 hover:text-orange-600 font-semibold text-sm transition-all py-2 px-6 hover:bg-white hover:shadow-sm rounded-lg group/item whitespace-nowrap"
                      >
                        <span className="relative">
                          {key}
                          {value.badge && (
                            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                              {value.badge}
                            </span>
                          )}
                        </span>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover/item:w-3/4 h-0.5 bg-orange-600 transition-all duration-300"></div>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                          onMouseEnter={() => setActiveDropdown(key)}
                          className="flex items-center justify-center gap-1 text-gray-800 hover:text-orange-600 font-semibold text-sm transition-all py-2 px-6 hover:bg-white hover:shadow-sm rounded-lg group/item whitespace-nowrap"
                        >
                          <span className="relative">{key}</span>
                          <svg 
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover/item:w-3/4 h-0.5 bg-orange-600 transition-all duration-300"></div>
                        </button>

                      {/* Enhanced Dropdown Menu */}
                      {activeDropdown === key && (
                        <div 
                          className="absolute left-0 top-full mt-1 w-64 bg-white shadow-2xl rounded-xl border border-gray-100 py-3 z-50 animate-fadeIn"
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="px-3 pb-2 mb-2 border-b border-gray-100">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{key}</h3>
                          </div>
                          {value.items.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                navigate(item.path);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-600 transition-all flex items-center justify-between group/item relative"
                            >
                              <span>{item.name}</span>
                              <div className="flex items-center gap-2">
                                {item.hasOffer && (
                                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                    OFFER
                                  </span>
                                )}
                                <svg 
                                  className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity text-orange-600" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {showSearchBar && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-xl border-t border-gray-100 p-4 z-50 animate-fadeIn">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-orange-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && search.trim()) {
                    setShowSearchBar(false);
                    navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
                  }
                }}
              />
              <button 
                onClick={() => {
                  setShowSearchBar(false);
                  if (search.trim()) {
                    navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
                  } else {
                    navigate('/collection');
                  }
                }}
                className="px-4 py-2.5 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-orange-600 text-white">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={() => setVisible(false)}
              className="p-2 hover:bg-orange-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-2">
              {Object.entries(navigationMenu).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100">
                  {value.type === "simple" ? (
                    <button
                      onClick={() => {
                        navigate(value.path);
                        setVisible(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium"
                    >
                      {key}
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                        className="w-full text-left px-4 py-3 text-gray-800 hover:bg-orange-50 transition-colors font-medium flex items-center justify-between"
                      >
                        {key}
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      
                      {activeDropdown === key && (
                        <div className="bg-gray-50 py-2">
                          {value.items.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                navigate(item.path);
                                setVisible(false);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-8 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                            >
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Additional Links */}
              <div className="mt-4 px-4 py-2">
                <p className="text-xs text-gray-500 font-semibold mb-2">QUICK LINKS</p>
                <button
                  onClick={() => {
                    navigate('/about');
                    setVisible(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => {
                    navigate('/contact');
                    setVisible(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Contact
                </button>
              </div>

              {/* User Section */}
              {token ? (
                <div className="mt-4 px-4 py-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold mb-2">MY ACCOUNT</p>
                  <button 
                    onClick={() => handleNavigation("/profile")}
                    className="w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => handleNavigation("/orders")}
                    className="w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    My Orders
                  </button>
                  <button 
                    onClick={() => handleNavigation("/wishlist")}
                    className="w-full text-left py-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setVisible(false);
                    }}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Login / Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Export the component
export default Navbar;

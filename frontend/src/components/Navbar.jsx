import { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FaGift, FaBirthdayCake, FaHeart, FaSearch, FaShoppingCart, FaUserAlt } from "react-icons/fa";

// Define as a named function declaration instead of a function expression
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const bannerRef = useRef(null);
  const categoryRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    userData
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
      {/* Beautiful Promotional Banner */}
      {showPromoBanner && (
        <div 
          ref={bannerRef}
          className="fixed top-0 left-0 right-0 z-[60] h-10 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 shadow-md"
        >
          <div className="container mx-auto h-full">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-1 sm:gap-3">
                <div className="hidden sm:flex">
                  <svg className="w-4 h-4 text-pink-200 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                  </svg>
                </div>
                <div className="flex items-center">
                  <p className="text-white text-xs sm:text-sm">
                    <span className="font-bold">FREE SHIPPING</span>
                    <span className="hidden xs:inline"> on orders above </span>
                    <span className="font-bold">₹500</span>
                  </p>
                </div>
                <div className="hidden sm:block h-4 w-px bg-pink-300 mx-1"></div>
                <div className="flex items-center">
                  <p className="text-white text-xs sm:text-sm">
                    Use code: <span className="font-bold tracking-wider bg-white text-pink-600 px-1.5 py-0.5 rounded">SWEETFREE</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a href="/collection" className="hidden sm:flex items-center text-white hover:text-pink-100 transition-colors text-xs">
                  <span>Shop Now</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    closePromoBanner();
                  }}
                  className="text-pink-100 hover:text-white transition-colors"
                  aria-label="Close promotion banner"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed navbar with adjusted top position */}
      {/* 
        Navbar height calculation:
        - Promo banner height: 40px (when visible)
        - Navbar padding: py-3 small_mobile:py-4 tablet:py-5 (average ~16px top + bottom)
        - Navbar content: logo (approx. 24px) + padding
        - Quick order bar height: approx 40px
        - Total height: ~100px without promo banner, ~140px with promo banner
      */}
      <div 
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2 small_mobile:py-3" : "bg-white/90 py-3 small_mobile:py-4 tablet:py-5"}`} 
        style={{ top: showPromoBanner ? '40px' : '0' }}
      >
        <div className="container mx-auto px-3 small_mobile:px-5 md:px-6 flex items-center justify-between font-medium">
          <div className="flex items-center gap-5 small_mobile:gap-7 tablet:gap-12">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">
              <img 
                src={assets.logo} 
                className="w-11 small_mobile:w-14 mobile:w-16 tablet:w-20 desktop:w-24 h-auto transition-all duration-300" 
                alt="Sweet Home Logo" 
              />
            </Link>

            <ul className="hidden sm:flex gap-6 mobile:gap-8 text-xs mobile:text-sm text-gray-700">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${isActive ? 'text-black font-semibold' : ''}`
                }
              >
                <p>HOME</p>
                <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/' ? 'opacity-100' : 'opacity-0'}`} />
              </NavLink>
              
              {/* Categories with Dropdown */}
              <div className="relative" ref={categoryRef}>
                <button 
                  onClick={toggleCategoryMenu}
                  className={`flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${location.pathname === '/collection' ? 'text-black font-semibold' : ''}`}
                >
                  <div className="flex items-center">
                    <p>SWEETS</p>
                    <svg className={`ml-1 w-4 h-4 transition-transform duration-300 ${showCategoryMenu ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/collection' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
                
                {/* Enhanced Menu Dropdown */}
                {showCategoryMenu && (
                  <div className="absolute left-0 mt-3 w-64 bg-white shadow-lg rounded-md border border-gray-100 z-50 p-5">
                    <div className="grid gap-3">
                      <h3 className="font-semibold text-gray-900 border-b pb-2.5 mb-2.5">Browse Categories</h3>
                      {sweetCategories.map((category, index) => (
                        <Link 
                          key={index} 
                          to={category.path}
                          className="text-gray-700 hover:text-pink-500 hover:bg-pink-50 px-3.5 py-2.5 rounded transition-colors duration-200 block"
                          onClick={() => setShowCategoryMenu(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <h3 className="font-semibold text-gray-900 mb-2">Special Occasions</h3>
                        {specialOccasions.map((occasion, index) => (
                          <Link 
                            key={index} 
                            to={occasion.path}
                            className="text-gray-700 hover:text-pink-500 hover:bg-pink-50 px-3 py-2 rounded transition-colors duration-200 flex items-center"
                            onClick={() => setShowCategoryMenu(false)}
                          >
                            {occasion.icon}
                            {occasion.name}
                          </Link>
                        ))}
                      </div>
                      <div className="bg-pink-50 mt-2 p-3 rounded-md">
                        <p className="font-medium text-pink-700 text-sm">Quick Order Popular Items</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/rasgulla');
                            }} 
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Rasgulla
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/kaju-barfi');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Kaju Barfi
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/jalebi');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Jalebi
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/gulab-jamun');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Gulab Jamun
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/mysore-pak');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Mysore Pak
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/besan-ladoo');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Besan Ladoo
                          </button>
                          <button 
                            onClick={() => {
                              handleNavigation('/collection/kalakand');
                            }}
                            className="bg-white text-xs px-2 py-1 rounded border border-pink-200 text-pink-600 hover:bg-pink-100 transition-colors"
                          >
                            Kalakand
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <NavLink 
                to="/collection" 
                className={({ isActive }) => 
                  `flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${isActive ? 'text-black font-semibold' : ''}`
                }
              >
                <p>COLLECTION</p>
                <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/collection' ? 'opacity-100' : 'opacity-0'}`} />
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${isActive ? 'text-black font-semibold' : ''}`
                }
              >
                <p>ABOUT</p>
                <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/about' ? 'opacity-100' : 'opacity-0'}`} />
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${isActive ? 'text-black font-semibold' : ''}`
                }
              >
                <p>CONTACT</p>
                <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/contact' ? 'opacity-100' : 'opacity-0'}`} />
              </NavLink>
            </ul>
          </div>
          
          <div className="flex items-center gap-5 small_mobile:gap-7">
            <div 
              onClick={() => {
                setShowSearch(!showSearch);
                if (!location.pathname.includes('collection')) {
                  navigate("/collection");
                }
              }}
              className="relative group cursor-pointer"
            >
              <div className="bg-pink-50 hover:bg-pink-100 p-2 rounded-full transition-all duration-300 group-hover:scale-110 relative">
                {!showSearch && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 text-xs text-white flex items-center justify-center">!</span>
                  </span>
                )}
                <FaSearch className="w-4 h-4 small_mobile:w-5 small_mobile:h-5 text-pink-500" />
              </div>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Search</span>
            </div>

            <div className="relative profile-menu">
              {token ? (
                <div className="flex flex-row items-center">
                  <FaUserAlt
                    onClick={toggleProfileMenu}
                    className="w-4 h-4 small_mobile:w-5 small_mobile:h-5 cursor-pointer hover:text-pink-600 transition-colors duration-300"
                  />
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-black text-white text-xs small_mobile:text-sm px-3 small_mobile:px-6 py-1.5 small_mobile:py-2 rounded hover:bg-gray-800 transition-colors duration-300"
                >
                  Login
                </button>
              )}
              
              {/* Profile Dropdown Menu - Using buttons for direct navigation */}
              {token && showProfileMenu && (
                <div className="absolute dropdown-menu right-0 pt-4 z-40 transition-all duration-300 transform origin-top-right">
                  <div className="w-60 py-4 px-5 bg-white shadow-lg rounded-md border border-gray-200">
                    <div className="border-b border-gray-200 pb-3.5 mb-3.5">
                      <p className="text-sm text-gray-500">Welcome back!</p>
                      <p className="font-semibold">{userData?.name ? `Hello, ${userData.name}!` : 'Welcome to Sweet Home!'}</p>
                    </div>
                    <div className="flex flex-col gap-3.5 text-gray-700">
                      <button 
                        onClick={() => handleNavigation('/profile')}
                        className="flex items-center gap-2 hover:text-black transition-colors duration-200 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                      </button>
                      <button 
                        onClick={() => handleNavigation('/orders')}
                        className="flex items-center gap-2 hover:text-black transition-colors duration-200 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>My Orders</span>
                      </button>
                      {/* <button 
                        onClick={() => handleNavigation('/track-order')}
                        className="flex items-center gap-2 hover:text-black transition-colors duration-200 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Track Order</span>
                      </button> */}
                      <button 
                        onClick={() => handleNavigation('/wishlist')}
                        className="flex items-center gap-2 hover:text-black transition-colors duration-200 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>Wishlist</span>
                      </button>
                      <button 
                        onClick={() => handleNavigation('/settings')}
                        className="flex items-center gap-2 hover:text-black transition-colors duration-200 text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <button 
                          onClick={() => {
                            logout();
                            closeProfileMenu();
                          }}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/cart" className="relative group">
              <div className="relative">
                <FaShoppingCart className="w-4 h-4 small_mobile:w-5 small_mobile:h-5 min-w-4 small_mobile:min-w-5 transition-transform duration-300 group-hover:scale-110 text-gray-800" />
                <p className="absolute right-[-5px] bottom-[-5px] w-4 small_mobile:w-5 h-4 small_mobile:h-5 flex items-center justify-center bg-pink-500 text-white rounded-full text-[10px] small_mobile:text-xs font-medium transition-transform duration-300 group-hover:scale-110">
                  {getCartCount()}
                </p>
              </div>
              <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cart</span>
            </Link>
            
            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              className="w-4 small_mobile:w-5 cursor-pointer sm:hidden transition-transform duration-300 hover:scale-110"
              alt="Menu"
            />
          </div>
        </div>

        {/* Quick Order Bar */}
        <div className="hidden lg:block bg-pink-50 shadow-sm border-t border-pink-100">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-2.5 text-sm">
              <div className="flex items-center space-x-8">
                <span className="font-medium text-pink-600">Quick Order:</span>
                <button 
                  onClick={() => handleNavigation('/collection/rasgulla')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Rasgulla
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/kaju-barfi')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Kaju Barfi
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/gulab-jamun')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Gulab Jamun
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/jalebi')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Jalebi
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/soan-papdi')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Soan Papdi
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/mysore-pak')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Mysore Pak
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/besan-ladoo')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Besan Ladoo
                </button>
                <button 
                  onClick={() => handleNavigation('/collection/kalakand')}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Kalakand
                </button>
              </div>
              <div>
                <button 
                  onClick={() => handleNavigation('/collection?category=giftbox')}
                  className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <FaGift className="mr-1" /> 
                  <span>Gift Boxes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improved Sidebar menu for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center justify-between cursor-pointer"
            >
              <p className="font-semibold text-lg">Menu</p>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col py-4">
              <div 
                onClick={() => handleNavigation("/")}
                className={`py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${location.pathname === '/' ? 'font-semibold' : ''}`}
              >
                HOME
              </div>
              <div
                onClick={() => handleNavigation("/collection")}
                className={`py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${location.pathname === '/collection' ? 'font-semibold' : ''}`}
              >
                COLLECTION
              </div>
              <div
                onClick={() => handleNavigation("/about")}
                className={`py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${location.pathname === '/about' ? 'font-semibold' : ''}`}
              >
                ABOUT
              </div>
              <div
                onClick={() => handleNavigation("/contact")}
                className={`py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${location.pathname === '/contact' ? 'font-semibold' : ''}`}
              >
                CONTACT
              </div>
              
              {token ? (
                <>
                  <div className="mt-4 px-6 py-2 text-sm text-gray-500">Account</div>
                  <div 
                    onClick={() => handleNavigation("/profile")}
                    className="py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    My Profile
                  </div>
                  <div 
                    onClick={() => handleNavigation("/orders")}
                    className="py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    My Orders
                  </div>
                  <div 
                    onClick={() => handleNavigation("/wishlist")}
                    className="py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    Wishlist
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setVisible(false);
                    }}
                    className="py-3 px-6 text-left text-red-500 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div
                  onClick={() => handleNavigation("/login")}
                  className="mx-6 mt-6 bg-black text-white py-3 rounded text-center hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  Login / Sign Up
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

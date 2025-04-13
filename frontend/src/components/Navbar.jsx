import { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    setShowSearch,
    getCartCount,
    token,
    logout,
    showSearch
  } = useContext(ShopContext);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // Toggle profile dropdown menu
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close profile dropdown when clicking outside
  const closeProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // Direct navigation methods that don't use preventDefault which can block navigation
  const handleNavigation = (path) => {
    closeProfileMenu();
    setVisible(false);
    navigate(path);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2 small_mobile:py-3" : "bg-white/90 py-3 small_mobile:py-4 tablet:py-5"}`}>
      <div className="container mx-auto px-2 small_mobile:px-4 flex items-center justify-between font-medium">
        <div className="flex items-center gap-4 small_mobile:gap-6 tablet:gap-10">
          <Link to="/" className="transition-transform duration-300 hover:scale-105">
            <img 
              src={assets.logo} 
              className="w-10 small_mobile:w-12 mobile:w-14 tablet:w-20 desktop:w-24 h-auto transition-all duration-300" 
              alt="Sweet Home Logo" 
            />
          </Link>

          <ul className="hidden sm:flex gap-4 mobile:gap-6 text-xs mobile:text-sm text-gray-700">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${isActive ? 'text-black font-semibold' : ''}`
              }
            >
              <p>HOME</p>
              <div className={`w-2/4 h-[2px] bg-black transition-all duration-300 ${location.pathname === '/' ? 'opacity-100' : 'opacity-0'}`} />
            </NavLink>
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
        
        <div className="flex items-center gap-4 small_mobile:gap-6">
          <div 
            onClick={() => {
              setShowSearch(!showSearch);
              navigate("/collection");
            }}
            className="relative group cursor-pointer"
          >
            <img
              src={assets.search_icon}
              className="w-4 small_mobile:w-5 transition-transform duration-300 group-hover:scale-110"
              alt="Search"
            />
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">Search</span>
          </div>

          <div className="relative">
            {token ? (
              <div className="flex flex-row items-center">
                <img
                  onClick={toggleProfileMenu}
                  className="w-5 small_mobile:w-6 h-5 small_mobile:h-6 rounded-full cursor-pointer border-2 border-transparent hover:border-black transition-all duration-300"
                  src={assets.profile_icon}
                  alt="Profile"
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
                <div className="w-56 py-4 px-5 bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <p className="text-sm text-gray-500">Welcome back!</p>
                    <p className="font-semibold">Sweet Home Customer</p>
                  </div>
                  <div className="flex flex-col gap-3 text-gray-700">
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
              <img src={assets.cart_icon} className="w-5 small_mobile:w-6 min-w-5 small_mobile:min-w-6 transition-transform duration-300 group-hover:scale-110" alt="Cart" />
              <p className="absolute right-[-5px] bottom-[-5px] w-4 small_mobile:w-5 h-4 small_mobile:h-5 flex items-center justify-center bg-black text-white rounded-full text-[10px] small_mobile:text-xs font-medium transition-transform duration-300 group-hover:scale-110">
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

      {/* Add an invisible overlay to detect clicks outside the profile menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={closeProfileMenu}
        ></div>
      )}
    </div>
  );
};

export default Navbar;

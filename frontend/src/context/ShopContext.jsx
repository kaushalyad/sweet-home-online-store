import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logger from "@/utils/logger";
import PropTypes from 'prop-types';

// Backend URL configuration
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token and redirect if it's not a token validation request
      if (!error.config.url.includes('/verify-token')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const ShopContext = createContext();

// Custom hook to use the shop context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }
  return context;
};

export const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 40;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [buffer, setBuffer] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Validate token with the backend to ensure it's still valid
  const validateToken = async (tokenToValidate) => {
    if (!tokenToValidate) {
      setToken("");
      setIsAuthenticated(false);
      setUserData(null);
      return false;
    }

    try {
      const response = await axiosInstance.post("/user/verify-token", {}, {
        headers: {
          Authorization: `Bearer ${tokenToValidate}`,
          token: tokenToValidate
        }
      });
      
      if (!response.data.success) {
        logger.warn("Token validation failed:", response.data.message);
        setToken("");
        setIsAuthenticated(false);
        setUserData(null);
        toast.error(response.data.message || "Your session has expired. Please login again.");
        navigate("/login");
        return false;
      } else {
        setIsAuthenticated(true);
        // Fetch user data after successful token validation
        await fetchUserData();
        logger.info("Token validated successfully");
        return true;
      }
    } catch (error) {
      logger.error("Token validation error:", error);
      
      // Only clear token if it's a real authentication error
      if (error.response?.status === 401 && !error.config.url.includes('/verify-token')) {
        setToken("");
        setIsAuthenticated(false);
        setUserData(null);
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      }
      return false;
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        logger.warn("Failed to fetch user data:", response.data.message);
      }
    } catch (error) {
      logger.error("Error fetching user data:", error);
    }
  };

  // Set token to localStorage whenever it changes
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        localStorage.setItem("token", token);
        const isValid = await validateToken(token);
        if (isValid) {
          // Get user's wishlist and cart when logged in
          getUserWishlist(token);
          getUserCart(token);
        }
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserData(null);
        // Clear wishlist and cart when logging out
        setWishlistItems([]);
        setCartItems({});
      }
    };

    initializeAuth();
  }, [token]);

  // Add to wishlist function
  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to add items to your wishlist");
      navigate("/login");
      return;
    }
    
    try {
      // Check if product is already in wishlist
      if (wishlistItems.includes(productId)) {
        // Remove from wishlist if already added
        removeFromWishlist(productId);
        return;
      }
      
      // Add to local state
      setWishlistItems(prev => [...prev, productId]);
      
      // Save to localStorage as backup
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (!localWishlist.includes(productId)) {
        localStorage.setItem("wishlist", JSON.stringify([...localWishlist, productId]));
      }
      
      // Show success message
      toast.success("Product added to wishlist");
      
      // In a full implementation, this would synchronize with a backend API
      // For now, we're just using localStorage
    } catch (error) {
      logger.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist. Please try again.");
    }
  };

  // Remove from wishlist function
  const removeFromWishlist = async (productId) => {
    try {
      // Remove from local state
      setWishlistItems(prev => prev.filter(id => id !== productId));
      
      // Remove from localStorage
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      localStorage.setItem("wishlist", JSON.stringify(localWishlist.filter(id => id !== productId)));
      
      // Show success message
      toast.success("Product removed from wishlist");
      
      // In a full implementation, this would synchronize with a backend API
    } catch (error) {
      logger.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist. Please try again.");
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Get user's wishlist
  const getUserWishlist = async (userToken) => {
    if (!userToken) return;
    
    try {
      // First load from localStorage as fallback
      const localWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistItems(localWishlist);
      
      // In a full implementation, this would fetch from an API
      // For example:
      // const response = await api.get("/wishlist", { 
      //   headers: { token: userToken } 
      // });
      // if (response.data.success) {
      //   setWishlistItems(response.data.wishlistItems);
      //   localStorage.setItem("wishlist", JSON.stringify(response.data.wishlistItems));
      // }
    } catch (error) {
      logger.error("Error fetching wishlist:", error);
      // Don't show error toast as this is not critical
    }
  };

  const getUserCart = useCallback(async (userToken) => {
    if (!userToken) {
      logger.warn("No token provided for getUserCart");
      return { success: false, message: "No token provided" };
    }
    
    try {
      logger.info("Fetching user cart from backend");
      const response = await axiosInstance.get("/cart");
      
      if (response.data.success) {
        const cartData = response.data.cartData || {};
        
        if (typeof cartData === 'object' && cartData !== null) {
          // Convert any string quantities to numbers
          const processedCartData = Object.entries(cartData).reduce((acc, [key, value]) => {
            acc[key] = Number(value);
            return acc;
          }, {});
          
          setCartItems(processedCartData);
          return { success: true, cartData: processedCartData };
        }
      }
      
      // If we reach here, something went wrong
      setCartItems({});
      return { success: false, message: "Failed to fetch cart" };
    } catch (error) {
      logger.error("Error fetching cart:", error);
      
      if (error.response?.status === 401) {
        setToken("");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        logger.error("Cart fetch error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        toast.error(error.response?.data?.message || "Failed to fetch cart. Please try again.");
      }
      
      setCartItems({});
      return { success: false, message: "Failed to fetch cart" };
    }
  }, [axiosInstance, navigate, setToken]);

  const removeFromCart = async (itemId) => {
    if (!token) {
      toast.error("Please login to remove items from cart");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.delete(`/cart/${itemId}`);
      
      if (response.data.success) {
        // Update local cart state with the response data
        const updatedCartData = response.data.cartData || {};
        setCartItems(updatedCartData);
        toast.success("Item removed from cart");
      } else {
        toast.error(response.data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      logger.error("Error removing from cart:", error);
      
      if (error.response?.status === 401) {
        setToken("");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove item from cart");
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!token) {
      toast.error("Please login to update cart");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      
      if (response.data.success) {
        // Update local cart state with the response data
        const updatedCartData = response.data.cartData || {};
        setCartItems(updatedCartData);
        toast.success("Cart updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      logger.error("Error updating cart:", error);
      
      if (error.response?.status === 401) {
        setToken("");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      logger.info(`Adding to cart - Item: ${itemId}, Quantity: ${quantity}`);
      
      const response = await axiosInstance.post("/cart/add", { 
        itemId, 
        quantity: Number(quantity)
      });
      
      if (response.data.success) {
        // Refresh cart data to ensure consistency
        await getUserCart(token);
        toast.success("Product added to cart successfully");
      } else {
        toast.error(response.data.message || "Failed to add to cart");
      }
    } catch (error) {
      logger.error("Error adding to cart:", error);
      
      if (error.response?.status === 401) {
        setToken("");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        logger.error("Add to cart error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        toast.error(error.response?.data?.message || "Failed to add to cart. Please try again.");
      }
    }
  };

  const getCartCount = () => {
    try {
      let totalCount = 0;
      if (cartItems && typeof cartItems === 'object') {
        Object.values(cartItems).forEach(quantity => {
          if (typeof quantity === 'number' && quantity > 0) {
            totalCount += quantity;
          }
        });
      }
      return totalCount;
    } catch (error) {
      logger.error("Error calculating cart count:", error);
      return 0;
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    if (cartItems && products) {
      Object.entries(cartItems).forEach(([productId, quantity]) => {
        const product = products.find(p => p._id === productId);
        if (product && quantity > 0) {
          totalAmount += product.price * quantity;
        }
      });
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      logger.info("Fetching products from:", `${backendUrl}/api/product/list`);
      const response = await axiosInstance.get("/product/list");
      if (response.data.success) {
        setBuffer(false);
        setProducts(response.data.products.reverse());
        logger.info("Products fetched successfully");
      } else {
        logger.warn("Failed to fetch products:", response.data.message);
        setBuffer(false);
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      logger.error("Error fetching products:", error);
      setBuffer(false);
      if (error.response) {
        logger.error("Response data:", error.response.data);
        logger.error("Response status:", error.response.status);
        toast.error(error.response.data?.message || "Failed to fetch products");
      } else if (error.request) {
        logger.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        logger.error("Error setting up request:", error.message);
        toast.error("Failed to fetch products. Please try again.");
      }
    }
  };

  // Initialize app - fetch products and user cart if token exists
  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart(token);
    }
  }, [token, getUserCart]);

  // Add cart refresh effect
  useEffect(() => {
    if (token) {
      const refreshCart = async () => {
        await getUserCart(token);
      };
      
      // Refresh cart every 30 seconds
      const interval = setInterval(refreshCart, 30000);
      
      return () => clearInterval(interval);
    }
  }, [token, getUserCart]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    setUserData(null);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const contextValue = {
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    products,
    navigate,
    backendUrl,
    setToken,
    token,
    buffer,
    logout,
    isAuthenticated,
    userData,
    // Add wishlist functions to context
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    removeFromCart,
    // Add getUserCart to context
    getUserCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ShopContextProvider;

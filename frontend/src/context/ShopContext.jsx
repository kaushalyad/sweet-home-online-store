import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logger from "@/utils/logger";
import PropTypes from 'prop-types';

axios.defaults.withCredentials = true;

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
  const backendUrl = "http://localhost:4000";
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
      const response = await axios.post(
        backendUrl + "/api/user/verify-token",
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${tokenToValidate}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
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
        fetchUserData(tokenToValidate);
        logger.info("Token validated successfully");
        return true;
      }
    } catch (error) {
      logger.error("Token validation error:", error);
      setToken("");
      setIsAuthenticated(false);
      setUserData(null);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Your session has expired. Please login again.");
        } else {
          toast.error("Authentication failed. Please login again.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Authentication failed. Please login again.");
      }
      navigate("/login");
      return false;
    }
  };

  // Fetch user data
  const fetchUserData = async (userToken) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/profile',
        {},
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

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
      // const response = await axios.get(backendUrl + "/api/wishlist", { 
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

  const addToCart = async (itemId, quantity = 1) => {
    if (!token) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }

    try {
      logger.info(`Adding to cart - Item: ${itemId}, Quantity: ${quantity}`);
      
      // First update the backend
      const response = await axios.post(
        backendUrl + "/api/cart/add",
        { 
          itemId, 
          quantity: Number(quantity)
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info("Add to cart response:", response.data);
      
      // Check if we have cartData in the response
      if (response.data && response.data.cartData) {
        // Update local cart state with the response data
        const updatedCartData = response.data.cartData;
        logger.info("Updating cart with data:", updatedCartData);
        
        // Ensure we have a valid cart data object
        if (typeof updatedCartData === 'object' && updatedCartData !== null) {
          // Convert Map to object if needed
          const cartDataObject = updatedCartData instanceof Map 
            ? Object.fromEntries(updatedCartData) 
            : updatedCartData;
            
          setCartItems(cartDataObject);
          // Save to localStorage as backup
          localStorage.setItem("cart", JSON.stringify(cartDataObject));
          toast.success("Product added to cart successfully");
        } else {
          logger.error("Invalid cart data received:", updatedCartData);
          toast.error("Error updating cart. Please try again.");
        }
      } else {
        logger.error("Invalid response format:", response.data);
        toast.error("Failed to add to cart. Please try again.");
      }
    } catch (error) {
      logger.error("Error adding to cart:", error);
      
      if (error.response) {
        logger.error("Error response data:", error.response.data);
        logger.error("Error response status:", error.response.status);
      }
      
      if (error.response?.status === 401) {
        setToken("");
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to add to cart");
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

  const updateQuantity = async (itemId, quantity) => {
    if (!token) {
      toast.error("Please login to update cart");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, quantity },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update local cart state with the response data
        setCartItems(response.data.cartData);
        // Save to localStorage as backup
        localStorage.setItem("cart", JSON.stringify(response.data.cartData));
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
      const response = await axios.get(backendUrl + "/api/product/list", { withCredentials: false });
      if (response.data.success) {
        setBuffer(false);
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      logger.error(error);
      toast.error(error.message);
    }
  };

  const getUserCart = useCallback(async (userToken) => {
    if (!userToken) {
      logger.warn("No token provided for getUserCart");
      return { success: false, message: "No token provided" };
    }
    
    try {
      logger.info("Fetching user cart from backend");
      const response = await axios.post(
        backendUrl + "/api/cart",
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info("Cart API response:", response.data);
      
      if (response.data.success) {
        const cartData = response.data.cartData || {};
        logger.info("Cart data received:", cartData);
        
        // Ensure we have a valid cart data object
        if (typeof cartData === 'object' && cartData !== null) {
          // Convert any string quantities to numbers
          const processedCartData = Object.entries(cartData).reduce((acc, [key, value]) => {
            acc[key] = Number(value);
            return acc;
          }, {});
          
          setCartItems(processedCartData);
          // Save to localStorage as backup
          localStorage.setItem("cart", JSON.stringify(processedCartData));
          return { success: true, cartData: processedCartData };
        } else {
          logger.error("Invalid cart data received:", cartData);
          return { success: false, message: "Invalid cart data received" };
        }
      }
      
      const errorMsg = response.data.message || "Failed to fetch cart";
      logger.warn("Failed to fetch cart:", errorMsg);
      // Load from localStorage as fallback
      const localCart = JSON.parse(localStorage.getItem("cart") || "{}");
      setCartItems(localCart);
      return { success: false, message: errorMsg, cartData: localCart };
    } catch (error) {
      logger.error("Error fetching cart:", error);
      if (error.response) {
        logger.error("Error response data:", error.response.data);
        logger.error("Error response status:", error.response.status);
        
        if (error.response.status === 401) {
          setToken("");
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return { success: false, message: "Session expired" };
        }
      }
      // Load from localStorage as fallback
      const localCart = JSON.parse(localStorage.getItem("cart") || "{}");
      setCartItems(localCart);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || "Failed to fetch cart", 
        cartData: localCart 
      };
    }
  }, [backendUrl, navigate, setToken]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    setUserData(null);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  // Initialize app - fetch products and user cart if token exists
  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart(token);
    }
  }, [token, getUserCart]);

  const removeFromCart = async (itemId) => {
    if (!token) {
      toast.error("Please login to remove items from cart");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        backendUrl + `/api/cart/remove/${itemId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        // Update local cart state with the response data
        setCartItems(response.data.cartData);
        // Save to localStorage as backup
        localStorage.setItem("cart", JSON.stringify(response.data.cartData));
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

import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 40;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [buffer, setBuffer] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Set token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      // Validate token on backend 
      validateToken(token);
      // Get user's wishlist when logged in
      getUserWishlist(token);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      // Clear wishlist when logging out
      setWishlistItems([]);
    }
  }, [token]);

  // Validate token with the backend to ensure it's still valid
  const validateToken = async (tokenToValidate) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/verify-token",
        {},
        { headers: { token: tokenToValidate } }
      );
      
      if (!response.data.success) {
        // If token is invalid,
        setToken("");
        toast.error("Your session has expired. Please login again.");
      } else {
        // If validation successful, we could store user info if needed
        console.log("Token validated successfully");
      }
    } catch (error) {
      console.log("Token validation error:", error);
      // Handle different error scenarios
      if (error.response) {
        // Server responded with an error status code
        if (error.response.status === 401) {
          setToken("");
          toast.error("Your session has expired. Please login again.");
        } else {
          // Other server error, but don't log out user just yet
          console.error("Server error:", error.response.data);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        console.error("Network error - no response received");
        // Don't log out user due to network issues
      } else {
        // Error in setting up the request
        console.error("Request setup error:", error.message);
      }
    }
  };

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
      console.error("Error adding to wishlist:", error);
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
      console.error("Error removing from wishlist:", error);
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
      console.error("Error fetching wishlist:", error);
      // Don't show error toast as this is not critical
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
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
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (userToken) => {
    if (!userToken) return;
    
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token: userToken } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        // If unauthorized, the token is invalid
        setToken("");
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch your cart. Please try again.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  // Initialize app - fetch products and user cart if token exists
  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart(token);
    }
  }, []);

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
    // Add wishlist functions to context
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

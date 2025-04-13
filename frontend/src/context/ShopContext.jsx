import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 40;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
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
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
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
        // If token is invalid, clear it
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
      const response = await axios.get(backendUrl + "/api/product/list");
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

  const value = {
    products,
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
    navigate,
    backendUrl,
    setToken,
    token,
    buffer,
    logout,
    isAuthenticated
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

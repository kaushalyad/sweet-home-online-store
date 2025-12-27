import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';
import { FaShoppingCart, FaTrash, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import CartSkeleton from '../components/CartSkeleton';
import { toast } from "react-toastify";
import { trackPageView, trackPurchaseSuccess, trackPurchaseFailure } from "../utils/analytics";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, products, getUserCart, updateQuantity, removeFromCart, token } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const isMounted = useRef(true);

  // Track page view
  useEffect(() => {
    trackPageView(window.location.pathname, "Cart");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Check for token and redirect if not present
  useEffect(() => {
    if (!token) {
      toast.error("Please login to view your cart");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  // Process cart items whenever cartItems or products change
  useEffect(() => {
    if (!products || !cartItems) return;

    // Convert cartItems object to array of products with quantities
    const processedProducts = Object.entries(cartItems).map(([productId, quantity]) => {
      // Find the product details from the products array
      const productDetails = products.find(p => p._id === productId);
      if (!productDetails) {
        console.warn(`Product not found for ID: ${productId}`);
        return null;
      }
      return {
        ...productDetails,
        quantity: Number(quantity)
      };
    }).filter(Boolean);

    if (isMounted.current) {
      setCartProducts(processedProducts);
      setLoading(false);
    }
  }, [cartItems, products]);

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserCart(token);
        if (!response.success) {
          setError(response.message || 'Failed to fetch cart data');
          if (response.message === "No token provided") {
            toast.error("Please login to view your cart");
            navigate("/login");
          }
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch cart data');
        if (error.message === "No token provided") {
          toast.error("Please login to view your cart");
          navigate("/login");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchCartData();
  }, [getUserCart, token, navigate]);

  // Handle quantity update
  const handleQuantityChange = async (productId, newQuantity) => {
    if (!token) {
      toast.error("Please login to update cart");
      navigate("/login");
      return;
    }

    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  // Handle item removal
  const handleRemoveItem = async (productId) => {
    if (!token) {
      toast.error("Please login to remove items from cart");
      navigate("/login");
      return;
    }

    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  // Check if cart is empty
  const isCartEmpty = !loading && cartProducts.length === 0;

  const handleCheckout = async () => {
    try {
      // Your checkout logic here
      const orderId = "ORDER_" + Date.now();
      const totalAmount = cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Track successful purchase
      trackPurchaseSuccess(orderId, cartProducts, totalAmount);
      
      navigate("/place-order");
    } catch (error) {
      // Track failed purchase
      trackPurchaseFailure(error, cartProducts, cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0));
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto sm:px-4 py-8">
        <Title title="Your Cart" />
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (isCartEmpty) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-6">
            <Title title="Your Sweet Cart" />
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50 rounded-xl sm:rounded-2xl shadow-medium p-6 sm:p-10 md:p-16">
            <div className="max-w-2xl mx-auto text-center">
              {/* Animated Icon */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-strong">
                  <FaShoppingCart className="text-3xl sm:text-4xl md:text-5xl text-white" />
                </div>
              </div>

              {/* Heading with Poppins */}
              <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                Your Cart is Waiting for Sweet Treats!
              </h2>
              
              {/* Description */}
              <p className="font-inter text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2 sm:px-4">
                Discover our delightful collection of handcrafted sweets and treats. From traditional favorites to modern delights, we have something special for every sweet tooth!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
                <button
                  onClick={() => navigate('/collection')}
                  className="btn-interactive w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg font-poppins font-medium sm:font-semibold hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base group"
                >
                  <FaShoppingCart className="text-sm sm:text-base group-hover:scale-110 transition-transform" />
                  <span className="whitespace-nowrap">Explore Sweet Collection</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-poppins font-medium sm:font-semibold hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto sm:px-4 py-8">
      <Title title="Your Sweet Collection" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 p-4 bg-gray-50 rounded-lg font-semibold text-gray-700">
            <div className="col-span-4">Sweet Treat</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Cart Items */}
          {cartProducts.map((product) => (
            <div 
              key={product._id} 
              className="group grid grid-cols-12 gap-4 items-center mb-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Product Info */}
              <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                <div className="relative w-20 h-20 overflow-hidden rounded-lg">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 md:col-span-2 text-center">
                <span className="md:hidden font-semibold mr-2">Price:</span>
                <span className="text-gray-800 font-medium">₹{product.price.toFixed(2)}</span>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-6 md:col-span-3 flex items-center justify-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                      disabled={product.quantity <= 1}
                      className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                      className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(product._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="col-span-6 md:col-span-2 text-center">
                <span className="md:hidden font-semibold mr-2">Total:</span>
                <span className="font-semibold text-gray-800">
                  ₹{(product.price * product.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
            <CartTotal />
            <div className="mt-6">
              <button 
                onClick={handleCheckout} 
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-md transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

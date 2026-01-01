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
      <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="font-poppins text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 via-orange-500 to-rose-600 bg-clip-text text-transparent">
              Your Sweet Cart
            </h1>
          </div>
          
          {/* Main Empty Cart Card - Compact & Attractive */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Decorative Header */}
            <div className="h-2 bg-gradient-to-r from-pink-500 via-orange-400 to-rose-500"></div>
            
            <div className="p-6 sm:p-10 text-center">
              {/* Animated Icon - Smaller */}
              <div className="relative inline-block mb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
                  <FaShoppingCart className="text-4xl sm:text-5xl text-transparent bg-gradient-to-br from-pink-500 to-orange-500 bg-clip-text" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaShoppingCart className="text-4xl sm:text-5xl text-pink-500 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Heading - Compact */}
              <h2 className="font-poppins text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h2>
              
              {/* Description - Shorter */}
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                Fill it with delicious handcrafted sweets from our collection!
              </p>

              {/* Features Grid - Compact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-3 sm:p-4 transform hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">🍬</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Fresh & Pure</h3>
                  <p className="text-xs text-gray-600">Handcrafted daily</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-3 sm:p-4 transform hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">🚚</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Free Delivery</h3>
                  <p className="text-xs text-gray-600">On orders above ₹500</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-3 sm:p-4 transform hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">🎁</div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Gift Options</h3>
                  <p className="text-xs text-gray-600">Perfect packaging</p>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  onClick={() => navigate('/collection')}
                  className="group px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <FaShoppingCart className="group-hover:rotate-12 transition-transform" />
                  <span>Browse Sweets</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 text-sm"
                >
                  Go Home
                </button>
              </div>
            </div>

            {/* Popular Products Suggestion - Compact */}
            <div className="bg-gradient-to-r from-pink-50 to-orange-50 px-6 py-4 border-t border-gray-100">
              <p className="text-center text-sm text-gray-700">
                <span className="font-semibold">💡 Tip:</span> Check out our{' '}
                <button 
                  onClick={() => navigate('/collection')}
                  className="text-orange-600 font-semibold hover:underline"
                >
                  bestsellers
                </button>
                {' '}and{' '}
                <button 
                  onClick={() => navigate('/collection')}
                  className="text-pink-600 font-semibold hover:underline"
                >
                  new arrivals
                </button>
              </p>
            </div>
          </div>

          {/* Quick Links - Compact Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => navigate('/orders')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all group"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                My Orders
              </h3>
              <p className="text-xs text-gray-500 mt-1">Track your purchases</p>
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all group"
            >
              <div className="text-3xl mb-2">❤️</div>
              <h3 className="font-semibold text-gray-800 text-sm group-hover:text-pink-600 transition-colors">
                Wishlist
              </h3>
              <p className="text-xs text-gray-500 mt-1">Save your favorites</p>
            </button>
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

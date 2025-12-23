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
      <div className="container mx-auto px-4 py-8">
        <Title title="Your Cart" />
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (isCartEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Title title="Your Sweet Cart" />
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="text-4xl text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Waiting for Sweet Treats!</h2>
            <p className="text-gray-600 mb-8">
              Discover our delightful collection of handcrafted sweets and treats. From traditional favorites to modern delights, we have something special for every sweet tooth!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/collection')}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-md font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-lg" />
                Explore Sweet Collection
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

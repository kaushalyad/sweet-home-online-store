import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
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
    return (
      <div className="container mx-auto px-4 py-8">
        <Title title="Your Cart" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
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
        <Title title="Your Cart" />
        <div className="text-center py-8">
          <FaShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some delicious items to your cart!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="Your Cart" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 p-4 bg-gray-50 rounded-lg font-semibold text-gray-700">
            <div className="col-span-4">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Cart Items */}
          {cartProducts.map((product) => (
            <div key={product._id} className="grid grid-cols-12 gap-4 items-center mb-4 p-4 bg-white rounded-lg shadow">
              {/* Product Info */}
              <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-6 md:col-span-2 text-center">
                <span className="md:hidden font-semibold mr-2">Price:</span>
                <span className="text-gray-800">₹{product.price.toFixed(2)}</span>
              </div>

              {/* Quantity Controls */}
              <div className="col-span-6 md:col-span-3 flex items-center justify-center gap-2">
                <span className="md:hidden font-semibold mr-2">Quantity:</span>
                <button
                  onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{product.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Total */}
              <div className="col-span-6 md:col-span-2 text-center">
                <span className="md:hidden font-semibold mr-2">Total:</span>
                <span className="font-semibold text-gray-800">
                  ₹{(product.price * product.quantity).toFixed(2)}
                </span>
              </div>

              {/* Remove Button */}
              <div className="col-span-6 md:col-span-1 text-center">
                <button
                  onClick={() => handleRemoveItem(product._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
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

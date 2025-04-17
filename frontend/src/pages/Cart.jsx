import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { FaShoppingCart, FaArrowRight, FaStar, FaHeart, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductItem from "../components/ProductItem";
import { toast } from "react-toastify";
import { trackPageView, trackPurchaseSuccess, trackPurchaseFailure } from "../utils/analytics";

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, removeFromCart, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  // Track page view
  useEffect(() => {
    trackPageView(window.location.pathname, "Cart");
  }, []);

  // Process cart items
  useEffect(() => {
    const tempData = [];
    // Convert cartItems object to array
    Object.entries(cartItems).forEach(([itemId, quantity]) => {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        tempData.push({
          ...product,
          quantity: quantity
        });
      }
    });
    setCartData(tempData);
  }, [cartItems, products]);

  // Popular products to show in empty cart
  const popularProducts = products
    .filter(product => product.bestseller)
    .slice(0, 4);
    
  // Check if cart is empty
  const isCartEmpty = cartData.length === 0;
  
  // Handle click on a recommended product
  const handleProductClick = (productId) => {
    navigate(`/collection/${productId}`);
  };

  const handleCheckout = async () => {
    try {
      // Your checkout logic here
      const orderId = "ORDER_" + Date.now();
      const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Track successful purchase
      trackPurchaseSuccess(orderId, cartData, totalAmount);
      
      navigate("/place-order");
    } catch (error) {
      // Track failed purchase
      trackPurchaseFailure(error, cartData, cartData.reduce((total, item) => total + (item.price * item.quantity), 0));
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className='border-t pt-10'>
      <div className='text-2xl mb-5'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {isCartEmpty ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="bg-pink-50 rounded-full p-6 mb-6">
            <FaShoppingCart className="text-pink-500 text-4xl animate-bounce" />
          </div>
          <h2 className="text-2xl font-medium text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 max-w-md mb-8">
            Looks like you haven't added any sweets to your cart yet. 
            Explore our delicious collection and find your favorites!
          </p>
          
          <button 
            onClick={() => navigate('/collection')} 
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-md flex items-center transition-all duration-300 transform hover:scale-105"
          >
            Start Shopping <FaArrowRight className="ml-2" />
          </button>
          
          {popularProducts.length > 0 && (
            <div className="mt-12 w-full">
              <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center justify-center">
                <FaStar className="text-yellow-500 mr-2" /> Popular Recommendations
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularProducts.map(product => (
                  <ProductItem
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    bestseller={product.bestseller}
                    featured={product.featured}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);

              return (
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20 rounded-md' src={productData.image[0]} alt="" />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{productData.price}</p>
                      </div>
                    </div>
                  </div>
                  <input 
                    onChange={(e) => e.target.value === '' || e.target.value === '0' 
                      ? null 
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                    } 
                    className='border rounded-md max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                    type="number" 
                    min={1} 
                    defaultValue={item.quantity} 
                  />
                  <button 
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="hover:text-pink-600 transition-colors"
                  >
                    <img className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="Remove" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className='flex justify-end my-12'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button 
                  onClick={handleCheckout} 
                  className='bg-pink-600 hover:bg-pink-700 text-white text-sm my-8 px-8 py-3 rounded-md transition-colors'
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart

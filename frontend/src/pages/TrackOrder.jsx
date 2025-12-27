import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from '../components/Title';
import { motion } from 'framer-motion';
import { FaBox, FaCheck, FaShippingFast, FaTruck, FaMapMarkerAlt, FaSearchLocation, FaSnowflake, FaExclamationTriangle, FaInfoCircle, FaPrint, FaArrowLeft, FaPhone, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastStatus, setLastStatus] = useState(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [purchaseLocation, setPurchaseLocation] = useState(null);

  // Base64 encoded placeholder image (1x1 transparent pixel)
  const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const loadPurchaseLocation = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/analytics/purchase-locations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        // Get the most recent purchase location
        const locations = response.data.data;
        const mostRecentLocation = locations[0]; // Assuming the API returns locations sorted by date
        setPurchaseLocation(mostRecentLocation);
      }
    } catch (error) {
      console.error("Error loading purchase location:", error);
    }
  };

  const loadOrderData = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${backendUrl}/api/order/track/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Check if status has changed
        if (lastStatus && lastStatus !== response.data.order.status) {
          setShowStatusUpdate(true);
          toast.success(`Order status updated to: ${response.data.order.status}`);
          // Hide the notification after 5 seconds
          setTimeout(() => setShowStatusUpdate(false), 5000);
        }
        setLastStatus(response.data.order.status);
        setOrderData(response.data.order);
        // Load purchase location after order data is loaded
        await loadPurchaseLocation();
      } else {
        setError('Failed to load order data');
        toast.error('Failed to load order data');
      }
    } catch (error) {
      console.error("Error loading order:", error);
      setError('Error loading order data');
      toast.error('Error loading order data');
    } finally {
      setLoading(false);
    }
  };

  // Poll for status updates every 30 seconds
  useEffect(() => {
    loadOrderData();
    const interval = setInterval(loadOrderData, 30000);
    return () => clearInterval(interval);
  }, [token, orderId]);

  // Mock delivery timeline steps based on order status
  const getTimelineSteps = (status) => {
    const steps = [
      { 
        id: 1, 
        title: 'Order Placed', 
        description: 'Your order has been received', 
        icon: <FaBox />, 
        completed: true,
        date: orderData ? new Date(orderData.date).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 2, 
        title: 'Processing', 
        description: 'Your order is being processed', 
        icon: <FaCheck />, 
        completed: ['Processing', 'Preparing', 'Packing', 'Quality Check', 'Shipped', 'Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*2).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 3, 
        title: 'Preparing', 
        description: 'Your sweets are being freshly prepared', 
        icon: <FaCheck />, 
        completed: ['Preparing', 'Packing', 'Quality Check', 'Shipped', 'Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*4).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 4, 
        title: 'Packing', 
        description: 'Your order is being carefully packed', 
        icon: <FaBox />, 
        completed: ['Packing', 'Quality Check', 'Shipped', 'Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*6).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 5, 
        title: 'Quality Check', 
        description: 'Final quality check before shipping', 
        icon: <FaCheck />, 
        completed: ['Quality Check', 'Shipped', 'Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*8).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 6, 
        title: 'Shipped', 
        description: 'Your order has been shipped', 
        icon: <FaShippingFast />, 
        completed: ['Shipped', 'Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*24).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 7, 
        title: 'Out for Delivery', 
        description: 'Your sweets are out for delivery in temperature-controlled packaging', 
        icon: <FaTruck />, 
        completed: ['Out for delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*48).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 8, 
        title: 'Delivered', 
        description: 'Your package has been delivered. Enjoy your delicious treats!', 
        icon: <FaMapMarkerAlt />, 
        completed: status === 'Delivered',
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*72).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      }
    ];
    
    return steps;
  };

  // Helper function to get shelf life based on product type
  const getShelfLife = (productName) => {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes('jalebi') || lowerName.includes('rasgulla') || lowerName.includes('gulab')) {
      return '2-3 days refrigerated';
    } else if (lowerName.includes('barfi') || lowerName.includes('ladoo')) {
      return '5-7 days';
    } else if (lowerName.includes('namkeen') || lowerName.includes('mixture') || lowerName.includes('bhujia')) {
      return '2-3 weeks in airtight container';
    }
    return '4-5 days';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-orange-50/30 to-transparent">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 mx-auto border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <motion.div 
        className="min-h-[60vh] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl text-orange-200 mb-6">
          <FaSearchLocation />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">We couldn't find the order you're looking for. Please check the order ID and try again.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
        >
          <FaArrowLeft /> Back to Orders
        </button>
      </motion.div>
    );
  }

  const timelineSteps = getTimelineSteps(orderData.status);

  return (
    <div className="border-t pt-8 sm:pt-12 pb-20 bg-gradient-to-b from-white to-orange-50/20">
      {/* Header with Back Button */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-4"
        >
          <FaArrowLeft /> Back to Orders
        </button>
        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Track Your Order
        </div>
        <p className="text-gray-500 mt-2">Order #{orderId.slice(-8).toUpperCase()}</p>
      </motion.div>

      {/* Order Status Card - Hero Section */}
      <motion.div 
        className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                orderData.status === 'Delivered' ? 'bg-green-500/20 backdrop-blur-sm' :
                orderData.status === 'Processing' ? 'bg-blue-500/20 backdrop-blur-sm' :
                orderData.status === 'Cancelled' ? 'bg-red-500/20 backdrop-blur-sm' :
                'bg-yellow-500/20 backdrop-blur-sm'
              } ${showStatusUpdate ? 'animate-pulse' : ''}`}>
                <span className="mr-2">●</span>
                {orderData.status}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Sweet Treats Are On The Way! 🍬</h2>
              <p className="text-white/80">
                Placed on {new Date(orderData.date).toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-bold">{currency}{orderData.amount}</div>
              <p className="text-white/80 mt-1">Total Amount</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Timeline */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Order Tracking Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaTruck className="text-orange-500" />
              </div>
              Delivery Progress
            </h2>
            
            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <motion.div 
                  key={step.id} 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {/* Connector line */}
                  {index < timelineSteps.length - 1 && (
                    <div className={`absolute top-12 left-6 w-1 h-full -translate-x-1/2 transition-all duration-500 rounded-full ${
                      step.completed ? 'bg-gradient-to-b from-orange-500 to-pink-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div 
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl z-10 transition-all duration-500 text-lg ${
                        step.completed ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                      } ${step.title === orderData.status ? 'ring-4 ring-orange-200 scale-110' : ''}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {step.icon}
                    </motion.div>
                    
                    {/* Content */}
                    <div className="flex-grow pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <h3 className={`font-bold transition-colors duration-500 ${
                          step.completed ? 'text-gray-800' : 'text-gray-400'
                        } ${step.title === orderData.status ? 'text-orange-600' : ''}`}>
                          {step.title}
                          {step.title === orderData.status && (
                            <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Current</span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{step.date}</span>
                      </div>
                      <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <FaBox className="text-pink-500" />
              </div>
              Order Items
            </h2>
            
            <div className="space-y-4">
              {orderData.items.map((item, index) => {
                let imageUrl = PLACEHOLDER_IMAGE;
                if (item.image) {
                  if (Array.isArray(item.image) && item.image[0]) {
                    imageUrl = item.image[0];
                  } else if (typeof item.image === 'string') {
                    imageUrl = item.image;
                  }
                }

                return (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-orange-50/30 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-2">
                        <p>Size: <span className="font-medium">{item.size || 'Regular'}</span></p>
                        <p>Qty: <span className="font-medium">{item.quantity}</span></p>
                        <p className="font-bold text-orange-600">{currency}{item.price}</p>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                        <FaSnowflake className="text-[10px]" />
                        Shelf Life: {getShelfLife(item.name)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Shipping Address
            </h3>
            <div className="text-gray-600 space-y-1 text-sm">
              <p className="font-semibold text-gray-800">{orderData.address.firstName} {orderData.address.lastName}</p>
              <p>{orderData.address.address || orderData.address.street}</p>
              <p>{orderData.address.city}, {orderData.address.state} {orderData.address.zipCode || orderData.address.zipcode}</p>
              <p>{orderData.address.country}</p>
              <p className="flex items-center gap-2 mt-3 text-orange-600">
                <FaPhone className="text-xs" />
                {orderData.address.phone}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-semibold text-gray-800">{orderData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`font-semibold ${
                  orderData.status === 'Delivered' ? 'text-green-600' :
                  orderData.payment ? 'text-green-600' : 'text-red-600'
                }`}>
                  {orderData.status === 'Delivered' ? 'Completed' :
                   orderData.payment ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="pt-3 border-t flex justify-between text-base">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-orange-600">{currency}{orderData.amount}</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaSnowflake className="text-blue-500" />
              Storage Instructions
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Refrigerate milk-based sweets immediately</p>
              <p>• Store dry sweets in airtight containers</p>
              <p>• Keep away from direct sunlight</p>
              <p>• Best consumed fresh within shelf life</p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
            <div className="space-y-3 text-sm">
              <a href="tel:+919931018857" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                <FaPhone /> +91 9931018857
              </a>
              <a href="mailto:support@sweethome-store.com" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium">
                <FaEnvelope /> support@sweethome-store.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackOrder; 
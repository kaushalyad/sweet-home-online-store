import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from '../components/Title';
import { FaBox, FaCheck, FaShippingFast, FaTruck, FaMapMarkerAlt, FaSearchLocation, FaSnowflake, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#2874f0] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-4xl text-gray-300 mb-4">
          <FaSearchLocation />
        </div>
        <h2 className="text-xl font-medium text-[#212121] mb-2">Order Not Found</h2>
        <p className="text-[#878787] mb-6">We couldn't find the order you're looking for.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1a5dc8]"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps(orderData.status);

  return (
    <div className="border-t pt-16 pb-20">
      <div className="text-2xl mb-8">
        <Title text1={'TRACK'} text2={'ORDER'} />
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdbdb] p-6 mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-medium text-[#212121]">Order #{orderId.slice(-6)}</h2>
            <p className="text-[#878787] text-sm mt-1">
              Placed on {new Date(orderData.date).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-500 ${
              orderData.status === 'Delivered' ? 'bg-green-50 text-green-700' :
              orderData.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
              orderData.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
              'bg-yellow-50 text-yellow-700'
            } ${showStatusUpdate ? 'animate-bounce' : ''}`}>
              {orderData.status}
              {showStatusUpdate && (
                <span className="ml-2 animate-pulse">●</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-[#212121] mb-2">Shipping Address</h3>
            <p className="text-[#878787]">
              {orderData.address.firstName} {orderData.address.lastName}<br />
              {orderData.address.address || orderData.address.street}<br />
              {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode || orderData.address.zipcode}<br />
              {orderData.address.country}<br />
              {orderData.address.phone}
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-[#212121] mb-2">Payment Information</h3>
              <p className="text-[#878787]">
                Method: {orderData.paymentMethod}<br />
                Status: <span className={orderData.payment ? 'text-green-600' : 'text-red-600'}>
                  {orderData.payment ? 'Paid' : 'Payment Pending'}
                </span><br />
                Amount: {currency}{orderData.amount}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#212121] mb-2">Purchase Location</h3>
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-[#2874f0] mt-1 flex-shrink-0" />
                <div className="text-[#878787]">
                  {purchaseLocation ? (
                    <>
                      <p className="font-medium text-[#212121]">{purchaseLocation.storeName || 'Sweet Home Store'}</p>
                      <p>{purchaseLocation.address}</p>
                      <p>{purchaseLocation.city}, {purchaseLocation.state}</p>
                      <p className="text-sm mt-1">
                        Order placed from {purchaseLocation.storeType || 'our store'}
                        {purchaseLocation.timestamp && (
                          <span> on {new Date(purchaseLocation.timestamp).toLocaleDateString()}</span>
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-[#212121]">Sweet Home Store</p>
                      <p>123 Sweet Street</p>
                      <p>Delhi, India</p>
                      <p className="text-sm mt-1">Order placed from our main store</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Special Handling Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdbdb] p-6 mb-8">
        <h2 className="text-lg font-medium text-[#212121] flex items-center mb-4">
          <FaExclamationTriangle className="text-amber-500 mr-2" /> Special Handling Instructions
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-blue-50 rounded-lg">
            <FaSnowflake className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#212121]">Refrigeration & Storage</h3>
              <p className="text-[#878787] mt-1">
                Upon delivery, please refrigerate milk-based sweets immediately to maintain freshness. 
                Dry sweets and namkeens should be stored in airtight containers at room temperature.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-green-50 rounded-lg">
            <FaInfoCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#212121]">Freshness Information</h3>
              <p className="text-[#878787] mt-1">
                Our sweets are prepared fresh before shipping and are packaged to maintain quality during delivery. 
                For best taste, consume milk-based sweets within 2-3 days and dry sweets/namkeens within their recommended shelf life.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-purple-50 rounded-lg">
            <FaInfoCircle className="text-purple-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-[#212121]">Expected Delivery Time</h3>
              <p className="text-[#878787] mt-1">
                To ensure freshness, our sweet deliveries are prioritized. 
                {orderData.status !== 'Delivered' ? 
                  ' Expected delivery is within 24-48 hours of shipping.' : 
                  ' Your package was delivered on ' + new Date(new Date(orderData.date).getTime() + 1000*60*60*72).toLocaleDateString() + '.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Tracking Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdbdb] p-6 mb-8">
        <h2 className="text-lg font-medium text-[#212121] mb-6">Delivery Progress</h2>
        
        <div className="space-y-8">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {index < timelineSteps.length - 1 && (
                <div className={`absolute top-10 left-6 w-0.5 h-full -translate-x-1/2 transition-colors duration-500 ${
                  step.completed ? 'bg-[#2874f0]' : 'bg-[#dbdbdb]'
                }`}></div>
              )}
              
              <div className="flex items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full z-10 transition-all duration-500 ${
                  step.completed ? 'bg-[#2874f0] bg-opacity-10 text-[#2874f0] scale-110' : 'bg-gray-100 text-[#878787]'
                } ${step.title === orderData.status ? 'ring-4 ring-[#2874f0] ring-opacity-30' : ''}`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h3 className={`font-medium transition-colors duration-500 ${
                      step.completed ? 'text-[#212121]' : 'text-[#878787]'
                    } ${step.title === orderData.status ? 'text-[#2874f0] font-semibold' : ''}`}>
                      {step.title}
                      {step.title === orderData.status && (
                        <span className="ml-2 text-sm text-[#2874f0]">(Current)</span>
                      )}
                    </h3>
                    <span className="text-sm text-[#878787]">{step.date}</span>
                  </div>
                  <p className="text-[#878787] mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-[#dbdbdb] p-6">
        <h2 className="text-lg font-medium text-[#212121] mb-6">Order Items</h2>
        
        <div className="space-y-4">
          {orderData.items.map((item, index) => {
            // Get image URL with fallback
            let imageUrl = PLACEHOLDER_IMAGE;
            if (item.image) {
              if (Array.isArray(item.image) && item.image[0]) {
                imageUrl = item.image[0];
              } else if (typeof item.image === 'string') {
                imageUrl = item.image;
              }
            }

            return (
              <div key={index} className="flex items-start pb-4 border-b border-[#dbdbdb] last:border-b-0 last:pb-0">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                      e.target.parentElement.classList.add('bg-gray-100');
                    }}
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium text-[#212121]">{item.name}</h3>
                  <div className="flex flex-wrap gap-x-4 text-sm text-[#878787] mt-1">
                    <p>Size: {item.size || 'Regular'}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {currency}{item.price}</p>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-pink-600 font-medium">Shelf Life:</span> <span className="text-[#878787]">{getShelfLife(item.name)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-3 border border-[#dbdbdb] rounded-md text-[#212121] hover:bg-gray-50"
        >
          Back to Orders
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-[#2874f0] text-white rounded-md hover:bg-[#1a5dc8]"
        >
          Print Order Details
        </button>
      </div>
    </div>
  );
};

export default TrackOrder; 
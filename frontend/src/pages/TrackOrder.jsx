import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from '../components/Title';
import { FaBox, FaCheck, FaShippingFast, FaTruck, FaMapMarkerAlt, FaSearchLocation, FaSnowflake, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const TrackOrder = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState("SH" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));

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
        description: 'Your sweets are being freshly prepared', 
        icon: <FaCheck />, 
        completed: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status),
        date: orderData ? new Date(new Date(orderData.date).getTime() + 1000*60*60*4).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : ''
      },
      { 
        id: 3, 
        title: 'Shipped', 
        description: 'Your order has been packaged with care and shipped', 
        icon: <FaShippingFast />, 
        completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status),
        date: status === 'Placed' ? 'Estimated: ' + new Date(new Date().getTime() + 1000*60*60*24).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }) : new Date(new Date(orderData?.date).getTime() + 1000*60*60*24).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      },
      { 
        id: 4, 
        title: 'Out for Delivery', 
        description: 'Your sweets are out for delivery in temperature-controlled packaging', 
        icon: <FaTruck />, 
        completed: ['Out for Delivery', 'Delivered'].includes(status),
        date: status !== 'Delivered' && status !== 'Out for Delivery' ? 'Estimated: ' + new Date(new Date().getTime() + 1000*60*60*48).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }) : new Date(new Date(orderData?.date).getTime() + 1000*60*60*48).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      },
      { 
        id: 5, 
        title: 'Delivered', 
        description: 'Your package has been delivered. Enjoy your delicious treats!', 
        icon: <FaMapMarkerAlt />, 
        completed: status === 'Delivered',
        date: status !== 'Delivered' ? 'Estimated: ' + new Date(new Date().getTime() + 1000*60*60*72).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric'
        }) : new Date(new Date(orderData?.date).getTime() + 1000*60*60*72).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })
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

  const loadOrderData = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/order/userorders', 
        {}, 
        { headers: { token } }
      );

      if (response.data.success) {
        // Find the specific order
        const order = response.data.orders.find(order => order._id === orderId);
        if (order) {
          setOrderData(order);
        } else {
          // Order not found
          navigate('/orders');
        }
      }
      
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-4xl text-gray-300 mb-4">
          <FaSearchLocation />
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Order #{orderId.slice(-6)}</h2>
            <p className="text-gray-500 text-sm mt-1">
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
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              {orderData.status}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Tracking ID: {trackingId}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {orderData.address.firstName} {orderData.address.lastName}<br />
              {orderData.address.address || orderData.address.street}<br />
              {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode || orderData.address.zipcode}<br />
              {orderData.address.country}<br />
              {orderData.address.phone}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Information</h3>
            <p className="text-gray-600">
              Method: {orderData.paymentMethod}<br />
              Status: {orderData.payment ? 'Paid' : 'Payment Pending'}<br />
              Amount: {currency}{orderData.amount}
            </p>
          </div>
        </div>
      </div>
      
      {/* Special Handling Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 flex items-center mb-4">
          <FaExclamationTriangle className="text-amber-500 mr-2" /> Special Handling Instructions
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-blue-50 rounded-lg">
            <FaSnowflake className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800">Refrigeration & Storage</h3>
              <p className="text-gray-600 mt-1">
                Upon delivery, please refrigerate milk-based sweets immediately to maintain freshness. 
                Dry sweets and namkeens should be stored in airtight containers at room temperature.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-green-50 rounded-lg">
            <FaInfoCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800">Freshness Information</h3>
              <p className="text-gray-600 mt-1">
                Our sweets are prepared fresh before shipping and are packaged to maintain quality during delivery. 
                For best taste, consume milk-based sweets within 2-3 days and dry sweets/namkeens within their recommended shelf life.
              </p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-purple-50 rounded-lg">
            <FaInfoCircle className="text-purple-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800">Expected Delivery Time</h3>
              <p className="text-gray-600 mt-1">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-6">Delivery Progress</h2>
        
        <div className="space-y-8">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Connector line */}
              {index < timelineSteps.length - 1 && (
                <div className="absolute top-10 left-6 w-0.5 h-full -translate-x-1/2 bg-gray-200"></div>
              )}
              
              <div className="flex items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full z-10 ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h3 className={`font-medium ${
                      step.completed ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <span className="text-sm text-gray-500">{step.date}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-6">Order Items</h2>
        
        <div className="space-y-4">
          {orderData.items.map((item, index) => (
            <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
              <img 
                src={item.image[0]} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                  <p>Size: {item.size}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {currency}{item.price}</p>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-pink-600 font-medium">Shelf Life:</span> <span className="text-gray-600">{getShelfLife(item.name)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Orders
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          Print Order Details
        </button>
      </div>
    </div>
  );
};

export default TrackOrder; 
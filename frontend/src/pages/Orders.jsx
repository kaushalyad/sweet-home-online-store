import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import OrdersSkeleton from '../components/OrdersSkeleton';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaBox, FaTruck, FaCheck, FaSearch, FaShippingFast, FaMapMarkerAlt, FaClock, FaChevronDown, FaChevronUp, FaReceipt, FaPhone, FaExclamationCircle, FaTimes, FaBan, FaChevronLeft } from 'react-icons/fa';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const Orders = () => {
  const { backendUrl, token, currency, navigate, products } = useContext(ShopContext);
  const [orderData, setorderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) {
        console.log("No token found, redirecting to login");
        setIsLoading(false);
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      console.log("Fetching orders with token:", token);
      console.log("Backend URL:", backendUrl);
      
      const response = await axios.get(
        `${backendUrl}/api/order/userorders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Raw orders response:", response.data);
      
      if (response.data.success && Array.isArray(response.data.orders)) {
        const processedOrders = response.data.orders.map(order => {
          console.log("Processing order:", order);
          console.log("Order items:", order.items);
          
          return {
            ...order,
            items: Array.isArray(order.items) ? order.items.map(item => {
              console.log("Processing item:", item);
              
              // Get image URL from item data
              let imageUrl = PLACEHOLDER_IMAGE;
              
              // Try to get image from item.image first
              if (item.image) {
                if (Array.isArray(item.image) && item.image[0]) {
                  imageUrl = item.image[0];
                  console.log("Using item.image array:", imageUrl);
                } else if (typeof item.image === 'string') {
                  imageUrl = item.image;
                  console.log("Using item.image string:", imageUrl);
                }
              }
              
              // If no image found in item.image, try item.product.image
              if (imageUrl === PLACEHOLDER_IMAGE && item.product) {
                if (item.product.image) {
                  if (Array.isArray(item.product.image) && item.product.image[0]) {
                    imageUrl = item.product.image[0];
                    console.log("Using product.image array:", imageUrl);
                  } else if (typeof item.product.image === 'string') {
                    imageUrl = item.product.image;
                    console.log("Using product.image string:", imageUrl);
                  }
                }
              }

              // If still no image, try to get it from the product data in the context
              if (imageUrl === PLACEHOLDER_IMAGE && item.productId) {
                const product = products.find(p => p._id === item.productId);
                if (product && product.image) {
                  if (Array.isArray(product.image) && product.image[0]) {
                    imageUrl = product.image[0];
                    console.log("Using context product.image array:", imageUrl);
                  } else if (typeof product.image === 'string') {
                    imageUrl = product.image;
                    console.log("Using context product.image string:", imageUrl);
                  }
                }
              }
              
              return {
                ...item,
                image: imageUrl
              };
            }) : []
          };
        });
        
        console.log("Final processed orders:", processedOrders);
        setorderData(processedOrders.reverse());
      } else {
        setorderData([]);
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch orders');
        }
      }
      
    } catch (error) {
      console.error("Error loading orders:", error);
      console.error("Error response:", error.response);
      setError(error.message);
      setorderData([]);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch orders. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("Orders component mounted");
    console.log("Token available:", !!token);
    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped':
      case 'out for delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheck className="w-4 h-4" />;
      case 'processing':
        return <FaClock className="w-4 h-4" />;
      case 'shipped':
      case 'out for delivery':
        return <FaTruck className="w-4 h-4" />;
      case 'cancelled':
        return <FaBan className="w-4 h-4" />;
      default:
        return <FaBox className="w-4 h-4" />;
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const canCancelOrder = (status) => {
    // Normalize status for comparison
    const normalizedStatus = status.toLowerCase().trim();
    const cancellableStatuses = ['processing', 'pending', 'order placed', 'preparing', 'packing', 'quality check'];
    return cancellableStatuses.includes(normalizedStatus);
  };

  const handleCancelOrder = (orderId) => {
    setCancellingOrder(orderId);
    setShowCancelDialog(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancellingOrder) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/cancel/${cancellingOrder}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        if (response.data.refundInitiated) {
          toast.success(
            `Order cancelled successfully! Refund of ${currency}${response.data.refundAmount} has been initiated.`,
            { duration: 5000 }
          );
        } else {
          toast.success('Order cancelled successfully!');
        }
        // Refresh order data
        await loadOrderData();
      } else {
        toast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || 'Failed to cancel order. Please try again.');
    } finally {
      setShowCancelDialog(false);
      setCancellingOrder(null);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orderData 
    : orderData.filter(order => order.status.toLowerCase() === filterStatus);

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-white to-orange-50/20 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadOrderData}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50/20 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your sweet deliveries</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="mb-6 bg-white rounded-2xl shadow-lg p-2 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 min-w-max">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
                {status !== 'all' && (
                  <span className="ml-2 text-xs opacity-80">
                    ({orderData.filter(o => o.status.toLowerCase() === status).length})
                  </span>
                )}
                {status === 'all' && (
                  <span className="ml-2 text-xs opacity-80">
                    ({orderData.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
        
        {filteredOrders.length === 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet. Start shopping for delicious sweets!"
                : `No ${filterStatus} orders found.`}
            </p>
            <Link 
              to="/collection" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <FaBox /> Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const isExpanded = expandedOrders.has(order._id);
                
                const isCancelled = order.status.toLowerCase() === 'cancelled';
                
                return (
                  <motion.div 
                    key={order._id} 
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${
                      isCancelled ? 'opacity-75 ring-2 ring-red-200' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    {/* Cancelled Banner */}
                    {isCancelled && (
                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 flex items-center justify-center gap-2 font-bold text-sm">
                        <FaBan className="animate-pulse" />
                        THIS ORDER HAS BEEN CANCELLED
                      </div>
                    )}
                    
                    {/* Order Header */}
                    <div className={`p-6 border-b ${
                      isCancelled ? 'bg-red-50/30 border-red-100' : 'border-gray-100'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FaClock className="text-orange-500" />
                              {new Date(order.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaBox className="text-pink-500" />
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-orange-600">
                              <FaReceipt className="text-orange-500" />
                              {currency}{order.totalAmount || order.amount}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Responsive */}
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/track-order/${order._id}`}
                            className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all font-semibold text-xs sm:text-sm whitespace-nowrap ${
                              isCancelled 
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm' 
                                : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                            }`}
                            onClick={(e) => isCancelled && e.preventDefault()}
                          >
                            <FaMapMarkerAlt className="text-xs sm:text-sm" /> 
                            <span>Track</span>
                          </Link>
                          {canCancelOrder(order.status) && !isCancelled && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-red-100 text-red-700 rounded-lg sm:rounded-xl hover:bg-red-200 transition-colors font-semibold text-xs sm:text-sm whitespace-nowrap border-2 border-red-200 hover:border-red-300"
                            >
                              <FaBan className="text-xs sm:text-sm" /> 
                              <span>Cancel</span>
                            </button>
                          )}
                          <button
                            onClick={() => toggleOrderExpansion(order._id)}
                            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors font-semibold text-xs sm:text-sm whitespace-nowrap"
                          >
                            <span>Details</span>
                            {isExpanded ? <FaChevronUp className="text-xs sm:text-sm" /> : <FaChevronDown className="text-xs sm:text-sm" />}
                          </button>
                        </div>
                      </div>

                      {/* Quick Preview - Always Visible */}
                      <div className="mt-4 flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                        <div className="flex -space-x-4">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div 
                              key={idx}
                              className="w-16 h-16 border-4 border-white rounded-xl overflow-hidden shadow-md"
                            >
                              <img 
                                src={item.image} 
                                alt={item.name || 'Product'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = PLACEHOLDER_IMAGE;
                                }}
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 border-4 border-white rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                +{order.items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">
                            {order.items[0]?.name || 'Product'}
                            {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivering to {order.shippingAddress?.city || order.address?.city || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-gray-50 space-y-6">
                            {/* All Items */}
                            <div>
                              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBox className="text-orange-500" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <motion.div 
                                    key={idx}
                                    className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                                      isCancelled ? 'opacity-60' : ''
                                    }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                  >
                                    <div className={`w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ${
                                      isCancelled ? 'grayscale' : ''
                                    }`}>
                                      <img 
                                        src={item.image} 
                                        alt={item.name || 'Product'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = PLACEHOLDER_IMAGE;
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`font-bold text-gray-800 ${
                                        isCancelled ? 'line-through' : ''
                                      }`}>{item.name || 'Product'}</h5>
                                      <div className={`flex flex-wrap gap-3 text-sm text-gray-600 mt-1 ${
                                        isCancelled ? 'line-through' : ''
                                      }`}>
                                        <span>Size: <span className="font-semibold">{item.size || 'Regular'}</span></span>
                                        <span>Qty: <span className="font-semibold">{item.quantity}</span></span>
                                        <span className="font-bold text-orange-600">{currency}{item.price}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-white rounded-xl shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                  <FaMapMarkerAlt className="text-pink-500" />
                                  Delivery Address
                                </h4>
                                {order.shippingAddress || order.address ? (
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-semibold text-gray-800">
                                      {order.shippingAddress?.firstName || order.address?.firstName} {order.shippingAddress?.lastName || order.address?.lastName}
                                    </p>
                                    <p>{order.shippingAddress?.street || order.shippingAddress?.address || order.address?.street || order.address?.address}</p>
                                    <p>
                                      {order.shippingAddress?.city || order.address?.city}, {order.shippingAddress?.state || order.address?.state} {order.shippingAddress?.zipcode || order.address?.zipcode}
                                    </p>
                                    <p className="flex items-center gap-2 text-orange-600 font-semibold mt-2">
                                      <FaPhone className="text-xs" />
                                      {order.shippingAddress?.phone || order.address?.phone}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No address available</p>
                                )}
                              </div>

                              <div className="p-4 bg-white rounded-xl shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-3">Payment Details</h4>
                                <div className="text-sm space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Method</span>
                                    <span className="font-semibold text-gray-800">{order.paymentMethod || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`font-semibold ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                                      {order.payment ? 'Paid' : 'Pending'}
                                    </span>
                                  </div>
                                  <div className="pt-2 border-t flex justify-between text-base">
                                    <span className="font-bold text-gray-800">Total</span>
                                    <span className="font-bold text-orange-600">{currency}{order.totalAmount || order.amount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Refund Status for Cancelled Orders */}
                            {isCancelled && order.refund && order.refund.status !== 'none' && (
                              <motion.div 
                                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                  <FaReceipt className="text-blue-500" />
                                  Refund Information
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Refund Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      order.refund.status === 'completed' 
                                        ? 'bg-green-100 text-green-700 border border-green-300' 
                                        : order.refund.status === 'pending' 
                                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-300 animate-pulse'
                                          : order.refund.status === 'processing'
                                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                            : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}>
                                      {order.refund.status === 'completed' && '✓ '}
                                      {order.refund.status.charAt(0).toUpperCase() + order.refund.status.slice(1)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Refund Amount</span>
                                    <span className="text-base font-bold text-blue-700">
                                      {currency}{order.refund.amount}
                                    </span>
                                  </div>

                                  {order.refund.initiatedDate && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700">Initiated On</span>
                                      <span className="text-sm font-semibold text-gray-800">
                                        {new Date(order.refund.initiatedDate).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric', 
                                          year: 'numeric' 
                                        })}
                                      </span>
                                    </div>
                                  )}

                                  {order.refund.completedDate && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700">Completed On</span>
                                      <span className="text-sm font-semibold text-green-700">
                                        {new Date(order.refund.completedDate).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric', 
                                          year: 'numeric' 
                                        })}
                                      </span>
                                    </div>
                                  )}

                                  {order.refund.refundMethod && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-gray-700">Refund Method</span>
                                      <span className="text-sm font-semibold text-gray-800 capitalize">
                                        {order.refund.refundMethod}
                                      </span>
                                    </div>
                                  )}

                                  {order.refund.transactionId && (
                                    <div className="pt-2 border-t border-blue-200">
                                      <span className="text-xs text-gray-600">Transaction ID</span>
                                      <p className="text-xs font-mono text-gray-800 mt-1 bg-white px-2 py-1 rounded">
                                        {order.refund.transactionId}
                                      </p>
                                    </div>
                                  )}

                                  {order.refund.status === 'pending' && (
                                    <div className="pt-3 border-t border-blue-200">
                                      <p className="text-xs text-blue-700 flex items-start gap-2">
                                        <FaClock className="mt-0.5 flex-shrink-0" />
                                        <span>Your refund is being processed. It typically takes 5-7 business days to reflect in your account.</span>
                                      </p>
                                    </div>
                                  )}

                                  {order.refund.status === 'completed' && (
                                    <div className="pt-3 border-t border-blue-200">
                                      <p className="text-xs text-green-700 flex items-start gap-2">
                                        <FaCheck className="mt-0.5 flex-shrink-0" />
                                        <span>Your refund has been successfully processed and credited to your original payment method.</span>
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Cancel Confirmation Dialog - Mobile Optimized */}
        <AnimatePresence>
          {showCancelDialog && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-3 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelDialog(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-2 sm:mx-4"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon Section */}
                <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4 text-center">
                  <motion.div 
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg border-4 border-red-50"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  >
                    <FaBan className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Cancel This Order?
                  </motion.h3>
                  
                  <motion.div
                    className="inline-block bg-gray-100 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs sm:text-sm font-mono text-gray-600">
                      #{cancellingOrder?.slice(-8).toUpperCase()}
                    </p>
                  </motion.div>
                </div>

                {/* Message Section */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <motion.div 
                    className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 border border-red-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed">
                      Once cancelled, this action <span className="font-bold text-red-700">cannot be reversed</span>. 
                      A refund will be processed per our policy.
                    </p>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      onClick={() => setShowCancelDialog(false)}
                      className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-white text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all font-semibold text-xs sm:text-sm border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaChevronLeft className="text-[10px] sm:text-xs" />
                      Keep My Order
                    </motion.button>
                    <motion.button
                      onClick={confirmCancelOrder}
                      className="flex-1 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaBan className="text-[10px] sm:text-xs" />
                      Yes, Cancel Order
                    </motion.button>
                  </motion.div>

                  {/* Help Text */}
                  <motion.p 
                    className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4 flex items-center justify-center gap-1 sm:gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <FaPhone className="text-orange-500 text-[10px] sm:text-xs" />
                    Questions? Call 9931018857
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;

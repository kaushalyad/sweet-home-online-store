import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBox, FaTruck, FaDownload, FaShare } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(ShopContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = location.state?.orderId;
    if (!orderId) {
      navigate('/orders');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrderDetails(response.data.order);
      } catch (error) {
        toast.error('Failed to fetch order details');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate, token, backendUrl]);

  const handleDownloadInvoice = () => {
    // Implement invoice download functionality
    toast.info('Invoice download will be available soon');
  };

  const handleShareOrder = () => {
    // Implement order sharing functionality
    toast.info('Order sharing will be available soon');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-800">Order not found</h2>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaCheckCircle className="text-green-500 text-4xl" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Thank you for your order!</h1>
                <p className="text-gray-600">Order #{orderDetails._id}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FaDownload />
                <span>Download Invoice</span>
              </button>
              <button
                onClick={handleShareOrder}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FaShare />
                <span>Share Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Order Confirmation Email Sent
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  We've sent a confirmation email to <strong>{orderDetails.shippingAddress?.email}</strong> with your order details.
                  Please check your inbox (and spam folder) for the email.
                </p>
                <p className="mt-2">
                  You'll also receive email updates when your order status changes (processing, shipped, delivered).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaBox className="text-blue-500 text-2xl" />
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-500">{new Date(orderDetails.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <FaTruck className="text-gray-400 text-2xl" />
              <div>
                <p className="font-medium">Preparing for Delivery</p>
                <p className="text-sm text-gray-500">Estimated delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            {orderDetails.items.map((item) => (
              <div key={item._id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="space-y-2">
            <p className="font-medium">{orderDetails.address.name}</p>
            <p>{orderDetails.address.street}</p>
            <p>{`${orderDetails.address.city}, ${orderDetails.address.state} ${orderDetails.address.zipcode}`}</p>
            <p>{orderDetails.address.country}</p>
            <p>Phone: {orderDetails.address.phone}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{orderDetails.amount - orderDetails.delivery_fee}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{orderDetails.delivery_fee}</span>
            </div>
            {orderDetails.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{orderDetails.discount}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{orderDetails.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess; 
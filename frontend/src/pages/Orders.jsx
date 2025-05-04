import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaBox, FaTruck, FaCheck, FaSearch } from 'react-icons/fa';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const Orders = () => {
  const { backendUrl, token, currency, navigate, products } = useContext(ShopContext);
  const [orderData, setorderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'shipped':
        return 'text-purple-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheck className="w-5 h-5" />;
      case 'processing':
        return <FaBox className="w-5 h-5" />;
      case 'shipped':
        return <FaTruck className="w-5 h-5" />;
      default:
        return <FaBox className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Title title="My Orders" />
        
        {orderData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No orders found</p>
            <Link 
              to="/collection" 
              className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orderData.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Preview</h4>
                    <div className="flex items-center gap-4">
                      {order.items[0] && (
                        <div className="w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <img 
                            src={order.items[0].image} 
                            alt={order.items[0].name || 'Product image'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.items[0]?.name || 'Product'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Details</h4>
                        <p className="text-sm text-gray-600">Total Items: {order.items.length}</p>
                        <p className="text-sm text-gray-600">Total Amount: {currency}{order.totalAmount}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Delivery Address</h4>
                        {order.shippingAddress ? (
                          <>
                            <p className="text-sm text-gray-600">{order.shippingAddress.street || 'No street address'}</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.city || 'No city'}, {order.shippingAddress.state || 'No state'} {order.shippingAddress.zipcode || 'No zipcode'}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">No delivery address available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/track-order/${order._id}`}
                      className="group relative inline-flex items-center px-8 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-lg overflow-hidden transition-all duration-300 hover:bg-pink-600 hover:text-white"
                    >
                      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                      <FaSearch className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                      <span className="relative text-base font-semibold tracking-wide">Track Order</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

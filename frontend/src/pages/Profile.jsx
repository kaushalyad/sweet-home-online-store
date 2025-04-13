import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaShoppingBag, FaHeart, FaCog, FaArrowRight } from 'react-icons/fa';

const Profile = () => {
  const { backendUrl, token, currency, products, wishlistItems, addToCart, removeFromWishlist } = useContext(ShopContext);
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: 'Sweet Home Customer',
    email: 'customer@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, India',
    joinedDate: 'January 2023',
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Set active tab based on current route
  useEffect(() => {
    if (location.pathname === '/wishlist') {
      setActiveTab('wishlist');
    } else if (location.pathname === '/settings') {
      setActiveTab('settings');
    } else if (location.pathname === '/orders') {
      setActiveTab('orders');
    } else {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  // Fetch user data and recent orders
  useEffect(() => {
    // This would be replaced with actual API calls once implemented
    // For now using placeholder data
    setRecentOrders([
      {
        id: 'ORD12345',
        date: new Date('2023-05-15'),
        status: 'Delivered',
        total: 1250,
        items: 3
      },
      {
        id: 'ORD12346',
        date: new Date('2023-06-02'),
        status: 'Processing',
        total: 850,
        items: 2
      }
    ]);
  }, [token]);

  const profileItems = [
    { id: 'profile', label: 'Profile Information', icon: <FaUser /> },
    { id: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FaHeart /> },
    { id: 'settings', label: 'Account Settings', icon: <FaCog /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-50 p-2 rounded-full mr-4">
                    <FaUser className="text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-full mr-4">
                    <FaEnvelope className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-full mr-4">
                    <FaPhone className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">{userData.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-50 p-2 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium text-gray-800">{userData.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-50 p-2 rounded-full mr-4">
                    <FaCalendarAlt className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Since</p>
                    <p className="font-medium text-gray-800">{userData.joinedDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300">
                Edit Profile
              </button>
            </div>
          </motion.div>
        );
        
      case 'orders':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <Link 
                to="/orders" 
                className="text-pink-500 hover:text-pink-700 flex items-center transition-colors duration-300"
              >
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date.toDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{currency}{order.total}</p>
                        <p className="text-sm">{order.items} items</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          order.status === 'Delivered' ? 'bg-green-500' : 
                          order.status === 'Processing' ? 'bg-blue-500' : 
                          order.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">{order.status}</span>
                      </div>
                      <Link 
                        to={`/order/${order.id}`} 
                        className="text-sm text-gray-700 hover:text-black transition-colors duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FaShoppingBag className="mx-auto text-gray-300 text-4xl mb-4" />
                <p className="text-gray-600 mb-2">You haven't placed any orders yet</p>
                <Link 
                  to="/collection" 
                  className="inline-block mt-3 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </motion.div>
        );
        
      case 'wishlist':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">My Wishlist</h3>
              <Link 
                to="/collection" 
                className="text-pink-500 hover:text-pink-700 flex items-center transition-colors duration-300"
              >
                Browse More <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            {wishlistItems && wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlistItems.map((productId) => {
                  const product = products.find(p => p._id === productId);
                  if (!product) return null;
                  
                  return (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative">
                        <Link to={`/collection/${product._id}`}>
                          <img 
                            src={product.image[0]} 
                            alt={product.name} 
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                          aria-label="Remove from wishlist"
                        >
                          <FaHeart className="text-red-500" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <Link 
                          to={`/collection/${product._id}`}
                          className="hover:text-pink-500 transition-colors duration-300"
                        >
                          <h4 className="font-medium text-gray-800 line-clamp-1">{product.name}</h4>
                        </Link>
                        <p className="font-bold text-gray-900 mt-2">
                          <span className="text-xs text-gray-500 mr-1">{currency}</span>
                          <span>{product.price}</span>
                        </p>
                        
                        <div className="mt-4 flex justify-between">
                          <button
                            onClick={() => addToCart(product._id, product.sizes[0])}
                            className="bg-black text-white text-xs px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors"
                          >
                            ADD TO CART
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="text-gray-500 text-xs hover:text-gray-700 transition-colors duration-300"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FaHeart className="mx-auto text-gray-300 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Save your favorite products to your wishlist and they'll be here waiting for you.
                </p>
                <Link 
                  to="/collection" 
                  className="inline-block px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                >
                  Browse Collection
                </Link>
              </div>
            )}
          </motion.div>
        );
        
      case 'settings':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-6 rounded-lg shadow-sm text-center py-12"
          >
            <FaCog className="mx-auto text-gray-300 text-4xl mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Account Settings Coming Soon</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We're developing account settings to give you more control over your Sweet Home experience.
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-12 border-t">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title text1={"MY"} text2={"ACCOUNT"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4"></div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1"
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold">
                {userData.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{userData.name}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              {profileItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors duration-300 ${
                    activeTab === item.id 
                      ? 'bg-pink-50 text-pink-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Area */}
        <div className="md:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile; 
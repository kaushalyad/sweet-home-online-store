import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaShoppingBag, FaHeart, FaCog, FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";

const Profile = () => {
  const { backendUrl, token, currency, products, wishlistItems, addToCart, removeFromWishlist } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    createdAt: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    notificationSettings: {}
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotionalOffers: true,
    newArrivals: true
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/wishlist')) {
      setActiveTab('wishlist');
    } else if (path.includes('/settings')) {
      setActiveTab('settings');
    } else if (path.includes('/orders')) {
      setActiveTab('orders');
    } else {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  // Fetch user data and recent orders
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }
        
        setIsLoading(true);
        const response = await axios.get(
          backendUrl + '/api/user/profile', 
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          const userData = response.data.user;
          setUserData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || 'Not provided',
            address: userData.address || 'Not provided',
            createdAt: userData.createdAt || new Date(),
            isEmailVerified: userData.isEmailVerified || false,
            isPhoneVerified: userData.isPhoneVerified || false,
            notificationSettings: userData.notificationSettings || {
              orderUpdates: true,
              promotionalOffers: true,
              newArrivals: true
            }
          });

          // Set notification settings if available
          if (userData.notificationSettings) {
            setNotificationSettings(userData.notificationSettings);
          }
        } else {
          toast.error(response.data.message || 'Failed to fetch profile data');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch profile data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        if (!token) return;
        
        const response = await axios.post(
          backendUrl + '/api/order/userorders', 
          {}, 
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          // Transform orders data to match the required format
          const transformedOrders = response.data.orders.map(order => ({
            id: order._id,
            date: new Date(order.date),
            status: order.status,
            total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            items: order.items.length,
            payment: order.payment,
            paymentMethod: order.paymentMethod
          }));
          setRecentOrders(transformedOrders);
        } else {
          toast.error(response.data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to fetch orders. Please try again.');
        }
      }
    };

    fetchUserData();
    fetchOrders();
  }, [token, backendUrl, navigate]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case 'profile':
        navigate('/profile');
        break;
      case 'orders':
        navigate('/orders');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        navigate('/profile');
    }
  };

  const profileItems = [
    { id: 'profile', label: 'Profile Information', icon: <FaUser /> },
    { id: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FaHeart /> },
    { id: 'settings', label: 'Account Settings', icon: <FaCog /> },
  ];

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Lowercase letter');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Uppercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Special character');

    return { score, feedback };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleUpdatePersonalInfo = async () => {
    try {
      setIsUpdating(true);
      const response = await axios.put(
        backendUrl + '/api/user/profile',
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Personal information updated successfully');
        // Update local state with the response data
        if (response.data.user) {
          setUserData(prev => ({
            ...prev,
            ...response.data.user
          }));
        }
      } else {
        toast.error(response.data.message || 'Failed to update information');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast.error('Failed to update personal information');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await axios.post(
        backendUrl + '/api/user/update-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      setIsUpdating(true);
      const response = await axios.post(
        backendUrl + '/api/user/update-notifications',
        notificationSettings,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Notification preferences updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadData = async () => {
    try {
      const response = await axios.get(
        backendUrl + '/api/user/download-data',
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'account-data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download account data');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await axios.post(
          backendUrl + '/api/user/delete-account',
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success('Account deleted successfully');
          navigate('/');
        } else {
          toast.error(response.data.message || 'Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <ProfileSkeleton />;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-50 p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <FaUser className="text-pink-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base break-words">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <FaEnvelope className="text-blue-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base break-all">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-50 p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <FaPhone className="text-green-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {userData.phone && userData.phone !== '' ? userData.phone : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-50 p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <FaMapMarkerAlt className="text-purple-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base break-words">
                      {userData.address && userData.address !== '' ? userData.address : 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-orange-50 p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                    <FaCalendarAlt className="text-orange-500 text-sm sm:text-base" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Customer Since</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 border-t border-gray-100 pt-4 sm:pt-6">
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-sm sm:text-base"
              >
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
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-[#dbdbdb] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium text-[#212121]">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-[#878787]">{order.date.toDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#212121]">{currency}{order.total}</p>
                        <p className="text-sm text-[#878787]">{order.items} items</p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex-shrink-0 w-16 h-16 border border-[#dbdbdb] rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#dbdbdb]">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          order.status === 'Delivered' ? 'bg-green-500' : 
                          order.status === 'Processing' ? 'bg-blue-500' : 
                          order.status === 'Cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium text-[#212121]">{order.status}</span>
                      </div>
                      <Link 
                        to={`/track-order/${order.id}`} 
                        className="px-4 py-2 bg-[#2874f0] text-white rounded-md hover:bg-[#1a5dc8] transition-colors duration-300 text-sm"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#f5f5f5] rounded-lg">
                <FaShoppingBag className="mx-auto text-[#878787] text-4xl mb-4" />
                <p className="text-[#212121] mb-2">You haven&apos;t placed any orders yet</p>
                <Link 
                  to="/collection" 
                  className="inline-block mt-3 px-6 py-2 bg-[#2874f0] text-white rounded-sm hover:bg-[#1a5dc8] transition-colors duration-300"
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
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">My Wishlist</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {wishlistItems?.length ? `${wishlistItems.length} saved item${wishlistItems.length > 1 ? 's' : ''}` : 'Save items you love for later'}
                </p>
              </div>
              <Link 
                to="/collection" 
                className="text-pink-600 hover:text-pink-700 flex items-center transition-colors duration-300 font-semibold"
              >
                Browse More <FaArrowRight className="ml-2" />
              </Link>
            </div>
            
            {wishlistItems && wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {wishlistItems.map((productId) => {
                  const product = products.find(p => p._id === productId);
                  if (!product) return null;
                  
                  return (
                    <motion.div 
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="group border border-gray-200/70 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="relative aspect-[4/3] bg-gray-50">
                        <Link to={`/collection/${product._id}`}>
                          <img 
                            src={product.image[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Remove this item from your wishlist?')) {
                              removeFromWishlist(product._id);
                            }
                          }}
                          className="absolute top-3 right-3 bg-white/95 backdrop-blur p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-pink-50 border border-gray-200/60"
                          aria-label="Remove from wishlist"
                        >
                          <FaHeart className="text-pink-500" />
                        </button>
                      </div>
                      
                      <div className="p-4 sm:p-5">
                        <Link 
                          to={`/collection/${product._id}`}
                          className="hover:text-pink-600 transition-colors duration-300"
                        >
                          <h4 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem] leading-snug">
                            {product.name}
                          </h4>
                        </Link>
                        <div className="flex items-center justify-between mt-3">
                          <p className="font-extrabold text-gray-900">
                            <span className="text-xs text-gray-500 mr-1">{currency}</span>
                            <span className="text-lg">{product.price}</span>
                          </p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <FaHeart className="text-gray-300" />
                            <span className="font-semibold text-gray-800">{Number(product.rating || 0).toFixed(1)}</span>
                            <span className="text-gray-500">({Number(product.totalReviews || 0)})</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col gap-2.5">
                          <button
                            onClick={() => {
                              addToCart(product._id, 1);
                              toast.success("Added to cart!");
                            }}
                            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <FaShoppingCart className="text-sm" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Remove this item from your wishlist?')) {
                                removeFromWishlist(product._id);
                              }
                            }}
                            className="w-full text-gray-600 text-sm hover:text-gray-900 transition-colors duration-300 py-2 rounded-xl hover:bg-gray-50 border border-gray-200"
                          >
                            Remove from Wishlist
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-14 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-md mb-5 flex items-center justify-center">
                  <FaHeart className="text-white text-xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">Your Wishlist is Empty</h3>
                <p className="text-gray-600 mb-7 max-w-md mx-auto text-sm sm:text-base">
                  Save your favorite products to your wishlist and they'll be here waiting for you.
                </p>
                <Link 
                  to="/collection" 
                  className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:from-pink-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                >
                  Browse Collection <FaArrowRight />
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
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#212121] mb-6">Account Settings</h3>
            
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="border border-[#dbdbdb] rounded-lg p-6">
                <h4 className="text-lg font-medium text-[#212121] mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Delivery Address</label>
                    <textarea
                      name="address"
                      value={userData.address}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter your delivery address"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleUpdatePersonalInfo}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-[#2874f0] text-white rounded-md hover:bg-[#1a5dc8] transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Change Password */}
              <div className="border border-[#dbdbdb] rounded-lg p-6">
                <h4 className="text-lg font-medium text-[#212121] mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.score <= 2 ? 'bg-red-500' :
                                passwordStrength.score <= 3 ? 'bg-yellow-500' :
                                passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score <= 2 ? 'text-red-500' :
                            passwordStrength.score <= 3 ? 'text-yellow-500' :
                            passwordStrength.score <= 4 ? 'text-blue-500' : 'text-green-500'
                          }`}>
                            {passwordStrength.score <= 2 ? 'Weak' :
                             passwordStrength.score <= 3 ? 'Fair' :
                             passwordStrength.score <= 4 ? 'Good' : 'Strong'}
                          </span>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="text-xs text-gray-600">
                            <p className="mb-1">Password should include:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {passwordStrength.feedback.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#212121] mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-[#dbdbdb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-[#2874f0] text-white rounded-md hover:bg-[#1a5dc8] transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="border border-[#dbdbdb] rounded-lg p-6">
                <h4 className="text-lg font-medium text-[#212121] mb-4">Notification Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-[#212121]">Order Updates</h5>
                      <p className="text-sm text-[#878787]">Get notified about your order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.orderUpdates}
                        onChange={() => handleNotificationToggle('orderUpdates')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2874f0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2874f0]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-[#212121]">Promotional Offers</h5>
                      <p className="text-sm text-[#878787]">Receive updates about special offers and discounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.promotionalOffers}
                        onChange={() => handleNotificationToggle('promotionalOffers')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2874f0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2874f0]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-[#212121]">New Arrivals</h5>
                      <p className="text-sm text-[#878787]">Get notified about new products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notificationSettings.newArrivals}
                        onChange={() => handleNotificationToggle('newArrivals')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2874f0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2874f0]"></div>
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={handleUpdateNotifications}
                    disabled={isUpdating}
                    className="px-6 py-2 bg-[#2874f0] text-white rounded-md hover:bg-[#1a5dc8] transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Sweet Home Online Store</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://sweethome-store.com/profile" />
      </Helmet>
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <Title text1={"MY"} text2={"ACCOUNT"} />
            <div className="w-20 h-1 bg-[#2874f0] mx-auto mt-4"></div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sticky top-4">
              {!isLoading && (
                <>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 pb-6 border-b">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#2874f0] bg-opacity-10 rounded-full flex items-center justify-center text-[#2874f0] font-bold text-lg sm:text-xl flex-shrink-0">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#212121] truncate">{userData.name}</p>
                      <p className="text-xs sm:text-sm text-[#878787] truncate">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {profileItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-left transition-colors duration-300 text-sm sm:text-base ${
                          activeTab === item.id 
                            ? 'bg-[#2874f0] bg-opacity-10 text-[#2874f0] font-medium'
                            : 'text-[#212121] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base sm:text-lg flex-shrink-0">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile; 
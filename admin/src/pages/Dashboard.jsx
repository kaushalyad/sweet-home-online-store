import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaShoppingCart, FaRupeeSign, FaUsers, FaChartLine, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: [],
    salesByCategory: []
  });
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year, all

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In a real scenario, this would be a single API call to get all dashboard data
      // For this demo, we'll mock the data with what we have available
      
      // Fetch products
      const productsResponse = await axios.get(`${backendUrl}/api/product/list`);
      
      // Fetch orders (if available, otherwise mock)
      let ordersResponse;
      try {
        ordersResponse = await axios.get(`${backendUrl}/api/orders/list`, { 
          headers: { token } 
        });
      } catch (error) {
        // Mock orders data if endpoint doesn't exist
        ordersResponse = { 
          data: { 
            success: true, 
            orders: mockOrders 
          } 
        };
      }
      
      if (productsResponse.data.success) {
        const products = productsResponse.data.products;
        const orders = ordersResponse.data.success ? ordersResponse.data.orders : [];
        
        // Process the data
        processData(products, orders);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching dashboard data");
      
      // Set mock data for demonstration
      setStats({
        totalProducts: 45,
        totalOrders: 324,
        totalRevenue: 128750,
        pendingOrders: 12,
        recentOrders: mockOrders.slice(0, 5),
        topProducts: mockTopProducts,
        salesByCategory: mockSalesByCategory
      });
    } finally {
      setLoading(false);
    }
  };

  // Process data for dashboard
  const processData = (products, orders) => {
    // Calculate basic stats
    const totalProducts = products.length;
    
    // Filter orders based on time range
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange);
    
    const totalOrders = filteredOrders.length;
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
    
    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);
    
    // Get recent orders
    const recentOrders = [...filteredOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    // Calculate top selling products
    const topProducts = calculateTopProducts(products, filteredOrders);
    
    // Calculate sales by category
    const salesByCategory = calculateSalesByCategory(products, filteredOrders);
    
    setStats({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      topProducts,
      salesByCategory
    });
  };
  
  // Filter orders based on time range
  const filterOrdersByTimeRange = (orders, range) => {
    if (range === 'all') return orders;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= now;
    });
  };
  
  // Calculate top selling products
  const calculateTopProducts = (products, orders) => {
    // In a real scenario, we would calculate this from order items
    // For this demo, we'll return mock data
    return mockTopProducts;
  };
  
  // Calculate sales by category
  const calculateSalesByCategory = (products, orders) => {
    // In a real scenario, we would calculate this from order items and product categories
    // For this demo, we'll return mock data
    return mockSalesByCategory;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `${currency}${amount.toLocaleString()}`;
  };
  
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-md text-sm ${timeRange === 'week' 
              ? 'bg-pink-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-md text-sm ${timeRange === 'month' 
              ? 'bg-pink-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-md text-sm ${timeRange === 'year' 
              ? 'bg-pink-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Last Year
          </button>
          <button 
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 rounded-md text-sm ${timeRange === 'all' 
              ? 'bg-pink-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            All Time
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full p-3 bg-pink-100 mr-4">
                <FaBoxOpen className="text-pink-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold">{stats.totalProducts}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full p-3 bg-blue-100 mr-4">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                {stats.pendingOrders > 0 && (
                  <span className="text-xs text-orange-500">{stats.pendingOrders} pending</span>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full p-3 bg-green-100 mr-4">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full p-3 bg-purple-100 mr-4">
                <FaChartLine className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-semibold">
                  {stats.totalOrders > 0 
                    ? formatCurrency(stats.totalRevenue / stats.totalOrders) 
                    : formatCurrency(0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <FaShoppingCart className="mr-2 text-pink-600" /> Recent Orders
                </h2>
              </div>
              
              {stats.recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Customer</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentOrders.map((order) => (
                        <tr key={order._id || order.id}>
                          <td className="px-4 py-2 text-sm">#{order._id || order.id}</td>
                          <td className="px-4 py-2 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm">{order.customerName}</td>
                          <td className="px-4 py-2 text-sm">{formatCurrency(order.totalAmount)}</td>
                          <td className="px-4 py-2 text-sm">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium
                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                              `}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Top Selling Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 flex items-center">
                  <FaChartBar className="mr-2 text-pink-600" /> Top Selling Products
                </h2>
              </div>
              
              <div className="space-y-4">
                {stats.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-800">{product.name}</div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{product.sold} sold</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{formatCurrency(product.revenue)}</span>
                      </div>
                    </div>
                    <div 
                      className="h-2 rounded-full bg-gray-200 w-16"
                      title={`${product.percentage}% of total revenue`}
                    >
                      <div 
                        className="h-2 rounded-full bg-pink-500" 
                        style={{ width: `${product.percentage}%` }} 
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sales by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-800 flex items-center">
                <FaChartPie className="mr-2 text-pink-600" /> Sales by Category
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-700">Category</div>
                  <div className="text-sm font-medium text-gray-700">Revenue</div>
                </div>
                
                {stats.salesByCategory.map((category) => (
                  <div key={category.id} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-gray-600">{category.name}</div>
                      <div className="text-sm font-medium">{formatCurrency(category.revenue)}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-pink-600 h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs h-48 relative">
                  {/* Simple representation of a pie chart */}
                  <div className="absolute inset-0 rounded-full border-8 border-pink-500 opacity-20"></div>
                  <div className="absolute inset-0 border-t-8 border-r-8 border-pink-600 rounded-full" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 0)' }}></div>
                  <div className="absolute inset-0 border-b-8 border-l-8 border-pink-400 rounded-full" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%, 0 0)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">{stats.totalOrders}</div>
                      <div className="text-sm text-gray-500">Total Orders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Mock data for demonstration
const mockOrders = [
  { 
    _id: 'ORD123456', 
    id: 'ORD123456',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Rahul Sharma',
    totalAmount: 2500,
    status: 'completed'
  },
  { 
    _id: 'ORD123457', 
    id: 'ORD123457',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Priya Patel',
    totalAmount: 1800,
    status: 'processing'
  },
  { 
    _id: 'ORD123458', 
    id: 'ORD123458',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    customerName: 'Amit Singh',
    totalAmount: 3200,
    status: 'pending'
  },
  { 
    _id: 'ORD123459', 
    id: 'ORD123459',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Deepa Gupta',
    totalAmount: 1250,
    status: 'completed'
  },
  { 
    _id: 'ORD123460', 
    id: 'ORD123460',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Vikram Joshi',
    totalAmount: 4500,
    status: 'completed'
  }
];

const mockTopProducts = [
  {
    id: 1,
    name: 'Kaju Barfi',
    image: 'https://img.freepik.com/free-photo/kaju-katli-barfi-kaju-katli-is-indian-dessert-sweet-made-with-cashew-nuts-sugar-diwali-food_466689-10640.jpg',
    sold: 145,
    revenue: 28750,
    percentage: 80
  },
  {
    id: 2,
    name: 'Rasgulla',
    image: 'https://img.freepik.com/free-photo/rasgulla-famous-bengali-sweet-cheese-balls-soaked-sugar-syrup-served-bowl-moody-background-selective-focus_466689-74236.jpg',
    sold: 130,
    revenue: 26000,
    percentage: 70
  },
  {
    id: 3,
    name: 'Gulab Jamun',
    image: 'https://img.freepik.com/free-photo/gulab-jamun-traditional-indian-dessert-dark-surface_114579-14482.jpg',
    sold: 95,
    revenue: 19000,
    percentage: 50
  },
  {
    id: 4,
    name: 'Soan Papdi',
    image: 'https://img.freepik.com/free-photo/overhead-view-sweet-food-brown-wooden-surface_114579-89523.jpg',
    sold: 85,
    revenue: 17000,
    percentage: 45
  }
];

const mockSalesByCategory = [
  {
    id: 1,
    name: 'Traditional Sweets',
    revenue: 48500,
    percentage: 40
  },
  {
    id: 2,
    name: 'Milk-based Sweets',
    revenue: 36000,
    percentage: 30
  },
  {
    id: 3,
    name: 'Dry Fruit Sweets',
    revenue: 24000,
    percentage: 20
  },
  {
    id: 4,
    name: 'Bengali Sweets',
    revenue: 12000,
    percentage: 10
  }
];

export default Dashboard; 
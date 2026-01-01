import React from 'react'
import { useEffect } from 'react'
import { useState, useContext } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { backendUrl, currency } from '../config'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { FaSnowflake, FaGift, FaHandHoldingHeart, FaDoorClosed, FaBox, FaBan } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [socket, setSocket] = useState(null)
  const [newOrderNotifications, setNewOrderNotifications] = useState([])
  const { token } = useContext(AuthContext)

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error('Please login again')
      return
    }

    try {
      const response = await axios.get(
        backendUrl + '/api/order/list', 
        { 
          headers: { 
            Authorization: `Bearer ${token}`
          } 
        }
      )
      if (response.data.success) {
        // Ensure each order has an _id field
        const ordersWithIds = response.data.orders.map(order => ({
          ...order,
          _id: order._id || order.id // Handle both _id and id fields
        }))
        setOrders(ordersWithIds.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching orders')
    }
  }

  const fetchRecentNotifications = async () => {
    if (!token) return

    try {
      const response = await axios.get(
        backendUrl + '/api/order/recent-notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.success) {
        setNewOrderNotifications(response.data.notifications)
      }
    } catch (error) {
      console.error('Error fetching recent notifications:', error)
    }
  }

  const statusHandler = async (event, orderId) => {
    if (!token) {
      toast.error('Please login again')
      return
    }

    if (!orderId) {
      toast.error('Invalid order ID')
      return
    }

    try {
      const response = await axios.put(
        backendUrl + '/api/order/status/' + orderId, 
        { status: event.target.value }, 
        { 
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.data.success) {
        await fetchAllOrders()
        toast.success(`Order status updated to ${event.target.value}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating order status')
    }
  }

  const handleRefundStatusUpdate = async (orderId, refundStatus) => {
    if (!token) {
      toast.error('Please login again')
      return
    }

    try {
      const response = await axios.put(
        backendUrl + '/api/order/refund/' + orderId,
        { refundStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (response.data.success) {
        await fetchAllOrders()
        toast.success(`Refund status updated to ${refundStatus}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating refund status')
    }
  }

  useEffect(() => {
    fetchAllOrders()
    fetchRecentNotifications()
  }, [token])

  // Real-time order notifications
  useEffect(() => {
    if (token) {
      const socketConnection = io('http://localhost:4000', {
        auth: {
          token: token
        }
      });

      socketConnection.on('connect', () => {
        console.log('Connected to real-time order notifications');
        socketConnection.emit('join-admin-room');
      });

      socketConnection.on('new-order', (orderData) => {
        console.log('New order received:', orderData);
        
        // Add to notifications
        setNewOrderNotifications(prev => [orderData, ...prev.slice(0, 9)]); // Keep last 10
        
        // Show toast notification
        toast.success(`New order received! ₹${orderData.totalAmount} from ${orderData.customerName}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Refresh orders list
        fetchAllOrders();
      });

      socketConnection.on('disconnect', () => {
        console.log('Disconnected from real-time order notifications');
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [token]);

  // Filter orders based on selection
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => {
        if (filter === 'pending') return !order.payment;
        if (filter === 'processing') return ['Order Placed', 'Processing', 'Preparing', 'Packing'].includes(order.status);
        if (filter === 'shipping') return ['Shipped', 'Out for delivery'].includes(order.status);
        if (filter === 'delivered') return order.status === 'Delivered';
        return true;
      });

  // Check if an order contains perishable items (milk-based sweets)
  const hasPerishableItems = (items) => {
    if (!items || !Array.isArray(items)) return false;
    return items.some(item => {
      if (!item || !item.name) return false;
      const name = item.name.toLowerCase();
      return name.includes('rasgulla') || name.includes('gulab') || 
             name.includes('jalebi') || name.includes('milk') ||
             name.includes('peda') || name.includes('dahi');
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Orders Management</h2>
        
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Orders</option>
            <option value="pending">Payment Pending</option>
            <option value="processing">Processing</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <button 
            onClick={fetchAllOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Real-time Order Notifications */}
      {newOrderNotifications.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaBox className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                New Orders ({newOrderNotifications.length})
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <div className="space-y-1">
                  {newOrderNotifications.slice(0, 3).map((notification, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>
                        ₹{notification.totalAmount} - {notification.customerName}
                      </span>
                      <span className="text-xs">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found matching your filter criteria
        </div>
      ) : (
        filteredOrders.map((order, index) => {
          const isCancelled = order.status === 'Cancelled' || order.status === 'cancelled';
          
          return (
          <div 
            className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 ${
              isCancelled 
                ? 'border-red-300 bg-red-50/50 opacity-75' 
                : hasPerishableItems(order.items) 
                  ? 'border-pink-200 bg-pink-50' 
                  : 'border-gray-200'
            } p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 ${
              isCancelled ? 'relative' : ''
            }`} 
            key={index}
          >
            {isCancelled && (
              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                <FaBan className="w-3 h-3" />
                CANCELLED
              </div>
            )}
            <div className="flex items-center justify-center">
              <FaBox className={`w-4 h-4 ${
                isCancelled ? 'text-red-400' : 'text-gray-600'
              }`} />
            </div>
            <div className={isCancelled ? 'opacity-70' : ''}>
              <div className={isCancelled ? 'line-through' : ''}>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                  }
                  else {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.shippingAddress.firstName + " " + order.shippingAddress.lastName}</p>
              <div>
                <p>{order.shippingAddress.street},</p>
                <p>{order.shippingAddress.city + ", " + order.shippingAddress.state + ", " + order.shippingAddress.country + ", " + order.shippingAddress.zipCode}</p>
              </div>
              <p>{order.shippingAddress.phone}</p>

              {/* Special Requirements */}
              {order.shippingAddress.specialRequirements && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium mb-1">Special Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.shippingAddress.specialRequirements.coldPacking && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        <FaSnowflake className="mr-1 w-4 h-4" /> Cold Packing
                      </span>
                    )}
                    {order.shippingAddress.specialRequirements.giftWrapping && (
                      <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        <FaGift className="mr-1 w-4 h-4" /> Gift Wrapped
                      </span>
                    )}
                    {order.shippingAddress.specialRequirements.fragileHandling && (
                      <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        <FaHandHoldingHeart className="mr-1 w-4 h-4" /> Fragile
                      </span>
                    )}
                    {order.shippingAddress.specialRequirements.noContact && (
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        <FaDoorClosed className="mr-1 w-4 h-4" /> No Contact
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Instructions */}
              {order.shippingAddress.deliveryInstructions && (
                <div className="mt-2">
                  <p className="font-medium">Instructions:</p>
                  <p className="text-gray-600 italic">{order.shippingAddress.deliveryInstructions}</p>
                </div>
              )}
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: <span className={order.payment ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {order.payment ? 'Completed' : 'Pending'}
              </span></p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Time: {new Date(order.date).toLocaleTimeString()}</p>
            </div>
            <p className='text-sm sm:text-[15px] font-bold'>{currency}{order.amount}</p>
            <div>
              <select 
                onChange={(event)=>statusHandler(event,order._id)} 
                value={order.status} 
                disabled={isCancelled}
                className={`p-2 font-semibold w-full rounded ${
                  order.status === 'Delivered' ? 'bg-green-100' : 
                  order.status === 'Cancelled' ? 'bg-red-200 text-red-800 cursor-not-allowed line-through' :
                  order.status === 'Out for delivery' ? 'bg-blue-100' :
                  'bg-amber-50'
                }`}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="Preparing">Preparing Fresh</option>
                <option value="Packing">Packing</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {hasPerishableItems(order.items) && (
                <div className="mt-2 bg-pink-100 p-2 rounded text-xs text-pink-800">
                  Contains perishable items - prioritize delivery
                </div>
              )}

              {/* Refund Status Management for Cancelled Orders */}
              {isCancelled && order.refund && order.refund.status !== 'none' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Refund Status</p>
                  <select
                    value={order.refund.status}
                    onChange={(e) => handleRefundStatusUpdate(order._id, e.target.value)}
                    className={`w-full p-2 text-xs font-semibold rounded border ${
                      order.refund.status === 'completed' 
                        ? 'bg-green-100 border-green-300 text-green-800' 
                        : order.refund.status === 'pending'
                          ? 'bg-yellow-100 border-yellow-300 text-yellow-800'
                          : order.refund.status === 'processing'
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-red-100 border-red-300 text-red-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                  {order.refund.amount && (
                    <p className="text-xs text-gray-600 mt-2">
                      Amount: <span className="font-bold text-blue-700">₹{order.refund.amount}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )})
      )}
    </div>
  )
}

export default Orders
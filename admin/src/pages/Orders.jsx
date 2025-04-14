import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { FaSnowflake, FaGift, FaHandHoldingHeart, FaDoorClosed } from 'react-icons/fa'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
        toast.success(`Order status updated to ${event.target.value}`)
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

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
    return items.some(item => {
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

      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No orders found matching your filter criteria
        </div>
      ) : (
        filteredOrders.map((order, index) => (
          <div 
            className={`grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 ${
              hasPerishableItems(order.items) ? 'border-pink-200 bg-pink-50' : 'border-gray-200'
            } p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700`} 
            key={index}
          >
            <img className='w-12' src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                  }
                  else {
                    return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
              <div>
                <p>{order.address.street || order.address.address},</p>
                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + (order.address.zipcode || order.address.zipCode)}</p>
              </div>
              <p>{order.address.phone}</p>

              {/* Special Requirements */}
              {order.address.specialRequirements && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium mb-1">Special Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.address.specialRequirements.coldPacking && (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        <FaSnowflake className="mr-1" /> Cold Packing
                      </span>
                    )}
                    {order.address.specialRequirements.giftWrapping && (
                      <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        <FaGift className="mr-1" /> Gift Wrapped
                      </span>
                    )}
                    {order.address.specialRequirements.fragileHandling && (
                      <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        <FaHandHoldingHeart className="mr-1" /> Fragile
                      </span>
                    )}
                    {order.address.specialRequirements.noContact && (
                      <span className="inline-flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        <FaDoorClosed className="mr-1" /> No Contact
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Instructions */}
              {order.address.deliveryInstructions && (
                <div className="mt-2">
                  <p className="font-medium">Instructions:</p>
                  <p className="text-gray-600 italic">{order.address.deliveryInstructions}</p>
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
                className={`p-2 font-semibold w-full rounded ${
                  order.status === 'Delivered' ? 'bg-green-100' : 
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
              </select>

              {hasPerishableItems(order.items) && (
                <div className="mt-2 bg-pink-100 p-2 rounded text-xs text-pink-800">
                  Contains perishable items - prioritize delivery
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Orders
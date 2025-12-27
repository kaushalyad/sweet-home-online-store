import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import { 
  placeOrder, 
  placeOrderStripe, 
  placeOrderRazorpay, 
  allOrders, 
  userOrders, 
  updateStatus, 
  verifyStripe, 
  verifyRazorpay, 
  createOrder, 
  trackOrder, 
  cancelOrder, 
  updateOrderStatus, 
  listOrders, 
  getOrderDetails 
} from '../controllers/orderController.js'

const orderRouter = express.Router()

// Public routes
orderRouter.post('/', protect, placeOrder)
orderRouter.post('/place', protect, placeOrder)

// Protected user routes
orderRouter.get('/my-orders', protect, userOrders)
orderRouter.get('/user-orders', protect, userOrders)
orderRouter.get('/userorders', protect, userOrders)
orderRouter.post('/userorders', protect, userOrders)
orderRouter.get('/track/:orderId', protect, trackOrder)
orderRouter.get('/details/:orderId', protect, getOrderDetails)
orderRouter.post('/cancel/:orderId', protect, cancelOrder)

// Payment Features
orderRouter.post('/stripe', protect, placeOrderStripe)
orderRouter.post('/razorpay', protect, placeOrderRazorpay)
orderRouter.post('/verify-stripe', protect, verifyStripe)
orderRouter.post('/verify-razorpay', protect, verifyRazorpay)
orderRouter.post('/create', protect, createOrder)

// Protected admin routes (with admin middleware)
orderRouter.get('/list', protect, admin, listOrders)
orderRouter.post('/list', protect, admin, listOrders)
orderRouter.put('/status/:orderId', protect, admin, updateOrderStatus)
orderRouter.get('/recent-notifications', protect, admin, async (req, res) => {
  try {
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .select('userId totalAmount items paymentMethod createdAt shippingAddress');

    const notifications = recentOrders.map(order => ({
      orderId: order._id,
      userId: order.userId?._id,
      totalAmount: order.totalAmount,
      items: order.items?.length || 0,
      paymentMethod: order.paymentMethod,
      timestamp: order.createdAt,
      customerEmail: order.shippingAddress?.email,
      customerName: order.shippingAddress ? 
        `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 
        order.userId?.name || 'Unknown'
    }));

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default orderRouter
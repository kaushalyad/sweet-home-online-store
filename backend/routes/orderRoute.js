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

// Protected admin routes
orderRouter.use(protect, admin)
orderRouter.get('/list', listOrders)
orderRouter.post('/list', listOrders)
orderRouter.put('/status/:orderId', updateOrderStatus)

export default orderRouter
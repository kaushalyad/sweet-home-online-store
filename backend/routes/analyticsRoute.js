import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getUserBehavior,
  getPageVisits,
  getConversionRates,
  getSalesAnalytics,
  getProductPerformance,
  getCustomerSegments,
  getAllUserBehavior,
  getAnalytics,
  getPurchaseLocations
} from '../controllers/analyticsController.js';
import UserBehavior from '../models/userBehavior.js';
import Order from '../models/order.js';
import User from '../models/user.js';

const router = express.Router();

// Test endpoints (no auth required)
router.post('/create-test-orders', async (req, res) => {
  try {
    // Get or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });
    }

    // Sample locations in India
    const locations = [
      { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 }
    ];

    // Create test orders with different amounts
    const orders = await Promise.all([
      Order.create({
        userId: testUser._id,
        items: [{
          product: { name: 'Premium Sofa', price: 15000 },
          quantity: 1,
          price: 15000
        }],
        totalAmount: 15000,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          street: '123 Test St',
          city: locations[0].city,
          state: locations[0].state,
          country: 'India',
          zipCode: '400001',
          latitude: locations[0].lat,
          longitude: locations[0].lng
        },
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'completed'
      }),
      Order.create({
        userId: testUser._id,
        items: [{
          product: { name: 'Dining Table', price: 8000 },
          quantity: 1,
          price: 8000
        }],
        totalAmount: 8000,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          street: '456 Test St',
          city: locations[1].city,
          state: locations[1].state,
          country: 'India',
          zipCode: '110001',
          latitude: locations[1].lat,
          longitude: locations[1].lng
        },
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'completed'
      }),
      Order.create({
        userId: testUser._id,
        items: [{
          product: { name: 'Bed Frame', price: 3500 },
          quantity: 2,
          price: 7000
        }],
        totalAmount: 7000,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          street: '789 Test St',
          city: locations[2].city,
          state: locations[2].state,
          country: 'India',
          zipCode: '560001',
          latitude: locations[2].lat,
          longitude: locations[2].lng
        },
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'completed'
      }),
      Order.create({
        userId: testUser._id,
        items: [{
          product: { name: 'Coffee Table', price: 2500 },
          quantity: 1,
          price: 2500
        }],
        totalAmount: 2500,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          street: '101 Test St',
          city: locations[3].city,
          state: locations[3].state,
          country: 'India',
          zipCode: '500001',
          latitude: locations[3].lat,
          longitude: locations[3].lng
        },
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'completed'
      }),
      Order.create({
        userId: testUser._id,
        items: [{
          product: { name: 'Bookshelf', price: 1500 },
          quantity: 1,
          price: 1500
        }],
        totalAmount: 1500,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          street: '202 Test St',
          city: locations[4].city,
          state: locations[4].state,
          country: 'India',
          zipCode: '600001',
          latitude: locations[4].lat,
          longitude: locations[4].lng
        },
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'completed'
      })
    ]);

    res.json({
      success: true,
      message: `Created ${orders.length} test orders`,
      data: orders
    });
  } catch (error) {
    console.error('Error creating test orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test-purchase-locations', async (req, res) => {
  try {
    const orders = await Order.find({
      'shippingAddress.latitude': { $exists: true },
      'shippingAddress.longitude': { $exists: true },
      status: 'delivered'
    }).select('shippingAddress totalAmount createdAt status');

    // Group by city and state
    const locations = orders.reduce((acc, order) => {
      const key = `${order.shippingAddress.city}-${order.shippingAddress.state}`;
      if (!acc[key]) {
        acc[key] = {
          _id: key, // Add _id for React key prop
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          latitude: order.shippingAddress.latitude,
          longitude: order.shippingAddress.longitude,
          orderCount: 0,
          totalAmount: 0,
          lastPurchase: null
        };
      }
      acc[key].orderCount++;
      acc[key].totalAmount += order.totalAmount;
      if (!acc[key].lastPurchase || new Date(order.createdAt) > new Date(acc[key].lastPurchase)) {
        acc[key].lastPurchase = order.createdAt;
      }
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(locations)
    });
  } catch (error) {
    console.error('Error getting purchase locations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/add-test-locations', async (req, res) => {
  try {
    // Sample locations in India
    const locations = [
      { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 }
    ];

    // Get all delivered orders
    const orders = await Order.find({ status: 'delivered' });
    
    // Update each order with a random location
    for (const order of orders) {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      order.shippingAddress = {
        ...order.shippingAddress,
        city: randomLocation.city,
        state: randomLocation.state,
        latitude: randomLocation.lat,
        longitude: randomLocation.lng
      };
      await order.save();
    }

    res.json({
      success: true,
      message: `Updated ${orders.length} orders with sample location data`
    });
  } catch (error) {
    console.error('Error adding test locations:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// All other analytics routes are protected and admin-only
router.use(protect, admin);

// Helper function to get start date based on time range
export const getStartDate = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'day':
      return new Date(now.setDate(now.getDate() - 1));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setDate(now.getDate() - 7)); // Default to week
  }
};

// Analytics routes
router.get('/user-behavior', getUserBehavior);
router.get('/page-visits', getPageVisits);
router.get('/conversion-rates', getConversionRates);
router.get('/sales-analytics', getSalesAnalytics);
router.get('/product-performance', getProductPerformance);
router.get('/customer-segments', getCustomerSegments);
router.get('/all-behavior', getAllUserBehavior);
router.get('/purchase-locations', getPurchaseLocations);
router.get('/', getAnalytics);

// Track user interaction
router.post('/track-interaction', async (req, res) => {
  try {
    const { type, element, timestamp, details } = req.body;
    const userId = req.user?._id;

    await UserBehavior.findOneAndUpdate(
      { userId, timestamp: { $gte: new Date(Date.now() - 1000 * 60 * 30) } }, // Last 30 minutes
      {
        $push: {
          interactions: {
            type,
            element,
            timestamp: new Date(timestamp),
            details
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    res.status(500).json({ success: false, message: 'Error tracking interaction' });
  }
});

// Track session data
router.post('/track-session', async (req, res) => {
  try {
    const { scrollDepth, timeOnPage, interactions } = req.body;
    const userId = req.user?._id;

    await UserBehavior.findOneAndUpdate(
      { userId, timestamp: { $gte: new Date(Date.now() - 1000 * 60 * 30) } }, // Last 30 minutes
      {
        $set: {
          scrollDepth,
          timeOnPage
        },
        $push: {
          interactions: {
            $each: interactions
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking session:', error);
    res.status(500).json({ success: false, message: 'Error tracking session' });
  }
});

// Update order coordinates
router.post('/update-order-coordinates', async (req, res) => {
  try {
    const { orderId, latitude, longitude } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.shippingAddress = {
      ...order.shippingAddress,
      latitude,
      longitude
    };

    await order.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating order coordinates:', error);
    res.status(500).json({ success: false, message: 'Error updating order coordinates' });
  }
});

export default router; 
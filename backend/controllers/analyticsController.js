import UserBehavior from '../models/userBehavior.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import logger from '../config/logger.js';
import { getStartDate } from '../routes/analyticsRoute.js';
import axios from 'axios';

// Get overall user behavior analytics
export const getUserBehavior = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    const dateRange = getDateRange(timeRange, startDate, endDate);

    const behaviors = await UserBehavior.find({
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    }).sort({ timestamp: 1 });

    // Process session data for time series chart
    const sessionData = processTimeSeriesData(behaviors, 'sessionId');
    
    // Process engagement data
    const engagementData = behaviors.map(behavior => ({
      date: behavior.timestamp,
      engagement: calculateEngagementScore(behavior)
    }));

    // Calculate device distribution
    const deviceDistribution = calculateDeviceDistribution(behaviors);

    // Calculate browser distribution
    const browserDistribution = calculateBrowserDistribution(behaviors);

    // Calculate OS distribution
    const osDistribution = calculateOSDistribution(behaviors);

    res.json({
      success: true,
      data: {
        sessionData,
        engagementData,
        deviceDistribution,
        browserDistribution,
        osDistribution,
        totalSessions: behaviors.length,
        averageSessionDuration: calculateAverageSessionDuration(behaviors),
        bounceRate: calculateBounceRate(behaviors)
      }
    });
  } catch (error) {
    logger.error(`Error in getUserBehavior: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const startDate = getStartDate(timeRange);

    // Get total revenue and order count
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    // Get payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $toLower: '$paymentMethod' },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 1,
          total: 1,
          count: 1,
          percentage: {
            $multiply: [
              { $divide: ['$total', salesData[0]?.totalRevenue || 1] },
              100
            ]
          }
        }
      }
    ]);

    // Get sales by category
    const salesByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $addFields: {
          "productId": {
            $cond: {
              if: { $eq: [{ $type: "$items.product" }, "objectId"] },
              then: "$items.product",
              else: {
                $cond: {
                  if: { $eq: [{ $type: "$items.product._id" }, "objectId"] },
                  then: "$items.product._id",
                  else: { $toObjectId: "$items.product._id" }
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData"
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: [{ $size: "$productData" }, 0] },
              then: { $arrayElemAt: ["$productData.category", 0] },
              else: {
                $cond: {
                  if: { $ifNull: ["$items.product.category", false] },
                  then: "$items.product.category",
                  else: "Uncategorized"
                }
              }
            }
          },
          total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          count: { $sum: "$items.quantity" },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          category: "$_id",
          totalSales: "$total",
          count: 1,
          orderCount: 1,
          percentage: {
            $multiply: [
              { $divide: ["$total", salesData[0]?.totalRevenue || 1] },
              100
            ]
          }
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $addFields: {
          "productId": {
            $cond: {
              if: { $eq: [{ $type: "$items.product" }, "objectId"] },
              then: "$items.product",
              else: {
                $cond: {
                  if: { $eq: [{ $type: "$items.product._id" }, "objectId"] },
                  then: "$items.product._id",
                  else: { $toObjectId: "$items.product._id" }
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData"
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $gt: [{ $size: "$productData" }, 0] },
              then: { $arrayElemAt: ["$productData._id", 0] },
              else: "$productId"
            }
          },
          name: {
            $first: {
              $cond: {
                if: { $gt: [{ $size: "$productData" }, 0] },
                then: { $arrayElemAt: ["$productData.name", 0] },
                else: {
                  $cond: {
                    if: { $ifNull: ["$items.product.name", false] },
                    then: "$items.product.name",
                    else: "Unknown Product"
                  }
                }
              }
            }
          },
          category: {
            $first: {
              $cond: {
                if: { $gt: [{ $size: "$productData" }, 0] },
                then: { $arrayElemAt: ["$productData.category", 0] },
                else: {
                  $cond: {
                    if: { $ifNull: ["$items.product.category", false] },
                    then: "$items.product.category",
                    else: "Uncategorized"
                  }
                }
              }
            }
          },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          quantity: { $sum: "$items.quantity" },
          orderCount: { $sum: 1 },
          averagePrice: { $avg: "$items.price" },
          image: {
            $first: {
              $cond: {
                if: { $gt: [{ $size: "$productData" }, 0] },
                then: { $arrayElemAt: ["$productData.images", 0] },
                else: {
                  $cond: {
                    if: { $ifNull: ["$items.product.image", false] },
                    then: "$items.product.image",
                    else: []
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          _id: { $ne: null },
          name: { $ne: "Unknown Product" }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Calculate average order value
    const averageOrderValue = salesData[0]?.orderCount ? salesData[0].totalRevenue / salesData[0].orderCount : 0;

    res.json({
      success: true,
      data: {
        totalRevenue: salesData[0]?.totalRevenue || 0,
        orderCount: salesData[0]?.orderCount || 0,
        averageOrderValue,
        paymentMethods,
        salesByCategory,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error getting sales analytics:', error);
    res.status(500).json({ success: false, message: 'Error getting sales analytics' });
  }
};

// Get conversion rates
export const getConversionRates = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    const dateRange = getDateRange(timeRange, startDate, endDate);

    const [behaviors, orders] = await Promise.all([
      UserBehavior.find({ timestamp: { $gte: dateRange.start, $lte: dateRange.end } }),
      Order.find({ createdAt: { $gte: dateRange.start, $lte: dateRange.end } })
    ]);

    // Process device data for pie chart
    const deviceData = calculateDeviceConversionRates(behaviors, orders);

    // Process page data for bar chart
    const pageData = calculatePageConversionRates(behaviors, orders);

    res.json({
      success: true,
      data: {
        deviceData,
        pageData,
        overallRate: calculateOverallConversionRate(behaviors, orders)
      }
    });
  } catch (error) {
    logger.error(`Error in getConversionRates: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer segments
export const getCustomerSegments = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    const dateRange = getDateRange(timeRange, startDate, endDate);

    // Get user behavior data
    const behaviors = await UserBehavior.find({
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });

    // Get orders data with populated user information
    const orders = await Order.find({
      createdAt: { $gte: dateRange.start, $lte: dateRange.end },
      status: { $ne: 'cancelled' }
    }).populate({
      path: 'userId',
      select: 'name email'
    });

    // Calculate unique users using aggregation
    const uniqueUsersResult = await UserBehavior.aggregate([
      {
        $match: {
          timestamp: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: '$userId'
        }
      },
      {
        $count: 'total'
      }
    ]);

    const uniqueUsers = uniqueUsersResult[0]?.total || 0;

    // Calculate conversion rate
    const totalSessions = behaviors.length;
    const conversionRate = totalSessions > 0 ? (orders.length / totalSessions) * 100 : 0;

    // Calculate average session duration
    const totalDuration = behaviors.reduce((sum, b) => sum + (b.sessionDuration || 0), 0);
    const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    // Calculate bounce rate
    const bouncedSessions = behaviors.filter(b => !b.interactions || b.interactions.length === 0).length;
    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    // Calculate average time on site
    const totalTimeOnSite = behaviors.reduce((sum, b) => sum + (b.timeOnPage || 0), 0);
    const averageTimeOnSite = totalSessions > 0 ? totalTimeOnSite / totalSessions : 0;

    // Calculate device distribution with proper aggregation
    const deviceDistribution = await UserBehavior.aggregate([
      {
        $match: {
          timestamp: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: null,
          mobile: {
            $sum: {
              $cond: [{ $eq: ['$deviceInfo.isMobile', true] }, 1, 0]
            }
          },
          tablet: {
            $sum: {
              $cond: [{ $eq: ['$deviceInfo.isTablet', true] }, 1, 0]
            }
          },
          desktop: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$deviceInfo.isMobile', true] },
                    { $ne: ['$deviceInfo.isTablet', true] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Calculate OS distribution with proper aggregation
    const osDistribution = await UserBehavior.aggregate([
      {
        $match: {
          timestamp: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $group: {
          _id: '$deviceInfo.os',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          os: { $ifNull: ['$_id', 'Unknown'] },
          count: 1
        }
      }
    ]);

    // Format OS distribution
    const formattedOsDistribution = osDistribution.reduce((acc, curr) => {
      acc[curr.os] = curr.count;
      return acc;
    }, {});

    // Calculate top customers
    const topCustomers = Object.values(orders
      .reduce((acc, order) => {
        const userId = order.userId?._id?.toString();
        if (!userId) return acc;

        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            name: order.userId?.name || 'Unknown Customer',
            email: order.userId?.email || 'No email',
            totalSpent: 0,
            orderCount: 0,
            lastOrderDate: order.createdAt
          };
        }

        acc[userId].totalSpent += order.totalAmount || 0;
        acc[userId].orderCount += 1;
        acc[userId].lastOrderDate = order.createdAt > acc[userId].lastOrderDate ? order.createdAt : acc[userId].lastOrderDate;

        return acc;
      }, {}))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Format device distribution
    const formattedDeviceDistribution = deviceDistribution[0] || { mobile: 0, tablet: 0, desktop: 0 };
    const totalDevices = formattedDeviceDistribution.mobile + formattedDeviceDistribution.tablet + formattedDeviceDistribution.desktop;

    res.json({
      success: true,
      data: {
        totalSessions,
        uniqueUsers,
        conversionRate,
        averageSessionDuration,
        bounceRate,
        averageTimeOnSite,
        deviceDistribution: {
          mobile: {
            count: formattedDeviceDistribution.mobile,
            percentage: totalDevices > 0 ? (formattedDeviceDistribution.mobile / totalDevices) * 100 : 0
          },
          tablet: {
            count: formattedDeviceDistribution.tablet,
            percentage: totalDevices > 0 ? (formattedDeviceDistribution.tablet / totalDevices) * 100 : 0
          },
          desktop: {
            count: formattedDeviceDistribution.desktop,
            percentage: totalDevices > 0 ? (formattedDeviceDistribution.desktop / totalDevices) * 100 : 0
          }
        },
        osDistribution: formattedOsDistribution,
        topCustomers
      }
    });
  } catch (error) {
    logger.error(`Error in getCustomerSegments: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all user behavior data with pagination and filtering
export const getAllUserBehavior = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      userId,
      action,
      device,
      browser,
      os,
      startDate,
      endDate 
    } = req.query;

    const query = {};

    // Apply filters
    if (userId) query.userId = userId;
    
    // Action filter - check in interactions array
    if (action) {
      query['interactions'] = {
        $elemMatch: { type: action }
      };
    }

    // Device filter - check device type flags
    if (device) {
      switch (device.toLowerCase()) {
        case 'mobile':
          query['deviceInfo.isMobile'] = true;
          break;
        case 'tablet':
          query['deviceInfo.isTablet'] = true;
          break;
        case 'desktop':
          query['deviceInfo.isDesktop'] = true;
          break;
      }
    }

    if (browser) query['deviceInfo.browser'] = browser;
    if (os) query['deviceInfo.os'] = os;
    
    // Date range filter
    if (startDate && startDate !== 'undefined') {
      query.timestamp = { ...query.timestamp, $gte: new Date(startDate) };
    }
    if (endDate && endDate !== 'undefined') {
      query.timestamp = { ...query.timestamp, $lte: new Date(endDate) };
    }

    // Get total count for pagination
    const total = await UserBehavior.countDocuments(query);

    // Get paginated data
    const behaviors = await UserBehavior.find(query)
      .sort({ timestamp: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    // Get summary statistics
    const summary = await UserBehavior.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          totalActions: { 
            $sum: { 
              $cond: [
                { $isArray: '$interactions' },
                { $size: '$interactions' },
                0
              ]
            }
          },
          deviceDistribution: {
            $push: {
              device: {
                $cond: [
                  { $eq: ['$deviceInfo.isMobile', true] },
                  'mobile',
                  {
                    $cond: [
                      { $eq: ['$deviceInfo.isTablet', true] },
                      'tablet',
                      'desktop'
                    ]
                  }
                ]
              }
            }
          },
          browserDistribution: { $addToSet: '$deviceInfo.browser' },
          osDistribution: { $addToSet: '$deviceInfo.os' }
        }
      }
    ]);

    const stats = summary[0] || {
      totalSessions: 0,
      uniqueUsers: [],
      totalActions: 0,
      deviceDistribution: [],
      browserDistribution: [],
      osDistribution: []
    };

    // Process distributions
    const processDistribution = (items) => {
      const distribution = {};
      items.forEach(item => {
        if (item) {
          distribution[item] = (distribution[item] || 0) + 1;
        }
      });
      return distribution;
    };

    res.json({
      success: true,
      data: {
        behaviors,
        pagination: {
          total,
          pages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          perPage: parseInt(limit)
        },
        summary: {
          totalSessions: stats.totalSessions,
          uniqueUsers: stats.uniqueUsers.length,
          totalActions: stats.totalActions,
          deviceDistribution: processDistribution(stats.deviceDistribution.map(d => d.device)),
          browserDistribution: processDistribution(stats.browserDistribution),
          osDistribution: processDistribution(stats.osDistribution)
        }
      }
    });
  } catch (error) {
    logger.error(`Error in getAllUserBehavior: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get page visits analytics
export const getPageVisits = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    const dateRange = getDateRange(timeRange, startDate, endDate);

    const behaviors = await UserBehavior.find({
      timestamp: { $gte: dateRange.start, $lte: dateRange.end }
    });

    // Aggregate page visits
    const pageVisits = {};
    behaviors.forEach(behavior => {
      const path = behavior.path || 'unknown';
      pageVisits[path] = (pageVisits[path] || 0) + 1;
    });

    // Calculate average time on page
    const pageTimeSpent = {};
    behaviors.forEach(behavior => {
      const path = behavior.path || 'unknown';
      if (!pageTimeSpent[path]) {
        pageTimeSpent[path] = {
          totalTime: 0,
          visits: 0
        };
      }
      pageTimeSpent[path].totalTime += behavior.timeOnPage || 0;
      pageTimeSpent[path].visits += 1;
    });

    // Format the data for response
    const pagesData = Object.entries(pageVisits).map(([path, visits]) => ({
      path,
      visits,
      averageTimeSpent: Math.round(pageTimeSpent[path].totalTime / pageTimeSpent[path].visits) || 0,
      bounceRate: calculatePageBounceRate(behaviors, path)
    }));

    // Sort by visits in descending order
    pagesData.sort((a, b) => b.visits - a.visits);

    res.json({
      success: true,
      data: {
        pages: pagesData,
        totalPageViews: behaviors.length,
        uniquePageViews: new Set(behaviors.map(b => b.path)).size,
        averageTimeOnSite: calculateAverageTimeOnSite(behaviors)
      }
    });
  } catch (error) {
    logger.error(`Error in getPageVisits: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product performance analytics
export const getProductPerformance = async (req, res) => {
  try {
    const { timeRange, startDate, endDate } = req.query;
    const dateRange = getDateRange(timeRange, startDate, endDate);

    const orders = await Order.find({
      createdAt: { $gte: dateRange.start, $lte: dateRange.end }
    }).populate('items.product');

    // Aggregate product performance data
    const productStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product._id.toString();
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            name: item.product.name,
            category: item.product.category,
            totalSales: 0,
            totalRevenue: 0,
            totalQuantity: 0,
            averageRating: 0,
            ratingCount: 0
          };
        }
        productStats[productId].totalSales++;
        productStats[productId].totalRevenue += item.price * item.quantity;
        productStats[productId].totalQuantity += item.quantity;
        if (item.rating) {
          productStats[productId].averageRating = 
            ((productStats[productId].averageRating * productStats[productId].ratingCount) + item.rating) / 
            (productStats[productId].ratingCount + 1);
          productStats[productId].ratingCount++;
        }
      });
    });

    // Convert to array and sort by revenue
    const productPerformance = Object.values(productStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate category performance
    const categoryStats = {};
    productPerformance.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          category: product.category,
          totalRevenue: 0,
          totalQuantity: 0,
          productCount: 0
        };
      }
      categoryStats[product.category].totalRevenue += product.totalRevenue;
      categoryStats[product.category].totalQuantity += product.totalQuantity;
      categoryStats[product.category].productCount++;
    });

    // Convert category stats to array and sort by revenue
    const categoryPerformance = Object.values(categoryStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    res.json({
      success: true,
      data: {
        products: productPerformance,
        categories: categoryPerformance,
        summary: {
          totalProducts: productPerformance.length,
          totalCategories: categoryPerformance.length,
          topPerformingCategory: categoryPerformance[0]?.category || 'N/A',
          topPerformingProduct: productPerformance[0]?.name || 'N/A',
          totalRevenue: productPerformance.reduce((sum, p) => sum + p.totalRevenue, 0),
          totalQuantitySold: productPerformance.reduce((sum, p) => sum + p.totalQuantity, 0)
        }
      }
    });
  } catch (error) {
    logger.error(`Error in getProductPerformance: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get purchase locations data
export const getPurchaseLocations = async (req, res) => {
  try {
    console.log('Fetching purchase locations...');
    
    const locations = await Order.aggregate([
      {
        $match: {
          'shippingAddress.city': { $exists: true },
          'shippingAddress.state': { $exists: true }
        }
      },
      {
        $unwind: '$items' // Unwind the items array to get individual items
      },
      {
        $group: {
          _id: {
            city: '$shippingAddress.city',
            state: '$shippingAddress.state',
            latitude: { $ifNull: ['$shippingAddress.latitude', 0] },
            longitude: { $ifNull: ['$shippingAddress.longitude', 0] },
            itemId: '$items.product', // Group by item ID
            itemName: '$items.name' // Include item name in grouping
          },
          orderCount: { $sum: 1 }, // Count number of orders for this item
          totalAmount: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }, // Total amount = price * quantity
          itemQuantity: { $sum: '$items.quantity' }, // Sum of quantities across all orders
          lastPurchase: { $max: '$createdAt' },
          statuses: { $addToSet: '$status' }
        }
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          state: '$_id.state',
          latitude: '$_id.latitude',
          longitude: '$_id.longitude',
          itemId: '$_id.itemId',
          itemName: '$_id.itemName',
          itemQuantity: 1,
          orderCount: 1,
          totalAmount: 1,
          lastPurchase: 1,
          statuses: 1,
          hasCoordinates: { $and: [
            { $ne: ['$_id.latitude', 0] },
            { $ne: ['$_id.longitude', 0] }
          ]}
        }
      }
    ]);

    console.log('Found locations:', locations);

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error in getPurchaseLocations:', error);
    logger.error(`Error in getPurchaseLocations: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update existing orders with coordinates
export const updateOrderCoordinates = async (req, res) => {
  try {
    console.log('Updating order coordinates...');
    
    // Get all orders without coordinates
    const orders = await Order.find({
      $or: [
        { 'shippingAddress.latitude': { $exists: false } },
        { 'shippingAddress.longitude': { $exists: false } }
      ]
    });

    console.log(`Found ${orders.length} orders to update`);

    let updatedCount = 0;
    for (const order of orders) {
      const address = order.shippingAddress;
      const addressString = `${address.street || ''}, ${address.city}, ${address.state}, ${address.country}`;
      
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          
          await Order.findByIdAndUpdate(order._id, {
            'shippingAddress.latitude': lat,
            'shippingAddress.longitude': lng
          });
          
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error geocoding order ${order._id}:`, error);
        continue;
      }
    }

    console.log(`Updated ${updatedCount} orders with coordinates`);

    res.json({
      success: true,
      message: `Updated ${updatedCount} orders with coordinates`,
      totalProcessed: orders.length,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating order coordinates:', error);
    logger.error(`Error updating order coordinates: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper function to get date range
const getDateRange = (timeRange, startDate, endDate) => {
  if (startDate && endDate) {
    return {
      start: new Date(startDate),
      end: new Date(endDate)
    };
  }
  
  const start = getStartDate(timeRange || 'week');
  return {
    start,
    end: new Date()
  };
};

const processTimeSeriesData = (data, key, dateField = 'timestamp') => {
  const groupedData = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]).toISOString().split('T')[0];
    if (!groupedData[date]) {
      groupedData[date] = 0;
    }
    groupedData[date]++;
  });

  return Object.entries(groupedData).map(([date, value]) => ({
    date,
    [key]: value
  }));
};

const calculateEngagementScore = (behavior) => {
  let score = 0;
  score += behavior.scrollDepth || 0;
  score += (behavior.timeOnPage || 0) / 60; // Convert seconds to minutes
  score += (behavior.interactions || []).length * 2;
  return Math.min(100, score);
};

const calculateDeviceDistribution = (behaviors) => {
  const distribution = { mobile: 0, tablet: 0, desktop: 0 };
  behaviors.forEach(behavior => {
    if (behavior.deviceInfo?.isMobile) distribution.mobile++;
    else if (behavior.deviceInfo?.isTablet) distribution.tablet++;
    else distribution.desktop++;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
};

const calculateBrowserDistribution = (behaviors) => {
  const distribution = {};
  behaviors.forEach(behavior => {
    const browser = behavior.deviceInfo?.browser || 'Other';
    distribution[browser] = (distribution[browser] || 0) + 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
};

const calculateOSDistribution = (behaviors) => {
  const distribution = {};
  behaviors.forEach(behavior => {
    const os = behavior.deviceInfo?.os || 'Other';
    distribution[os] = (distribution[os] || 0) + 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
};

const calculateAverageSessionDuration = (behaviors) => {
  const durations = behaviors.map(b => b.sessionDuration || 0);
  return durations.reduce((a, b) => a + b, 0) / durations.length || 0;
};

const calculateBounceRate = (behaviors) => {
  const bouncedSessions = behaviors.filter(b => b.interactions?.length === 0).length;
  return (bouncedSessions / behaviors.length) * 100 || 0;
};

const calculateTotalRevenue = (orders) => {
  return orders.reduce((total, order) => total + order.totalAmount, 0);
};

const calculateAverageOrderValue = (orders) => {
  return orders.length ? calculateTotalRevenue(orders) / orders.length : 0;
};

const analyzeSalesByCategory = (orders) => {
  const categorySales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product.category;
      categorySales[category] = (categorySales[category] || 0) + item.quantity;
    });
  });
  return Object.entries(categorySales).map(([name, sales]) => ({ name, sales }));
};

const getTopSellingProducts = (orders) => {
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const productId = item.product._id.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          _id: productId,
          name: item.product.name,
          quantity: 0
        };
      }
      productSales[productId].quantity += item.quantity;
    });
  });
  return Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
};

const calculateDeviceConversionRates = (behaviors, orders) => {
  const deviceStats = { mobile: 0, tablet: 0, desktop: 0 };
  const deviceOrders = { mobile: 0, tablet: 0, desktop: 0 };

  behaviors.forEach(behavior => {
    const device = behavior.deviceInfo?.isMobile ? 'mobile' :
                  behavior.deviceInfo?.isTablet ? 'tablet' : 'desktop';
    deviceStats[device]++;
  });

  orders.forEach(order => {
    const device = order.deviceInfo?.isMobile ? 'mobile' :
                  order.deviceInfo?.isTablet ? 'tablet' : 'desktop';
    deviceOrders[device]++;
  });

  return Object.entries(deviceStats).map(([device, sessions]) => ({
    name: device,
    value: (deviceOrders[device] / sessions) * 100 || 0
  }));
};

const calculatePageConversionRates = (behaviors, orders) => {
  const pageStats = {};
  const pageOrders = {};

  behaviors.forEach(behavior => {
    const page = behavior.path;
    pageStats[page] = (pageStats[page] || 0) + 1;
  });

  orders.forEach(order => {
    const page = order.sourcePage;
    pageOrders[page] = (pageOrders[page] || 0) + 1;
  });

  return Object.entries(pageStats).map(([page, sessions]) => ({
    name: page,
    conversion: (pageOrders[page] / sessions) * 100 || 0
  }));
};

const calculateOverallConversionRate = (behaviors, orders) => {
  const uniqueSessions = new Set(behaviors.map(b => b.sessionId)).size;
  const uniqueOrders = new Set(orders.map(o => o.sessionId)).size;
  return (uniqueOrders / uniqueSessions) * 100 || 0;
};

const calculateCustomerDemographics = (users) => {
  const demographics = {
    age: { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 },
    gender: { male: 0, female: 0, other: 0 },
    location: {}
  };

  users.forEach(user => {
    // Age groups
    const age = user.age || 0;
    if (age >= 18 && age <= 24) demographics.age['18-24']++;
    else if (age <= 34) demographics.age['25-34']++;
    else if (age <= 44) demographics.age['35-44']++;
    else if (age <= 54) demographics.age['45-54']++;
    else demographics.age['55+']++;

    // Gender
    demographics.gender[user.gender || 'other']++;

    // Location
    const location = user.location || 'Unknown';
    demographics.location[location] = (demographics.location[location] || 0) + 1;
  });

  return [
    ...Object.entries(demographics.age).map(([name, value]) => ({ name, value })),
    ...Object.entries(demographics.gender).map(([name, value]) => ({ name, value }))
  ];
};

const calculatePurchaseFrequency = (orders) => {
  const userOrders = {};
  orders.forEach(order => {
    const userId = order.userId.toString();
    userOrders[userId] = (userOrders[userId] || 0) + 1;
  });

  const frequency = {
    '1 purchase': 0,
    '2-3 purchases': 0,
    '4-5 purchases': 0,
    '6+ purchases': 0
  };

  Object.values(userOrders).forEach(count => {
    if (count === 1) frequency['1 purchase']++;
    else if (count <= 3) frequency['2-3 purchases']++;
    else if (count <= 5) frequency['4-5 purchases']++;
    else frequency['6+ purchases']++;
  });

  return Object.entries(frequency).map(([name, customers]) => ({ name, customers }));
};

const calculateNewVsReturning = (users, orders) => {
  const userOrderCount = {};
  orders.forEach(order => {
    const userId = order.userId.toString();
    userOrderCount[userId] = (userOrderCount[userId] || 0) + 1;
  });

  const newCustomers = Object.keys(userOrderCount).filter(userId => userOrderCount[userId] === 1).length;
  const returningCustomers = Object.keys(userOrderCount).length - newCustomers;

  return {
    new: (newCustomers / users.length) * 100 || 0,
    returning: (returningCustomers / users.length) * 100 || 0
  };
};

const calculateCustomerValue = (orders) => {
  const userSpending = {};
  orders.forEach(order => {
    const userId = order.userId.toString();
    userSpending[userId] = (userSpending[userId] || 0) + order.totalAmount;
  });

  const average = Object.values(userSpending).reduce((a, b) => a + b, 0) / Object.keys(userSpending).length || 0;

  return {
    average,
    distribution: Object.entries(userSpending).map(([userId, amount]) => ({
      userId,
      amount
    })).sort((a, b) => b.amount - a.amount)
  };
};

// Helper function to calculate distribution
const calculateDistribution = (array) => {
  const distribution = {};
  array.forEach(item => {
    distribution[item] = (distribution[item] || 0) + 1;
  });
  return distribution;
};

// Helper function to calculate bounce rate for a specific page
const calculatePageBounceRate = (behaviors, path) => {
  const pageVisits = behaviors.filter(b => b.path === path);
  const bounces = pageVisits.filter(b => b.timeOnPage < 30 || !b.interactions?.length);
  return pageVisits.length ? (bounces.length / pageVisits.length) * 100 : 0;
};

// Helper function to calculate average time on site
const calculateAverageTimeOnSite = (behaviors) => {
  const totalTime = behaviors.reduce((sum, b) => sum + (b.timeOnPage || 0), 0);
  return behaviors.length ? Math.round(totalTime / behaviors.length) : 0;
};

// Get all analytics data
export const getAnalytics = async (req, res) => {
  try {
    const [
      userBehavior,
      pageVisits,
      conversionRates,
      salesAnalytics,
      productPerformance,
      customerSegments
    ] = await Promise.all([
      getUserBehavior(req.query),
      getPageVisits(req.query),
      getConversionRates(req.query),
      getSalesAnalytics(req.query),
      getProductPerformance(req.query),
      getCustomerSegments(req.query)
    ]);

    res.json({
      success: true,
      data: {
        userBehavior,
        pageVisits,
        conversionRates,
        salesAnalytics,
        productPerformance,
        customerSegments
      }
    });
  } catch (error) {
    logger.error(`Analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data"
    });
  }
};

// User Segmentation: Group users by behavior patterns
export const getUserSegments = async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    const startDate = getStartDate(timeRange);

    // Get all users with their behavior data
    const users = await User.find({});

    const segments = {
      frequent_buyers: [],
      browsers: [],
      cart_abandoners: [],
      new_users: [],
      loyal_customers: []
    };

    for (const user of users) {
      // Check orders in time range
      const orders = await Order.find({
        userId: user._id,
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' }
      });

      // Check behavior data
      const behaviors = await UserBehavior.find({
        userId: user._id,
        timestamp: { $gte: startDate }
      });

      // Check cart actions
      const cartAbandonDate = new Date();
      cartAbandonDate.setDate(cartAbandonDate.getDate() - 7);
      const recentCartActions = behaviors.filter(b =>
        b.cartActions && b.cartActions.some(action => action.type === 'add' && action.timestamp > cartAbandonDate)
      );

      const hasRecentPurchase = orders.length > 0;
      const accountAge = (new Date() - user.createdAt) / (1000 * 60 * 60 * 24); // days

      // Segmentation logic
      if (orders.length > 5) {
        segments.frequent_buyers.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          orders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0)
        });
      } else if (behaviors.length > 10 && orders.length === 0) {
        segments.browsers.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          pageViews: behaviors.length
        });
      } else if (recentCartActions.length > 0 && !hasRecentPurchase) {
        segments.cart_abandoners.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          cartItems: recentCartActions.length
        });
      } else if (accountAge <= 7) {
        segments.new_users.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          accountAge: Math.floor(accountAge)
        });
      } else if (orders.length >= 3 && accountAge > 90) {
        segments.loyal_customers.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          orders: orders.length,
          accountAge: Math.floor(accountAge)
        });
      }
    }

    // Calculate segment statistics
    const segmentStats = {};
    Object.keys(segments).forEach(segment => {
      segmentStats[segment] = {
        count: segments[segment].length,
        percentage: users.length > 0 ? Math.round((segments[segment].length / users.length) * 100) : 0
      };
    });

    res.json({
      success: true,
      data: {
        segments,
        statistics: segmentStats,
        totalUsers: users.length
      }
    });
  } catch (error) {
    logger.error(`Error in getUserSegments: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user segments
export const getUserSegments = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Get all users
    const users = await User.find({ isActive: true }).select('_id name email createdAt');

    const segments = {
      frequent_buyers: [],
      browsers: [],
      cart_abandoners: [],
      new_users: [],
      loyal_customers: []
    };

    for (const user of users) {
      // Check orders in last 30 days
      const recentOrders = await Order.find({
        userId: user._id,
        createdAt: { $gte: thirtyDaysAgo },
        status: { $ne: 'cancelled' }
      });

      // Check total orders
      const totalOrders = await Order.countDocuments({
        userId: user._id,
        status: { $ne: 'cancelled' }
      });

      // Check page views
      const pageViews = await UserBehavior.countDocuments({
        userId: user._id
      });

      // Check cart actions in last 7 days
      const cartActions = await UserBehavior.find({
        userId: user._id,
        'cartActions.timestamp': { $gte: sevenDaysAgo }
      });

      // Check if user has orders in last 7 days after cart actions
      const hasRecentPurchase = await Order.findOne({
        userId: user._id,
        createdAt: { $gte: sevenDaysAgo },
        status: { $ne: 'cancelled' }
      });

      // Determine segments
      if (recentOrders.length > 5) {
        segments.frequent_buyers.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          orderCount: recentOrders.length
        });
      }

      if (pageViews > 10 && totalOrders === 0) {
        segments.browsers.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          pageViews
        });
      }

      if (cartActions.length > 0 && !hasRecentPurchase) {
        segments.cart_abandoners.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          cartActionsCount: cartActions.length
        });
      }

      if (user.createdAt >= sevenDaysAgo) {
        segments.new_users.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          registeredAt: user.createdAt
        });
      }

      if (totalOrders > 3 && user.createdAt <= ninetyDaysAgo) {
        segments.loyal_customers.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          totalOrders,
          accountAge: Math.floor((now - user.createdAt) / (1000 * 60 * 60 * 24))
        });
      }
    }

    // Calculate segment statistics
    const segmentStats = Object.entries(segments).map(([segment, users]) => ({
      segment,
      count: users.length,
      percentage: users.length > 0 ? (users.length / users.length) * 100 : 0
    }));

    res.json({
      success: true,
      data: {
        segments,
        statistics: segmentStats,
        totalUsers: users.length
      }
    });
  } catch (error) {
    logger.error(`Error in getUserSegments: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
}; 
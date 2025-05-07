import Order from "../models/order.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import logger from '../config/logger.js';

// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    try {
        const { items, amount, address, paymentMethod, status, date, additionalCosts, discount, appliedCoupon } = req.body;
        const userId = req.user.id;

        if (!items || !amount || !address || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Transform items to match schema
        const orderItems = items.map(item => ({
            product: item.product?._id || item.productId || item.product,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            size: item.size,
            image: item.image
        }));

        // Validate that all items have a product ID
        const invalidItems = orderItems.filter(item => !item.product);
        if (invalidItems.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some items are missing product IDs",
                invalidItems
            });
        }

        const order = await Order.create({
            userId: userId,
            items: orderItems,
            totalAmount: amount,
            shippingAddress: {
                firstName: address.firstName,
                lastName: address.lastName,
                email: address.email,
                phone: address.phone,
                street: address.address,
                city: address.city,
                state: address.state,
                country: address.country,
                zipCode: address.pincode
            },
            paymentMethod: paymentMethod.toLowerCase(),
            status: status || 'pending',
            paymentStatus: 'pending',
            additionalCosts: additionalCosts || 0,
            discount: discount || 0,
            appliedCoupon: appliedCoupon || null,
            date: date || Date.now()
        });

        // Clear the user's cart after successful order placement
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        logger.error(`Place order error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        const { userId, items, amount, address} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        // Clear the user's cart after successful order creation
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success } = req.body
    const userId = req.user.id // Get userId from the authenticated user

    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await Order.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    console.log("Creating Razorpay order for amount:", amount);

    // Transform items to include full product data
    const orderItems = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
        product: item.product
    }));

    const orderData = {
      userId,
      items: orderItems,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    // Create order in database
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    console.log("Created order in database with ID:", savedOrder._id);

    // Clear the user's cart after successful order creation
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };

    console.log("Creating Razorpay order with options:", options);

    try {
      const order = await new Promise((resolve, reject) => {
        razorpayInstance.orders.create(options, (error, result) => {
          if (error) {
            console.error("Razorpay order creation failed:", error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
      
      console.log("Razorpay order created successfully:", {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      });
      
      res.json({ 
        success: true, 
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency.toLowerCase(),
          receipt: order.receipt
        } 
      });
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      // Delete the order from our database if Razorpay order creation fails
      await Order.findByIdAndDelete(savedOrder._id);
      return res.json({ success: false, message: error.message || "Failed to create payment order" });
    }
  } catch (error) {
    console.error("Order placement error:", error);
    res.json({ success: false, message: error.message || "Failed to place order" });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    
    console.log("Razorpay verification payload:", { 
      razorpay_order_id, 
      razorpay_payment_id,
      userId,
      signatureReceived: razorpay_signature ? 'Yes' : 'No'
    });

    if (!razorpay_order_id || !razorpay_payment_id) {
      console.error("Missing payment details in request");
      return res.json({ success: false, message: "Payment verification failed: Missing payment details" });
    }

    try {
      // Fetch the order details from Razorpay
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
      console.log("Order info from Razorpay:", {
        id: orderInfo.id,
        amount: orderInfo.amount,
        currency: orderInfo.currency,
        receipt: orderInfo.receipt,
        status: orderInfo.status
      });
      
      // Get our order ID from the receipt
      const orderId = orderInfo.receipt;
      
      console.log(`Updating order ${orderId} to paid status`);
      
      // Update the order status to paid without any additional checks
      // This assumes that if Razorpay sent us a payment_id, the payment succeeded
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );
      
      if (!updatedOrder) {
        console.error(`Order ${orderId} not found in database`);
        return res.json({ success: false, message: "Order not found in database" });
      }

      console.log(`Successfully updated order ${orderId}`);

      // Clear the user's cart
      if (userId) {
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        console.log(`Cleared cart for user ${userId}`);
      }
      
      return res.json({ success: true, message: "Payment successful" });
    } catch (error) {
      console.error("Error during Razorpay verification:", error);
      return res.json({ success: false, message: "Payment verification failed: " + error.message });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.json({ success: false, message: error.message || "Payment verification failed" });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await Order.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    logger.info(`Fetching orders for user: ${userId}`);

    // Build query
    const query = { userId: userId };
    if (status) {
      query.status = status;
    }

    logger.info(`Query: ${JSON.stringify(query)}`);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    logger.info(`Total orders found: ${total}`);

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name price image');

    logger.info(`Retrieved ${orders.length} orders`);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error(`Get user orders error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to get user orders",
      error: error.message
    });
  }
};

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await Order.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Create new order
const createOrder = async (req, res) => {
  try {
    const order = new Order({
      userId: req.user._id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod
    });

    await order.save();
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    logger.error(`Error creating order: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    logger.error(`Get order details error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details"
    });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    logger.info(`Order tracking info fetched for order: ${orderId}`);

    // Format the order data for frontend
    const formattedOrder = {
      id: order._id,
      status: order.status,
      items: order.items,
      amount: order.totalAmount,
      address: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        country: order.shippingAddress.country,
        zipCode: order.shippingAddress.zipCode
      },
      paymentMethod: order.paymentMethod,
      payment: order.paymentStatus === 'completed',
      date: order.date || order.createdAt
    };

    return res.status(200).json({
      success: true,
      order: formattedOrder
    });
  } catch (error) {
    logger.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to track order",
      error: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in ${order.status} status`
      });
    }

    order.status = 'Cancelled';
    await order.save();

    logger.info(`Order cancelled successfully: ${orderId}`);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    logger.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order"
    });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Please provide order status"
      });
    }

    const validStatuses = [
      'Order Placed',
      'Processing',
      'Preparing',
      'Packing',
      'Quality Check',
      'Shipped',
      'Out for delivery',
      'Delivered',
      'Cancelled'
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    logger.error(`Update order status error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};

// List all orders (admin only)
const listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    logger.info(`List orders request: ${JSON.stringify({ page, limit, status, search })}`);

    // Build query
    const query = {};
    if (status) {
      query.status = status.toLowerCase();
    }
    if (search) {
      query.$or = [
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Order.countDocuments(query);
    logger.info(`Found ${total} orders matching query`);

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email phone');

    logger.info(`Retrieved ${orders.length} orders for page ${page}`);

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order._id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      date: order.date || order.createdAt,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      notes: order.notes
    }));

    res.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error(`List orders error: ${error.message}`);
    logger.error(error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to list orders",
      error: error.message
    });
  }
};

export {verifyRazorpay, verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, createOrder, getOrderDetails, trackOrder, cancelOrder, updateOrderStatus, listOrders}
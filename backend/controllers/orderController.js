import orderModel from "../models/orderModel.js";
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
        
        const { userId, items, amount, address} = req.body;

        // Transform items to include full product data
        const orderItems = items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image, // Include the full image data
            product: item // Store the full product data
        }));

        const orderData = {
            userId,
            items: orderItems,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
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

        const newOrder = new orderModel(orderData)
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
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
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
        image: item.image, // Include the full image data
        product: item // Store the full product data
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
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log("Created order in database with ID:", savedOrder._id);

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR", // Fixed uppercase currency code
      receipt: savedOrder._id.toString(),
    };

    console.log("Creating Razorpay order with options:", options);

    // Use promise-based approach instead of callback for better error handling
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
          currency: order.currency.toLowerCase(), // Send lowercase to frontend
          receipt: order.receipt
        } 
      });
    } catch (error) {
      console.error("Razorpay order creation error:", error);
      // Delete the order from our database if Razorpay order creation fails
      await orderModel.findByIdAndDelete(savedOrder._id);
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
      const updatedOrder = await orderModel.findByIdAndUpdate(
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
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Create new order
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details"
      });
    }

    const order = await orderModel.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Processing',
      payment: 'Pending'
    });

    // Clear user's cart after successful order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    logger.info(`Order created successfully for user: ${userId}`);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    logger.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await orderModel.find({ userId })
      .sort({ date: -1 });

    logger.info(`Orders fetched successfully for user: ${userId}`);

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

// Track order
const trackOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await orderModel.findOne({
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

    return res.status(200).json({
      success: true,
      order: {
        id: order._id,
        status: order.status,
        items: order.items,
        amount: order.amount,
        address: order.address,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        date: order.date
      }
    });
  } catch (error) {
    logger.error('Error tracking order:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to track order"
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await orderModel.findOne({
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

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, createOrder, getUserOrders, trackOrder, cancelOrder}
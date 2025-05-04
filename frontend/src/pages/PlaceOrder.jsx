import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("razorpay");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState({
    coldPacking: false,
    giftWrapping: false,
    fragileHandling: true,
    noContact: false
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  
  const {
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  // Debug logging for cart items and context
  console.log("Full ShopContext:", {
    cartItems,
    products,
    getCartAmount: getCartAmount(),
    delivery_fee
  });

  // Check if cartItems is in the expected format
  if (cartItems && typeof cartItems === 'object') {
    console.log("Cart items structure:", {
      keys: Object.keys(cartItems),
      values: Object.values(cartItems),
      type: typeof cartItems,
      isArray: Array.isArray(cartItems),
      stringified: JSON.stringify(cartItems)
    });
  } else {
    console.error("Invalid cart items format:", cartItems);
  }

  // Check authentication and cart after hooks
  if (!token) {
    toast.error("Please login to place an order");
    navigate("/login");
    return null;
  }

  // Updated cart validation for new structure
  const hasItems = cartItems && 
    typeof cartItems === 'object' && 
    Object.keys(cartItems).length > 0 && 
    Object.values(cartItems).some(quantity => quantity > 0);

  // Only redirect if not showing success animation
  if (!hasItems && !showSuccess) {
    console.log("Cart validation failed:", {
      cartItems,
      hasItems,
      cartKeys: Object.keys(cartItems),
      cartValues: Object.values(cartItems),
      cartItemsType: typeof cartItems,
      cartItemsStringified: JSON.stringify(cartItems)
    });
    toast.error("Your cart is empty");
    navigate("/cart");
    return null;
  }
  
  // Available coupons (in a real app, this would come from the backend)
  const availableCoupons = [
    { code: "SWEETFREE", discount: 100, minAmount: 500, description: "₹100 off on orders above ₹500" },
    { code: "WELCOME10", discount: 0.1, isPercentage: true, maxDiscount: 200, description: "10% off (up to ₹200)" },
    { code: "FREESHIP", discount: 50, description: "Free shipping (₹50 off shipping)" }
  ];

  // Calculate additional costs
  const calculateAdditionalCosts = () => {
    let additionalCost = 0;
    if (specialRequirements.coldPacking) additionalCost += 40;
    if (specialRequirements.giftWrapping) additionalCost += 30;
    return additionalCost;
  };

  // Get total amount with discount
  const getTotalAmount = () => {
    const subtotal = getCartAmount();
    const additionalCosts = calculateAdditionalCosts();
    const total = subtotal + delivery_fee + additionalCosts - discount;
    return Math.max(total, 0);
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle coupon code input change
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value.trim().toUpperCase());
  };

  // Apply coupon code
  const applyCoupon = (e) => {
    // Prevent form submission
    e && e.preventDefault();
    
    if (!couponCode) {
      toast.info("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const coupon = availableCoupons.find(c => c.code === couponCode);
      
      if (!coupon) {
        toast.error("Invalid coupon code");
        setIsApplyingCoupon(false);
        return;
      }
      
      const subtotal = getCartAmount();
      
      // Check minimum order amount if applicable
      if (coupon.minAmount && subtotal < coupon.minAmount) {
        toast.error(`This coupon requires a minimum order of ₹${coupon.minAmount}`);
        setIsApplyingCoupon(false);
        return;
      }
      
      // Calculate discount
      let discountAmount;
      if (coupon.isPercentage) {
        discountAmount = subtotal * coupon.discount;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discount;
      }
      
      setDiscount(discountAmount);
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      setIsApplyingCoupon(false);
    }, 800); // Simulate network delay
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleSpecialRequirementsChange = (requirement) => {
    setSpecialRequirements(prev => ({
      ...prev,
      [requirement]: !prev[requirement]
    }));
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.street.trim()) errors.street = "Street address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.zipcode.trim()) errors.zipcode = "Zipcode is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    
    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone number should be 10 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Success animation component
  const SuccessAnimation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-lg p-8 flex flex-col items-center relative overflow-hidden"
      >
        {/* Animated background circles */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full opacity-50"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-100 rounded-full opacity-50"
        />

        {/* Main content */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          {/* Animated checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
          >
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>

          {/* Success message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-3xl font-bold text-gray-800 mb-3"
            >
              Order Placed Successfully!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 mb-4"
            >
              Thank you for your purchase. You can track your order status in your orders page.
            </motion.p>

            {/* Track Order Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <button
                onClick={() => {
                  setCartItems({});
                  navigate("/orders");
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Track My Order</span>
              </button>
            </motion.div>

            {/* Animated loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            />

            {/* Animated confetti */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 200 - 100,
                    y: -20,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: 200,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute w-2 h-2"
                  style={{
                    left: `${Math.random() * 100}%`,
                    background: ['#10B981', '#059669', '#34D399'][Math.floor(Math.random() * 3)]
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const initPay = (order) => {
    console.log("initPay called with order:", order);
    
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      console.error("Razorpay script not loaded! Make sure the script tag is in your HTML.");
      toast.error("Payment gateway not available. Please try again later.");
      return;
    }
    
    // Get key from env
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mOnUuMNqgoGi2H";
    console.log("Using Razorpay key:", razorpayKey);
    
    if (!razorpayKey) {
      console.error("Razorpay key is missing!");
      toast.error("Payment configuration error. Please contact support.");
      return;
    }

    // Ensure currency is uppercase for Razorpay
    const currency = order.currency ? order.currency.toUpperCase() : "INR";
    console.log("Using currency:", currency);

    // Create a description that includes discount info
    let description = "Payment for your order at Sweet Home";
    if (discount > 0 && appliedCoupon) {
      description += ` (Coupon: ${appliedCoupon.code}, Discount: ₹${discount})`;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: currency,
      name: "Sweet Home",
      description: description,
      order_id: order.id,
      prefill: {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zipcode}`,
        specialRequirements: JSON.stringify(specialRequirements),
        appliedCoupon: appliedCoupon ? appliedCoupon.code : '',
        discount: discount.toString()
      },
      theme: {
        color: "#000000"
      },
      handler: async (response) => {
        console.log("Payment response:", response);
        try {
          // Send the payment details to backend for verification
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: order.receipt
            },
            { headers: { token } }
          );
          
          if (data.success) {
            // Show success animation first
            setShowSuccess(true);
            // Clear cart after showing success
            setTimeout(() => {
              setCartItems({});
              navigate("/orders");
            }, 3000);
          } else {
            console.error("Payment verification failed:", data);
            toast.error(data.message || "Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error(error.response?.data?.message || "Payment verification failed. Please try again.");
        }
      },
      modal: {
        ondismiss: function() {
          console.log("Razorpay modal dismissed");
          toast.info("Payment cancelled. You can try again later.");
        }
      }
    };
    
    console.log("Creating Razorpay instance with options:", { ...options, key: "[HIDDEN]" });
    
    try {
      const rzp = new window.Razorpay(options);
      console.log("Razorpay instance created, opening payment modal...");
      rzp.open();
      console.log("Razorpay open() called");
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Payment gateway initialization failed: " + (error.message || "Unknown error"));
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Check authentication again before submitting
    if (!token) {
      toast.error("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    // Updated cart validation for new structure
    const hasItems = cartItems && 
      typeof cartItems === 'object' && 
      Object.keys(cartItems).length > 0 && 
      Object.values(cartItems).some(quantity => quantity > 0);

    if (!hasItems) {
      console.log("Cart validation failed in submit:", {
        cartItems,
        hasItems,
        cartKeys: Object.keys(cartItems),
        cartValues: Object.values(cartItems),
        cartItemsType: typeof cartItems,
        cartItemsStringified: JSON.stringify(cartItems)
      });
      toast.error("Your cart is empty. Please add items before placing an order.");
      navigate("/cart");
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Extract userId from token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // Process cart items with new structure
      let orderItems = [];
      console.log("Processing cart items:", cartItems);
      console.log("Available products:", products);

      // Ensure cartItems is in the correct format
      const processedCartItems = typeof cartItems === 'string' ? JSON.parse(cartItems) : cartItems;
      console.log("Processed cart items:", processedCartItems);

      for (const [productId, quantity] of Object.entries(processedCartItems)) {
        if (quantity > 0) {
          console.log(`Processing product ID: ${productId}, Quantity: ${quantity}`);
          const product = products.find(p => p._id === productId);
          
          if (!product) {
            console.error(`Product not found for ID: ${productId}`);
            continue;
          }

          console.log(`Adding item - Product: ${product.name}, Quantity: ${quantity}`);
          orderItems.push({
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: "regular", // Default size since it's not in the new structure
            image: Array.isArray(product.image) ? product.image : [product.image],
            product: {
              amount: product.price * quantity
            }
          });
        }
      }

      if (orderItems.length === 0) {
        console.error("No valid items found in cart after processing:", {
          cartItems,
          processedCartItems,
          products,
          orderItems
        });
        throw new Error('No valid items found in cart');
      }

      console.log("Processed order items:", orderItems);

      const additionalCosts = calculateAdditionalCosts();
      const totalAmount = getTotalAmount();

      const orderData = {
        userId,
        items: orderItems,
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country,
          deliveryInstructions,
          specialRequirements
        },
        amount: totalAmount,
        additionalCosts,
        discount: discount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod: method.toLowerCase(),
        payment: method === "razorpay",
        status: "Order Placed",
        date: Date.now()
      };

      console.log("Submitting order data:", orderData);

      let response;
      switch (method) {
        case "cod":
          toast.info("Processing your order...");
          response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { 
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              } 
            }
          );
          if (response.data.success) {
            // Show success animation first
            setShowSuccess(true);
            // Clear cart after showing success
            setTimeout(() => {
              setCartItems({});
              navigate("/orders");
            }, 3000);
          } else {
            throw new Error(response.data.message || "Failed to place order");
          }
          break;

        case "razorpay":
          toast.info("Initializing payment...");
          try {
            response = await axios.post(
              backendUrl + "/api/order/razorpay",
              orderData,
              { 
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                } 
              }
            );
            
            if (response.data.success) {
              initPay(response.data.order);
            } else {
              throw new Error(response.data.message || "Failed to initialize payment");
            }
          } catch (error) {
            console.error("Razorpay API error:", error);
            throw new Error("Failed to connect to payment server. Please try again.");
          }
          break;

        default:
          throw new Error("Please select a valid payment method");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      } else if (error.message === 'User ID not found in token') {
        toast.error("Authentication error. Please login again.");
        navigate("/login");
      } else if (error.message === 'No valid items found in cart') {
        toast.error("Your cart is empty or contains invalid items. Please check your cart.");
        navigate("/cart");
      } else {
        toast.error(error.message || "An error occurred while placing your order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <AnimatePresence>
        {showSuccess && <SuccessAnimation />}
      </AnimatePresence>
      <div className="container mx-auto px-4">
        {/* Order Progress */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-medium">1</div>
              <p className="text-sm font-medium text-gray-900 mt-2">Cart</p>
            </div>
            <div className="flex-1 h-1 bg-pink-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center font-medium">2</div>
              <p className="text-sm font-medium text-gray-900 mt-2">Checkout</p>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">3</div>
              <p className="text-sm font-medium text-gray-500 mt-2">Complete</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order with just a few more steps</p>
        </div>
        
        <form
          onSubmit={onSubmitHandler}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Side - Delivery Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-4 px-6">
                <h2 className="text-white text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Delivery Information
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      required
                      id="firstName"
                      onChange={onChangeHandler}
                      name="firstName"
                      value={formData.firstName}
                      className={`border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                      type="text"
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && <p className="mt-1 text-xs text-red-500">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      required
                      id="lastName"
                      onChange={onChangeHandler}
                      name="lastName"
                      value={formData.lastName}
                      className={`border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                      type="text"
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    required
                    id="email"
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    className={`border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                    type="email"
                    placeholder="Enter your email address"
                  />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    required
                    id="phone"
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className={`border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors`}
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    required
                    id="street"
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    className="border border-gray-300 rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    type="text"
                    placeholder="Enter your street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      required
                      id="city"
                      onChange={onChangeHandler}
                      name="city"
                      value={formData.city}
                      className="border border-gray-300 rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      type="text"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      id="state"
                      onChange={onChangeHandler}
                      name="state"
                      value={formData.state}
                      className="border border-gray-300 rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      type="text"
                      placeholder="Enter your state"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                    <input
                      required
                      id="zipcode"
                      onChange={onChangeHandler}
                      name="zipcode"
                      value={formData.zipcode}
                      className="border border-gray-300 rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      type="text"
                      placeholder="Enter your zipcode"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      required
                      id="country"
                      onChange={onChangeHandler}
                      name="country"
                      value={formData.country}
                      className="border border-gray-300 rounded-md py-2.5 px-4 w-full focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      type="text"
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Delivery Instructions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 py-4 px-6">
                <h2 className="text-white text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-3h2a1 1 0 001-1V8a5 5 0 00-5-5H5.414A2 2 0 004 3.414V4zm7 0a3 3 0 013 3v5H9V7a3 3 0 01-3-3h4z" />
                  </svg>
                  Delivery Options
                </h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Delivery Instructions
                  </label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2.5 px-4 min-h-[80px] focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Any specific instructions for delivery? (e.g., leave at door, call upon arrival)"
                  ></textarea>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Sweet Handling Options</p>
                  
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id="coldPacking"
                      checked={specialRequirements.coldPacking}
                      onChange={() => handleSpecialRequirementsChange('coldPacking')}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                    />
                    <label htmlFor="coldPacking" className="ml-3 cursor-pointer flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Include cold packing</p>
                        <p className="text-xs text-gray-500">Recommended for milk-based sweets</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id="giftWrapping"
                      checked={specialRequirements.giftWrapping}
                      onChange={() => handleSpecialRequirementsChange('giftWrapping')}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                    />
                    <label htmlFor="giftWrapping" className="ml-3 cursor-pointer flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Gift wrap my order</p>
                        <p className="text-xs text-gray-500">We&apos;ll wrap it in beautiful packaging with a personalized note</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id="fragileHandling"
                      checked={specialRequirements.fragileHandling}
                      onChange={() => handleSpecialRequirementsChange('fragileHandling')}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                    />
                    <label htmlFor="fragileHandling" className="ml-3 cursor-pointer flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Handle as fragile</p>
                        <p className="text-xs text-gray-500">Pre-selected for sweets to ensure safe delivery</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id="noContact"
                      checked={specialRequirements.noContact}
                      onChange={() => handleSpecialRequirementsChange('noContact')}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-400 rounded"
                    />
                    <label htmlFor="noContact" className="ml-3 cursor-pointer flex items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700">No-contact delivery</p>
                        <p className="text-xs text-gray-500">Delivery person will leave the package at your door</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Alert for Perishable Items */}
              <div className="bg-amber-50 border-t border-amber-200 p-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800 text-sm">Important Note About Sweets</p>
                    <p className="text-amber-700 text-xs mt-1">Milk-based sweets are perishable and should be refrigerated upon delivery. Our sweets are prepared fresh and have a limited shelf life of 2-3 days.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4 px-6">
                <h2 className="text-white text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Payment Method
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setMethod("razorpay");
                      console.log("Payment method set to razorpay");
                    }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      method === "razorpay" 
                        ? "border-green-500 bg-green-50 shadow-sm" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === "razorpay" ? "border-green-500" : "border-gray-400"
                      }`}>
                        {method === "razorpay" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${method === "razorpay" ? "text-green-600" : "text-gray-700"}`}>
                          Online Payment
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pay securely with credit/debit cards, UPI, or net banking
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-end space-x-2">
                      {/* VISA logo */}
                      <svg className="h-6" viewBox="0 0 780 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M293.2 348.73L320.1 143.79H365.52L338.55 348.73H293.2Z" fill="#00579F"/>
                        <path d="M566.61 147.37C557.55 143.79 543.31 140.04 526.15 140.04C461.25 140.04 416.72 172.48 416.37 218.72C416.02 252.42 447.37 270.96 471.22 281.77C495.5 292.75 502.82 299.57 502.64 309.48C502.46 324.22 483.62 330.86 466.1 330.86C441.64 330.86 428.7 327.11 408.23 317.76L400.54 313.94L392.32 353.26C403.11 358.83 425 363.89 447.54 364.06C516.18 364.06 559.98 332.14 560.51 283.05C560.86 256.42 544.96 236.06 508.1 219.25C486.14 208.62 473.19 201.61 473.38 190.31C473.38 180.22 485.25 169.44 509.71 169.44C529.66 169.24 544.07 173.59 554.92 178.13L560.33 181.01L568.56 143.44L566.61 147.37Z" fill="#00579F"/>
                        <path d="M661.85 143.79H626.81C615.32 143.79 606.44 146.84 601.14 160.12L512.76 348.73H581.4C581.4 348.73 592 322.43 594.3 317.06C600.25 317.06 659.38 317.06 667.09 317.06C668.85 324.05 674.8 348.73 674.8 348.73H736.15L661.85 143.79ZM610.37 275.84C614.61 265.16 635.1 214.71 635.1 214.71C634.75 215.07 639.87 202.65 642.91 195.19L647.5 214.01C647.5 214.01 659.73 266.63 661.73 275.84H610.37Z" fill="#00579F"/>
                        <path d="M233.98 143.79L168.76 283.22L162.45 252.96C151.31 218.19 122.43 180.76 90.02 161.75L150.41 348.56H219.56L320.09 143.79H233.98Z" fill="#00579F"/>
                        <path d="M109.77 143.79H7.06L6 148.47C86.12 167.13 136.77 206.27 159.38 252.96L136.24 160.14C132.71 147.56 122.79 144 109.77 143.79Z" fill="#FAA61A"/>
                      </svg>

                      {/* Mastercard logo */}
                      <svg className="h-6" viewBox="0 0 131.39 86.9" xmlns="http://www.w3.org/2000/svg">
                        <rect width="131.39" height="86.9" rx="4" fill="white"/>
                        <path d="M51.87 15.24H79.52V65.67H51.87V15.24Z" fill="#FF5F00"/>
                        <path d="M54.08 40.45C54.08 30.64 58.77 21.97 65.7 15.24C59.56 10.4 51.76 7.65 43.42 7.65C26.81 7.65 13.26 22.4 13.26 40.45C13.26 58.5 26.81 73.25 43.42 73.25C51.76 73.25 59.56 70.5 65.7 65.67C58.77 58.93 54.08 50.26 54.08 40.45Z" fill="#EB001B"/>
                        <path d="M118.13 40.45C118.13 58.5 104.58 73.25 87.97 73.25C79.63 73.25 71.83 70.5 65.69 65.67C72.62 58.93 77.31 50.26 77.31 40.45C77.31 30.64 72.62 21.97 65.69 15.24C71.83 10.4 79.63 7.65 87.97 7.65C104.58 7.65 118.13 22.4 118.13 40.45Z" fill="#F79E1B"/>
                      </svg>

                      {/* RuPay logo */}
                      <svg className="h-6" viewBox="0 0 601 211" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M111.3 20.4H16.9C10.5 20.4 5.3 25.6 5.3 32V178.9C5.3 185.3 10.5 190.5 16.9 190.5H111.3C117.7 190.5 122.9 185.3 122.9 178.9V32C122.9 25.6 117.7 20.4 111.3 20.4Z" fill="#097DC6"/>
                        <path d="M381.9 20.4H128C121.6 20.4 116.4 25.6 116.4 32V178.9C116.4 185.3 121.6 190.5 128 190.5H381.9C388.3 190.5 393.5 185.3 393.5 178.9V32C393.5 25.6 388.3 20.4 381.9 20.4Z" fill="#F7B600"/>
                        <path d="M583.8 20.4H395.1C388.7 20.4 383.5 25.6 383.5 32V178.9C383.5 185.3 388.7 190.5 395.1 190.5H583.8C590.2 190.5 595.4 185.3 595.4 178.9V32C595.4 25.6 590.2 20.4 583.8 20.4Z" fill="#008C44"/>
                        <path d="M180.8 105.5C180.8 115.2 175.2 123.2 163.8 123.2H150.1V87.6H163.8C175.1 87.7 180.8 95.7 180.8 105.5ZM168.6 105.5C168.6 101 166.6 97.8 161.9 97.8H161.7V113.1H161.9C166.6 113.1 168.6 109.9 168.6 105.5ZM202.5 123.2H190.7L178.9 87.6H191.6L196.7 108L201.8 87.6H214.4L202.5 123.2ZM225.5 123.2H214V87.6H225.5V123.2ZM261.5 105.4C261.5 117.7 253.2 124.1 240.6 124.1C228 124.1 219.7 117.7 219.7 105.4C219.7 93.1 228 86.7 240.6 86.7C253.2 86.7 261.5 93.1 261.5 105.4ZM248.9 105.4C248.9 100.6 246.4 96.5 240.6 96.5C234.8 96.5 232.3 100.6 232.3 105.4C232.3 110.2 234.8 114.3 240.6 114.3C246.4 114.3 248.9 110.2 248.9 105.4ZM293.2 87.6V123.2H281.7V110H272.2V123.2H260.7V87.6H272.2V100.4H281.7V87.6H293.2ZM312.5 123.2H301V87.6H312.5V123.2ZM353.3 123.2H344L342.3 118.5H329.7L327.9 123.2H318.7L330.5 87.6H341.6L353.3 123.2ZM339.7 110.3L336 98.8L332.2 110.3H339.7ZM372.9 123.2L365.9 108.8L363.5 112.6V123.2H352V87.6H363.5V99.9L371.9 87.6H385.5L375.4 101.2L385.5 123.2H372.9ZM386.9 87.6H398.4V123.2H386.9V87.6Z" fill="white"/>
                      </svg>

                      {/* UPI logo */}
                      <svg className="h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.94 17.42L25.76 5.2C25.66 5.08 25.54 4.98 25.4 4.91C25.26 4.84 25.11 4.8 24.95 4.8H15.05C14.89 4.8 14.74 4.84 14.6 4.91C14.46 4.98 14.34 5.08 14.24 5.2L7.06 17.42C6.96 17.55 6.9 17.7 6.89 17.86C6.88 18.01 6.91 18.17 6.99 18.31L14.16 30.74C14.34 31.06 14.68 31.25 15.05 31.25H24.95C25.11 31.25 25.26 31.21 25.4 31.14C25.54 31.07 25.66 30.97 25.76 30.85L32.94 18.31C33.01 18.17 33.05 18.02 33.03 17.86C33.02 17.7 32.96 17.55 32.86 17.42H32.94Z" fill="#097DC6"/>
                        <path d="M32.06 17.41L24.88 28.81C24.78 28.94 24.66 29.04 24.52 29.11C24.38 29.18 24.23 29.21 24.07 29.21H14.17C14.01 29.21 13.86 29.18 13.72 29.11C13.58 29.04 13.46 28.94 13.36 28.81L6.18 17.41C6.1 17.28 6.06 17.13 6.06 16.97C6.06 16.82 6.1 16.66 6.18 16.53L13.36 5.2C13.46 5.08 13.58 4.98 13.72 4.91C13.86 4.84 14.01 4.8 14.17 4.8H24.07C24.23 4.8 24.38 4.84 24.52 4.91C24.66 4.98 24.78 5.08 24.88 5.2L32.06 16.53C32.14 16.66 32.18 16.82 32.18 16.97C32.18 17.13 32.14 17.28 32.06 17.41Z" fill="#097DC6"/>
                        <path d="M10.91 13.97C10.91 13.92 10.94 13.87 10.99 13.85L13.85 12.33C13.87 12.32 13.89 12.32 13.91 12.32C13.93 12.32 13.96 12.32 13.98 12.33C14 12.35 14.02 12.36 14.03 12.38C14.05 12.4 14.06 12.42 14.06 12.45V13.65C14.06 13.7 14.09 13.75 14.13 13.78C14.16 13.8 14.21 13.8 14.25 13.78L17.61 12.01C17.63 12 17.66 12 17.68 12C17.71 12 17.73 12 17.75 12.01C17.77 12.02 17.79 12.04 17.81 12.06C17.82 12.08 17.83 12.1 17.83 12.13V13.33C17.83 13.38 17.86 13.43 17.9 13.45L19.22 14.16C19.24 14.18 19.26 14.18 19.28 14.18C19.31 14.18 19.33 14.18 19.35 14.16C19.37 14.15 19.39 14.13 19.4 14.11C19.41 14.09 19.42 14.07 19.42 14.04V11.46C19.42 11.3 19.37 11.14 19.27 11.01C19.18 10.88 19.05 10.79 18.9 10.74L10.98 7.38C10.96 7.37 10.94 7.37 10.91 7.37C10.89 7.37 10.87 7.38 10.85 7.39C10.83 7.4 10.81 7.41 10.8 7.43C10.79 7.45 10.78 7.47 10.78 7.49V24.3C10.78 24.32 10.79 24.34 10.8 24.36C10.81 24.38 10.83 24.39 10.85 24.4C10.87 24.41 10.89 24.42 10.91 24.42C10.94 24.42 10.96 24.41 10.98 24.41L19.27 20.75C19.35 20.71 19.39 20.61 19.35 20.53C19.32 20.45 19.22 20.41 19.14 20.44L13.98 23.35C13.96 23.36 13.94 23.37 13.91 23.37C13.89 23.37 13.87 23.36 13.85 23.35C13.83 23.34 13.81 23.33 13.8 23.31C13.79 23.29 13.78 23.26 13.78 23.24V15.47C13.78 15.42 13.75 15.37 13.71 15.35L10.99 13.85C10.94 13.83 10.91 13.87 10.91 13.93V13.97Z" fill="white"/>
                        <path d="M29.09 15.35V19.78C29.09 19.8 29.08 19.82 29.07 19.84C29.06 19.86 29.04 19.87 29.02 19.88C29 19.89 28.98 19.9 28.96 19.9C28.94 19.9 28.91 19.89 28.89 19.88L20.6 15.47C20.45 15.38 20.28 15.33 20.1 15.33C19.92 15.33 19.75 15.38 19.6 15.47L19.35 15.6C19.31 15.62 19.28 15.67 19.28 15.72V20.73C19.28 20.78 19.31 20.83 19.35 20.85L20.65 21.61C20.68 21.63 20.7 21.63 20.72 21.63C20.75 21.63 20.77 21.62 20.79 21.61C20.81 21.6 20.83 21.58 20.84 21.56C20.85 21.54 20.86 21.52 20.86 21.49V17.86C20.86 17.83 20.87 17.81 20.88 17.79C20.89 17.77 20.91 17.76 20.93 17.75C20.95 17.74 20.97 17.73 20.99 17.73C21.02 17.73 21.04 17.74 21.06 17.75L26.22 20.65C26.24 20.66 26.26 20.67 26.29 20.67C26.31 20.67 26.33 20.66 26.35 20.65C26.37 20.64 26.39 20.63 26.4 20.61C26.41 20.59 26.42 20.57 26.42 20.54V16.67C26.42 16.64 26.43 16.62 26.44 16.61C26.45 16.59 26.47 16.58 26.49 16.56C26.51 16.55 26.53 16.55 26.56 16.55C26.58 16.55 26.6 16.56 26.62 16.56L28.89 17.96C28.91 17.97 28.93 17.98 28.96 17.98C28.98 17.98 29 17.97 29.02 17.96C29.04 17.95 29.06 17.94 29.07 17.92C29.08 17.9 29.09 17.88 29.09 17.86V15.32L29.09 15.35Z" fill="white"/>
                      </svg>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setMethod("cod");
                      console.log("Payment method set to cod");
                    }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      method === "cod" 
                        ? "border-amber-500 bg-amber-50 shadow-sm" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === "cod" ? "border-amber-500" : "border-gray-400"
                      }`}>
                        {method === "cod" && (
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`font-medium ${method === "cod" ? "text-amber-600" : "text-gray-700"}`}>
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pay with cash when your order is delivered
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <div className="bg-amber-100 rounded-md p-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-4 px-6">
                <h2 className="text-white text-xl font-semibold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                {/* Coupon Code section */}
                {!appliedCoupon ? (
                  <div className="mb-6 border-b border-gray-100 pb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Apply Coupon Code</p>
                    <div className="flex mb-3 relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={handleCouponChange}
                        className="border border-gray-300 rounded-l-md pl-10 pr-4 py-2.5 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm font-medium uppercase placeholder-gray-400 shadow-sm transition-all group-hover:border-pink-300"
                        aria-label="Coupon code"
                      />
                      <button 
                        type="button"
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                        className={`px-4 rounded-r-md text-sm font-medium flex items-center justify-center min-w-[90px] transition-all ${
                          isApplyingCoupon
                            ? "bg-gray-100 text-gray-400 border-t border-r border-b border-gray-300"
                            : couponCode
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-md"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-t border-r border-b border-gray-300"
                        }`}
                      >
                        {isApplyingCoupon ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          "APPLY"
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                      <p className="font-medium mb-2 text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        Available coupons:
                      </p>
                      <div className="space-y-2 mt-1.5">
                        {availableCoupons.map((coupon, index) => (
                          <div key={index} className="flex items-center group">
                            <button
                              type="button"
                              onClick={() => setCouponCode(coupon.code)}
                              className="font-medium text-pink-600 hover:text-pink-700 bg-white px-2 py-0.5 text-xs rounded border border-pink-100 shadow-sm hover:shadow group-hover:border-pink-200 transition-all mr-2"
                            >
                              {coupon.code}
                            </button>
                            <span className="text-gray-600">{coupon.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 border-b border-gray-100 pb-6">
                    <div className="border border-green-200 rounded-lg p-3 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="bg-white py-1 px-2.5 rounded-full border border-green-200 shadow-sm">
                              <p className="font-bold text-green-700 text-sm tracking-wide">{appliedCoupon.code}</p>
                            </div>
                          </div>
                          <p className="text-sm text-green-700 mt-1.5 font-medium">You saved <span className="font-bold">₹{discount}</span> on this order</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="bg-white text-red-600 hover:bg-red-50 text-sm font-medium px-3 py-1.5 rounded-full border border-red-200 hover:border-red-300 transition-colors shadow-sm hover:shadow"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Subtotal</p>
                    <p className="text-sm font-medium text-gray-700">₹{getCartAmount()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Delivery Fee</p>
                    <p className="text-sm font-medium text-gray-700">₹{delivery_fee}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Additional Costs</p>
                    <p className="text-sm font-medium text-gray-700">₹{calculateAdditionalCosts()}</p>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <p className="text-sm font-medium">Discount</p>
                      <p className="text-sm font-medium">- ₹{discount}</p>
                    </div>
                  )}
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-gray-900">Total</p>
                      <p className="text-base font-semibold text-gray-900">₹{getTotalAmount()}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Order</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;

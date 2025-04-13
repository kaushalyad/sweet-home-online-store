import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("razorpay");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
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

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    console.log("initPay called with order:", order);
    
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      console.error("Razorpay script not loaded! Make sure the script tag is in your HTML.");
      toast.error("Payment gateway not available. Please try again later.");
      return;
    }
    
    // Get key from env
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Using Razorpay key:", razorpayKey);
    
    if (!razorpayKey) {
      console.error("Razorpay key is missing in environment variables!");
      toast.error("Payment configuration error. Please contact support.");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Sweet Home",
      description: "Payment for your order at Sweet Home",
      order_id: order.id,
      receipt: order.receipt,
      prefill: {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        contact: formData.phone
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
              ...response,
              userId: order.receipt // This is necessary for order ID lookup
            },
            { headers: { token } }
          );
          
          if (data.success) {
            toast.success("Payment successful!");
            setCartItems({});
            navigate("/orders");
          } else {
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
    console.log("Form submitted, method:", method);
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      console.log("Order data prepared:", orderData);

      switch (method) {
        // API Calls for COD
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case "razorpay":
          console.log("Initiating Razorpay payment...");
          try {
            const responseRazorpay = await axios.post(
              backendUrl + "/api/order/razorpay",
              orderData,
              { headers: { token } }
            );
            console.log("Razorpay API response:", responseRazorpay.data);
            
            if (responseRazorpay.data.success) {
              console.log("Calling initPay with order:", responseRazorpay.data.order);
              initPay(responseRazorpay.data.order);
            } else {
              console.error("Razorpay API failed:", responseRazorpay.data);
              toast.error(responseRazorpay.data.message || "Failed to initialize payment");
            }
          } catch (error) {
            console.error("Razorpay API error:", error);
            toast.error("Failed to connect to payment server. Please try again.");
          }
          break;

        default:
          console.error("Unknown payment method:", method);
          break;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.message || "An error occurred while placing your order");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- Left Side ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/* ------------- Right Side ------------------ */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row mt-4">
            <div
              onClick={() => {
                setMethod("razorpay");
                console.log("Payment method set to razorpay");
              }}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "razorpay" ? "border-green-500 bg-green-50" : ""
              }`}
            >
              <div
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  method === "razorpay" ? "border-green-500" : "border-gray-400"
                }`}
              >
                {method === "razorpay" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <p className="text-gray-700 font-medium mx-4">ONLINE PAYMENT</p>
            </div>
            
            <div
              onClick={() => {
                setMethod("cod");
                console.log("Payment method set to COD");
              }}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "cod" ? "border-green-500 bg-green-50" : ""
              }`}
            >
              <div
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                  method === "cod" ? "border-green-500" : "border-gray-400"
                }`}
              >
                {method === "cod" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <p className="text-gray-700 font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm rounded-sm hover:bg-gray-800 transition-colors"
            >
              {method === "razorpay" ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

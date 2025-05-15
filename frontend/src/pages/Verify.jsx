import React from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const razorpay_order_id = searchParams.get("razorpay_order_id");
  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_signature = searchParams.get("razorpay_signature");

  const verifyPayment = async () => {
    try {
      if (!token) {
        toast.error("Authentication required");
        navigate("/login");
        return;
      }

      // Get user ID from token
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
        // Razorpay verification
        const response = await axios.post(
          `${backendUrl}/api/order/verifyRazorpay`,
          {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId
          },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
          toast.success("Payment successful!");
        } else {
          toast.error(response.data.message || "Payment verification failed");
          navigate("/cart");
        }
      } else if (success && orderId) {
        // Stripe verification
        const response = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
          toast.success("Payment successful!");
        } else {
          toast.error(response.data.message || "Payment verification failed");
          navigate("/cart");
        }
      } else {
        toast.error("Invalid payment response");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(error.response?.data?.message || error.message || "Payment verification failed");
      navigate("/cart");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-black"></div>
    </div>
  );
};

export default Verify;

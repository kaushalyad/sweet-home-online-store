import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaTimes } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";

const VerifyAccount = () => {
  const { backendUrl, setToken } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(
    location.state?.identifier || ""
  );
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeVerifyModal = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    if (location.state?.identifier && !sentTo) {
      setSentTo(location.state?.identifier);
    }
  }, [location.state, sentTo]);

  const handleSendOtp = async () => {
    const raw = identifier.trim();
    if (!raw) {
      toast.error("Enter your email or mobile number to receive OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/send-otp`,
        { identifier: raw },
        { withCredentials: true }
      );

      if (response.data.success) {
        setOtpSent(true);
        setSentTo(response.data.emailSentTo || response.data.phoneSentTo || raw);
        toast.success(response.data.message || "OTP sent successfully");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const raw = identifier.trim();
    if (!raw) {
      toast.error("Enter your email or mobile number first");
      return;
    }
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/verify-otp`,
        { identifier: raw, otp: otp.trim() },
        { withCredentials: true }
      );

      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        toast.success("Your account is verified. You are now logged in.");
        navigate("/");
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 sm:p-6"
      >
        <button
          type="button"
          onClick={closeVerifyModal}
          className="absolute inset-0 bg-transparent"
          aria-label="Close verification dialog"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.24, type: "spring", damping: 24, stiffness: 320 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <button
            type="button"
            onClick={closeVerifyModal}
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition hover:bg-white"
            aria-label="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          <div className="md:flex">
            <aside className="hidden md:flex md:w-[42%] lg:w-[40%] relative overflow-hidden bg-[#2874f0] text-white p-10 lg:p-12 flex-col justify-between">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_10%,white,transparent_45%)] pointer-events-none" />
              <div className="relative z-10">
                <h1 className="text-3xl lg:text-[32px] font-semibold leading-tight">Verify your account</h1>
                <p className="mt-4 text-[15px] leading-relaxed text-blue-100 max-w-[300px]">
                  Finish signing up by confirming the code we sent to your email or phone.
                </p>
              </div>
              <div className="relative z-10 hidden lg:block max-w-[220px]">
                <div className="h-64 w-full rounded-3xl bg-white/10 p-6">
                  <p className="text-sm text-blue-100">Secure access with OTP makes your account safer and keeps your orders protected.</p>
                </div>
              </div>
            </aside>

            <main className="flex-1 px-6 py-8 sm:px-8 sm:py-10">
              <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-gray-200">
                <button
                  type="button"
                  onClick={closeVerifyModal}
                  className="inline-flex items-center gap-2 mb-6 text-sm text-[#2874f0] hover:text-[#1f5ec8]"
                >
                  <FaArrowLeft className="h-4 w-4" /> Back
                </button>

                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Verify account</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Enter the 6-digit OTP sent to your email or mobile number to complete registration.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label htmlFor="verify-identifier" className="block text-sm text-gray-600 mb-1.5">
                      Email or mobile number
                    </label>
                    <input
                      type="text"
                      id="verify-identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      autoComplete="username"
                      className="block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                      placeholder="you@example.com or 9876543210"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="verify-otp" className="text-sm text-gray-600">
                        OTP code
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="text-xs font-semibold text-[#2874f0] hover:underline"
                      >
                        {otpSent ? "Resend OTP" : "Send OTP"}
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="verify-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                        placeholder="6-digit OTP"
                      />
                    </div>
                    {sentTo ? (
                      <p className="mt-2 text-xs text-gray-500">
                        OTP sent to <span className="font-medium">{sentTo}</span>.
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 disabled:opacity-60 transition-colors"
                  >
                    {loading ? "Verifying…" : "Verify and continue"}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Already verified? <Link to="/login" className="text-[#2874f0] hover:underline">Log in</Link>
                </p>
              </div>
            </main>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default VerifyAccount;

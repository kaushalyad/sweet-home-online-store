import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUser,
  FaTimes,
  FaHeart,
  FaShoppingBag,
  FaTruck,
} from "react-icons/fa";
import { assets } from "../assets/assets";
import FlipkartAuthIllustration from "../components/FlipkartAuthIllustration";

const perks = [
  { icon: FaHeart, text: "Save favorites & wishlists for later" },
  { icon: FaShoppingBag, text: "Checkout faster with saved details" },
  { icon: FaTruck, text: "Track every order in real time" },
];

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = location.pathname === "/register";

  const [loginData, setLoginData] = useState({
    identifier: "",
  });
  const [mobileForOtp, setMobileForOtp] = useState(""); // For Flipkart-style mobile entry
  const [signupData, setSignupData] = useState({
    identifier: "",
  });
  const [signupStep, setSignupStep] = useState("identify"); // identify -> mobile -> otp
  const [signupMobile, setSignupMobile] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [loginStep, setLoginStep] = useState("identify"); // identify -> mobile (if email) -> otp
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [otpTarget, setOtpTarget] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const resendTimerRef = useRef(null);
  const otpInputsRef = useRef([]);
  const { setToken, backendUrl, token } = useContext(ShopContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeAuthModal = () => {
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

  // Prefill from first-visit modal (Flipkart-style single field)
  useEffect(() => {
    const prefill = location.state?.prefillIdentifier;
    if (!prefill || typeof prefill !== "string") return;
    const trimmed = prefill.trim();
    if (!trimmed) return;
    setLoginData((prev) => ({ ...prev, identifier: trimmed }));
  }, [location.pathname, location.state]);

  useEffect(() => {
    if (!isSignup) return;
    const prefill = location.state?.prefillIdentifier;
    if (!prefill || typeof prefill !== "string") return;
    const trimmed = prefill.trim();
    if (!trimmed) return;
    setSignupData((prev) => ({ ...prev, identifier: trimmed }));
  }, [isSignup, location.state]);

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const normalizeMobileInput = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("0")) {
      return digits.slice(1);
    }
    if (digits.length >= 12 && digits.startsWith("91")) {
      return digits.slice(digits.length - 10);
    }
    if (digits.length > 10) {
      return digits.slice(-10);
    }
    return digits;
  };

  const resetSignupFlow = () => {
    setSignupStep("identify");
    setSignupData({ identifier: "" });
    setSignupMobile("");
    setSignupEmail("");
    setIsOtpSent(false);
    setOtpDigits(Array(6).fill(""));
    setOtpTarget("");
    setOtpIdentifier("");
    setResendTimer(0);
  };

  const handleSignupMobileChange = (e) => {
    const digits = normalizeMobileInput(e.target.value);
    setSignupMobile(digits.slice(0, 10));
  };

  const onSendOtp = async (manualIdentifier = null) => {
    const raw = manualIdentifier || loginData.identifier.trim();
    if (!raw) {
      toast.error("Enter email or mobile number to receive OTP");
      return;
    }

    // Flipkart-style: If email is provided, check existence before asking for mobile
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
    if (isEmail && !mobileForOtp && !manualIdentifier) {
      setOtpLoading(true);
      try {
        const checkResponse = await axios.post(`${backendUrl}/api/user/check-identifier`, {
          identifier: raw,
        });

        if (!checkResponse.data.exists) {
          toast.info("No account found. Redirecting to register...");
          navigate("/register", {
            replace: true,
            state: { prefillIdentifier: raw },
          });
          return;
        }

        // Account exists, ask for mobile number
        setLoginStep("mobile");
        return;
      } catch (error) {
        toast.error(error.response?.data?.message || "Error checking account");
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    const otpIdentifier = manualIdentifier || mobileForOtp || raw;
    
    setOtpTarget(otpIdentifier);
    setOtpIdentifier(otpIdentifier);
    setOtpLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/send-otp`, {
        identifier: otpIdentifier,
      }, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsOtpSent(true);
        setLoginStep("otp");
        setOtpTarget(response.data.phoneSentTo || response.data.emailSentTo || otpIdentifier);
        setOtpDigits(Array(6).fill(""));
        setResendTimer(45);
        toast.success(response.data.message || "OTP sent successfully");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      if (error.response?.status === 404) {
        toast.info("No account found. Redirecting to register...");
        navigate("/register", {
          replace: true,
          state: { prefillIdentifier: raw },
        });
        return;
      }
      toast.error(
        serverMessage || "Unable to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const getOtpValue = () => otpDigits.join("");

  const verifyOtpCode = async (otp) => {
    const identifierForOtp = otpIdentifier || otpTarget;
    if (!identifierForOtp) {
      toast.error("Enter email or mobile number first");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    setOtpError(false);
    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        identifier: identifierForOtp,
        otp: otp,
      }, {
        withCredentials: true,
      });

      if (response.data.success && response.data.token) {
        setOtpError(false);
        setToken(response.data.token);
        toast.success("OTP verified. You are logged in.");
        navigate("/");
      } else {
        setOtpError(true);
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setOtpError(true);
      toast.error(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = getOtpValue();
    await verifyOtpCode(otpValue);
  };

  const handleChangeLoginIdentifier = () => {
    setLoginStep("identify");
    setIsOtpSent(false);
    setOtpDigits(Array(6).fill(""));
    setOtpTarget("");
    setMobileForOtp(""); // Reset mobile input
    setResendTimer(0);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;

      // Clear error when user starts typing
      if (otpError) {
        setOtpError(false);
      }

      // Auto-verify if all 6 digits are filled
      if (digit && next.every((d) => d !== "")) {
        const completeOtp = next.join("");
        // Use setTimeout to avoid state update conflicts
        setTimeout(() => verifyOtpCode(completeOtp), 100);
      }

      return next;
    });
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (otpDigits[index]) {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        event.preventDefault();
        otpInputsRef.current[index - 1]?.focus();
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
      }
    }
  };

  const handleOtpPaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const digits = pasted.slice(0, 6).split("");
    setOtpDigits((prev) => {
      const next = [...prev];
      digits.forEach((digit, i) => {
        next[i] = digit;
      });

      // Auto-verify if all 6 digits are filled
      if (next.every((d) => d !== "")) {
        const completeOtp = next.join("");
        setTimeout(() => verifyOtpCode(completeOtp), 100);
      }

      return next;
    });
    const nextIndex = Math.min(digits.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
    event.preventDefault();
  };

  useEffect(() => {
    if (loginStep === "otp") {
      otpInputsRef.current[0]?.focus();
    }
  }, [loginStep]);

  useEffect(() => {
    if (!isOtpSent) {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
      return;
    }

    if (resendTimer <= 0) {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
      return;
    }

    resendTimerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(resendTimerRef.current);
          resendTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (resendTimerRef.current) {
        clearInterval(resendTimerRef.current);
        resendTimerRef.current = null;
      }
    };
  }, [isOtpSent, resendTimer]);



  const onSignup = async (e) => {
    e.preventDefault();

    const raw = signupData.identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);

    if (signupStep === "identify") {
      if (!raw) {
        toast.error("Please enter your email or mobile number");
        return;
      }

      if (isEmail) {
        // Check if email already exists before moving to mobile step
        setLoading(true);
        try {
          const checkResponse = await axios.post(`${backendUrl}/api/user/check-identifier`, {
            identifier: raw,
          });

          if (checkResponse.data.exists) {
            toast.info("Email already registered. Redirecting to login...");
            navigate("/login", {
              replace: true,
              state: { prefillIdentifier: raw },
            });
            return;
          }

          setSignupEmail(raw);
          setSignupStep("mobile");
        } catch (error) {
          toast.error(error.response?.data?.message || "Error checking email");
        } finally {
          setLoading(false);
        }
        return;
      }

      const normalizedPhone = normalizeMobileInput(raw);
      if (normalizedPhone.length !== 10) {
        toast.error("Please enter a valid mobile number");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          phone: normalizedPhone,
        });

        if (response.data.success) {
          setIsOtpSent(true);
          setSignupStep("otp");
          setOtpTarget(response.data.phoneSentTo || normalizedPhone);
          setOtpIdentifier(response.data.phoneSentTo || normalizedPhone);
          setOtpDigits(Array(6).fill(""));
          setResendTimer(45);
          toast.success(response.data.message || "OTP sent successfully");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Sign up failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (signupStep === "mobile") {
      if (!signupMobile || signupMobile.length !== 10) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          email: signupEmail,
          phone: signupMobile,
        });

        if (response.data.success) {
          setIsOtpSent(true);
          setSignupStep("otp");
          setOtpTarget(response.data.phoneSentTo || signupMobile);
          setOtpIdentifier(response.data.phoneSentTo || signupMobile);
          setOtpDigits(Array(6).fill(""));
          setResendTimer(45);
          toast.success(response.data.message || "OTP sent successfully");
        } else {
          if (response.data.message?.includes("Email already registered")) {
            toast.info("Email already exists. Redirecting to login...");
            navigate("/login", {
              replace: true,
              state: { prefillIdentifier: signupEmail },
            });
            return;
          }
          toast.error(response.data.message);
        }
      } catch (error) {
        const message = error.response?.data?.message;
        if (message?.includes("Email already registered")) {
          toast.info("Email already exists. Redirecting to login...");
          navigate("/login", {
            replace: true,
            state: { prefillIdentifier: signupEmail },
          });
          return;
        }
        toast.error(
          message || "Sign up failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
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
          onClick={closeAuthModal}
          className="absolute inset-0 bg-transparent"
          aria-label="Close authentication dialog"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.24, type: "spring", damping: 24, stiffness: 320 }}
          className="relative w-full max-w-[980px] overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex sm:min-h-[520px]"
        >
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
            aria-label="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          {/* Flipkart-style blue panel — copy switches for login vs signup (see flow) */}
          <aside className="hidden sm:flex sm:w-[40%] md:w-[42%] relative overflow-hidden bg-[#2874f0] text-white p-10 lg:p-12 flex-col justify-between">
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_10%,white,transparent_45%)] pointer-events-none" />
            <div className="relative z-10">
              {!isSignup ? (
                <>
                  <h1 className="mt-10 text-3xl lg:text-[32px] font-semibold leading-tight">
                    Login
                  </h1>
                  <p className="mt-4 text-[15px] leading-relaxed text-blue-100 max-w-[280px]">
                    Get access to your Orders, Wishlist and Recommendations.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="mt-10 text-3xl lg:text-[32px] font-semibold leading-tight">
                    Looks like you&apos;re new here!
                  </h1>
                  <p className="mt-4 text-[15px] leading-relaxed text-blue-100 max-w-[300px]">
                    Sign up with your email and mobile to get started — then shop
                    fresh sweets anytime.
                  </p>
                </>
              )}
            </div>
            {!isSignup ? (
              <ul className="relative z-10 space-y-4 mb-4">
                {perks.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-blue-50">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="pt-0.5">{text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="relative z-10 hidden lg:block max-w-[220px]">
              <FlipkartAuthIllustration className="w-full opacity-90" />
            </div>
          </aside>

          <main className="flex-1 px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-6 sm:hidden bg-[#2874f0] text-white rounded-3xl p-5">
              <div className="flex items-center gap-3">
                <div>
                  {!isSignup ? (
                    <>
                      <p className="font-semibold text-lg">Login</p>
                      <p className="text-xs text-blue-100 mt-0.5 leading-snug">
                        Orders, wishlist & offers in one place.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-lg">Create account</p>
                      <p className="text-xs text-blue-100 mt-0.5 leading-snug">
                        You&apos;re new here — let&apos;s get you started.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
              {/* Log in | Create account — same as Flipkart top switch */}
              <div
              className="flex p-0.5 rounded-lg bg-gray-100 mb-8 border border-gray-200"
              role="tablist"
              aria-label="Account"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isSignup}
                onClick={() => navigate("/login", { replace: true })}
                className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  !isSignup
                    ? "bg-white text-[#2874f0] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={isSignup}
                onClick={() => navigate("/register", { replace: true })}
                className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  isSignup
                    ? "bg-white text-[#2874f0] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Create account
              </button>
            </div>

            {!isSignup ? (
              <form
                onSubmit={(e) => {
                  if (loginStep === "otp" && isOtpSent) {
                    onVerifyOtp(e);
                  } else {
                    e.preventDefault();
                    onSendOtp();
                  }
                }}
                className="space-y-5"
              >
                {loginStep === "identify" ? (
                  <>
                    <div>
                      <label
                        htmlFor="login-identifier"
                        className="block text-sm text-gray-600 mb-1.5"
                      >
                        Enter Email or Mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="identifier"
                          id="login-identifier"
                          required
                          autoComplete="username"
                          className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                          placeholder="Email or mobile"
                          value={loginData.identifier}
                          onChange={handleLoginChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 disabled:opacity-60 transition-colors"
                      >
                        {otpLoading ? "Sending OTP…" : "Request OTP"}
                      </button>
                      <p className="text-xs text-gray-500">
                        Enter your email or mobile number to receive a 6-digit login code.
                      </p>
                    </div>
                  </>
                ) : loginStep === "mobile" ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-700 mb-4 font-semibold">
                        Enter your mobile number to receive OTP
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        We'll send a 6-digit code to verify your phone number.
                      </p>
                      <label htmlFor="mobile-otp" className="block text-sm text-gray-600 mb-1.5">
                        Mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="mobile-otp"
                          required
                          autoComplete="tel"
                          className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                          placeholder="10-digit mobile number"
                          value={mobileForOtp}
                          onChange={(e) => {
                            const digits = normalizeMobileInput(e.target.value);
                            setMobileForOtp(digits.slice(0, 10));
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <button
                        type="submit"
                        disabled={otpLoading || mobileForOtp.length !== 10}
                        className="w-full rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 disabled:opacity-60 transition-colors"
                      >
                        {otpLoading ? "Sending OTP…" : "Send OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={handleChangeLoginIdentifier}
                        className="w-full text-sm font-semibold text-[#2874f0] hover:underline py-2"
                      >
                        Use different email or mobile
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-7">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-600">
                            Please enter the OTP sent to your email or mobile number.
                          </p>
                          {otpTarget && (
                            <p className="text-sm text-slate-500 mt-1">
                              OTP sent to <span className="font-medium text-slate-900">{otpTarget}</span>
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleChangeLoginIdentifier}
                          className="text-sm font-semibold text-[#2874f0] hover:underline"
                        >
                          Change
                        </button>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm text-slate-500 mb-3">
                          Enter your 6-digit code
                        </label>
                        <div
                          className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 p-4"
                          onPaste={handleOtpPaste}
                        >
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => (otpInputsRef.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className={`h-14 w-14 rounded-[18px] border bg-transparent text-center text-2xl font-semibold tracking-[0.32em] text-slate-900 outline-none transition ${
                                otpError
                                  ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                                  : "border-gray-200 focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={otpLoading}
                          className="w-full sm:w-auto rounded-3xl bg-[#2874f0] px-8 py-3 text-[15px] font-semibold text-white shadow-lg shadow-slate-200/50 transition hover:bg-[#1f5bb8] disabled:opacity-60"
                        >
                          {otpLoading ? "Verifying…" : "Verify"}
                        </button>
                        <button
                          type="button"
                          onClick={onSendOtp}
                          disabled={otpLoading || resendTimer > 0}
                          className="w-full sm:w-auto rounded-3xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#2874f0] hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>

                      <p className="mt-5 text-sm text-slate-500">
                        Not received your code? Please wait a few seconds and resend if needed.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-center pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate("/register", { replace: true })}
                    className="text-sm font-semibold text-[#2874f0] hover:underline"
                  >
                    New to Sweet Home? Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  if (signupStep === "otp") {
                    onVerifyOtp(e);
                  } else {
                    onSignup(e);
                  }
                }}
                className="space-y-4"
              >
                {signupStep === "identify" ? (
                  <>
                    <p className="text-sm text-gray-600 -mt-2 mb-2">
                      Enter your email or mobile number to get started.
                    </p>

                    <div>
                      <label htmlFor="signup-identifier" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email or mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="identifier"
                          id="signup-identifier"
                          required
                          autoComplete="username"
                          className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                          placeholder="Email or mobile"
                          value={signupData.identifier}
                          onChange={handleSignupChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 disabled:opacity-60 transition-colors"
                    >
                      {loading ? "Please wait…" : "Continue"}
                    </button>
                  </>
                ) : signupStep === "mobile" ? (
                  <>
                    <p className="text-sm text-gray-600 -mt-2 mb-2">
                      Enter your mobile number to verify your account.
                    </p>

                    <div>
                      <p className="text-sm text-slate-700 mb-2">
                        We will send a 6-digit code to the mobile number you provide.
                      </p>
                      <label htmlFor="signup-mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Mobile number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="signup-mobile"
                          required
                          autoComplete="tel"
                          className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none"
                          placeholder="10-digit mobile number"
                          value={signupMobile}
                          onChange={handleSignupMobileChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={loading || signupMobile.length !== 10}
                        className="w-full mt-2 rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 disabled:opacity-60 transition-colors"
                      >
                        {loading ? "Please wait…" : "Send OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={resetSignupFlow}
                        className="w-full text-sm font-semibold text-[#2874f0] hover:underline py-2"
                      >
                        Use different email or mobile
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-7">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-sm text-slate-600">
                            Please enter the OTP sent to your mobile number.
                          </p>
                          {otpTarget && (
                            <p className="text-sm text-slate-500 mt-1">
                              OTP sent to <span className="font-medium text-slate-900">{otpTarget}</span>
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={resetSignupFlow}
                          className="text-sm font-semibold text-[#2874f0] hover:underline"
                        >
                          Change
                        </button>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm text-slate-500 mb-3">
                          Enter your 6-digit code
                        </label>
                        <div
                          className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 p-4"
                          onPaste={handleOtpPaste}
                        >
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => (otpInputsRef.current[index] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className={`h-14 w-14 rounded-[18px] border bg-transparent text-center text-2xl font-semibold tracking-[0.32em] text-slate-900 outline-none transition ${
                                otpError
                                  ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                                  : "border-gray-200 focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="submit"
                          disabled={otpLoading}
                          className="w-full sm:w-auto rounded-3xl bg-[#2874f0] px-8 py-3 text-[15px] font-semibold text-white shadow-lg shadow-slate-200/50 transition hover:bg-[#1f5bb8] disabled:opacity-60"
                        >
                          {otpLoading ? "Verifying…" : "Verify"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onSendOtp(otpIdentifier || otpTarget)}
                          disabled={otpLoading || resendTimer > 0}
                          className="w-full sm:w-auto rounded-3xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-[#2874f0] hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:text-slate-400"
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>

                      <p className="mt-5 text-sm text-slate-500">
                        Not received your code? Please wait a few seconds and resend if needed.
                      </p>
                    </div>
                  </div>
                )}

                {signupStep !== "otp" && (
                  <p className="text-center pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate("/login", { replace: true })}
                      className="text-sm font-semibold text-[#2874f0] hover:underline"
                    >
                      Existing user? Log in
                    </button>
                  </p>
                )}
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed px-2">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-[#2874f0] hover:underline font-medium">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#2874f0] hover:underline font-medium">
              Privacy Policy
            </Link>
            .
          </p>
      </main>
    </motion.div>
  </motion.div>
</AnimatePresence>,
document.body
);
};

export default Auth;

import React, { useContext, useEffect, useState } from "react";
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
  FaLock,
  FaUser,
  FaTimes,
  FaPhone,
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

  const [currentState, setCurrentState] = useState(isSignup ? "Sign Up" : "Login");
  const [name, setName] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { setToken, backendUrl, token } = useContext(ShopContext);

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

  const toggleForm = () => {
    setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
    setName("");
    setLoginIdentifier("");
    setEmail("");
    setMobile("");
    setPassword("");
    setPasswordVisible(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        if (!name.trim()) {
          toast.error("Please enter your full name");
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          toast.error("Please enter your email");
          setLoading(false);
          return;
        }
        if (!mobile.trim()) {
          toast.error("Please enter your mobile number");
          setLoading(false);
          return;
        }
        if (mobile.length !== 10) {
          toast.error("Please enter a valid 10-digit mobile number");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/user/register`,
          {
            name,
            email,
            phone: mobile,
            password,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Account created successfully!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        } else {
          toast.error(response.data.message || "Signup failed");
        }
      } else {
        if (!loginIdentifier.trim()) {
          toast.error("Please enter your email or mobile number");
          setLoading(false);
          return;
        }
        if (!password.trim()) {
          toast.error("Please enter your password");
          setLoading(false);
          return;
        }

        const isEmailIdentifier = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginIdentifier.trim());
        const payload = isEmailIdentifier
          ? { email: loginIdentifier.trim(), password }
          : { phone: loginIdentifier.trim(), password };

        const response = await axios.post(
          `${backendUrl}/api/user/login`,
          payload,
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Logged in successfully!");
          setToken(response.data.token);

          if (rememberMe) {
            localStorage.setItem("token", response.data.token);
          } else {
            sessionStorage.setItem("token", response.data.token);
          }
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(errorMsg);
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
          onClick={closeAuthModal}
          className="absolute inset-0 bg-transparent"
          aria-label="Close authentication dialog"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{
            duration: 0.24,
            type: "spring",
            damping: 24,
            stiffness: 320,
          }}
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

          {/* Flipkart-style blue panel */}
          <aside className="hidden sm:flex sm:w-[40%] md:w-[42%] relative overflow-hidden bg-[#2874f0] text-white p-10 lg:p-12 flex-col justify-between">
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_20%_10%,white,transparent_45%)] pointer-events-none" />
            <div className="relative z-10">
              {currentState === "Login" ? (
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
                    Sign up with your email to get started — then shop fresh
                    sweets anytime.
                  </p>
                </>
              )}
            </div>
            {currentState === "Login" ? (
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
                  {currentState === "Login" ? (
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
              {/* Log in | Create account tab switcher */}
              <div
                className="flex p-0.5 rounded-lg bg-gray-100 mb-8 border border-gray-200"
                role="tablist"
                aria-label="Account"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={currentState === "Login"}
                  onClick={() => {
                    setCurrentState("Login");
                    navigate("/login", { replace: true });
                  }}
                  className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                    currentState === "Login"
                      ? "bg-white text-[#2874f0] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={currentState === "Sign Up"}
                  onClick={() => {
                    setCurrentState("Sign Up");
                    navigate("/register", { replace: true });
                  }}
                  className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                    currentState === "Sign Up"
                      ? "bg-white text-[#2874f0] shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-5">
                {currentState === "Sign Up" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required={currentState === "Sign Up"}
                        className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none transition-colors"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    {currentState === "Login" ? "Email or Mobile Number" : "Email Address"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="identifier"
                      name="identifier"
                      type={currentState === "Login" ? "text" : "email"}
                      autoComplete={currentState === "Login" ? "username" : "email"}
                      required
                      className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none transition-colors"
                      placeholder={currentState === "Login" ? "Email or mobile number" : "email@example.com"}
                      value={currentState === "Login" ? loginIdentifier : email}
                      onChange={(e) =>
                        currentState === "Login"
                          ? setLoginIdentifier(e.target.value)
                          : setEmail(e.target.value)
                      }
                    />
                  </div>
                </div>

                {currentState === "Sign Up" && (
                  <div>
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        autoComplete="tel"
                        required
                        className="pl-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none transition-colors"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setMobile(digits);
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete={
                        currentState === "Login"
                          ? "current-password"
                          : "new-password"
                      }
                      required
                      className="pl-10 pr-10 block w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] focus:ring-2 focus:ring-[#2874f0]/30 focus:border-[#2874f0] outline-none transition-colors"
                      placeholder={
                        currentState === "Login"
                          ? "Your password"
                          : "Create a secure password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {currentState === "Login" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0] border-gray-300 rounded cursor-pointer"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-[#2874f0] hover:text-[#1f5bb8] transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold uppercase tracking-wide text-white shadow-md hover:bg-[#fa5720] focus:outline-none focus:ring-2 focus:ring-[#fb641b] focus:ring-offset-2 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Please wait...
                    </span>
                  ) : currentState === "Login" ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </button>

                <p className="text-center pt-2 border-t border-gray-100 text-sm">
                  {currentState === "Login"
                    ? "New to Sweet Home? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="font-semibold text-[#2874f0] hover:text-[#1f5bb8] transition-colors"
                  >
                    {currentState === "Login" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed px-2">
              By continuing, you agree to our{" "}
              <Link
                to="/terms"
                className="text-[#2874f0] hover:underline font-medium"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-[#2874f0] hover:underline font-medium"
              >
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


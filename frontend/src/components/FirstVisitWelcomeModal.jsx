import { useContext, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import FlipkartAuthIllustration from "./FlipkartAuthIllustration";

const STORAGE_KEY = "sweetHomeFirstVisitWelcomeDismissed";

export default function FirstVisitWelcomeModal() {
  const { token } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    if (token) {
      setOpen(false);
      return;
    }

    const hiddenAuthPaths = [
      "/login",
      "/register",
      "/verify",
      "/verify-account",
      "/forgot-password",
      "/reset-password",
    ];

    if (hiddenAuthPaths.includes(location.pathname)) return;

    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setOpen(true), 350);
    return () => clearTimeout(t);
  }, [token, location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  const handleContinue = (e) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    dismiss();
    if (trimmed) {
      navigate("/login", { state: { prefillIdentifier: trimmed } });
    } else {
      navigate("/login");
    }
  };

  const goRegister = () => {
    dismiss();
    navigate("/register");
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="first-visit-login-title"
          className="fixed inset-0 z-[10050] flex items-center justify-center p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] cursor-default"
            aria-label="Close dialog"
            onClick={dismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 flex w-full max-w-lg md:max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:flex-row md:max-h-[min(90vh,520px)]"
          >
            {/* Flipkart-style left panel */}
            <div className="relative flex shrink-0 flex-col justify-between bg-[#2874f0] px-8 pb-8 pt-10 text-white md:w-[42%] md:min-h-[320px]">
              <div>
                <h2
                  id="first-visit-login-title"
                  className="text-2xl font-semibold tracking-tight md:text-3xl"
                >
                  Login
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-blue-100">
                  Get access to your Orders, Wishlist and exclusive Sweet Home
                  offers.
                </p>
              </div>
              <div className="mt-8 hidden md:block">
                <FlipkartAuthIllustration className="w-full max-w-[200px] mx-auto md:mx-0 opacity-95" />
              </div>
            </div>

            {/* Form panel */}
            <div className="relative flex flex-1 flex-col px-6 pb-8 pt-6 sm:px-8 md:pt-10">
              <button
                type="button"
                onClick={dismiss}
                className="absolute right-3 top-3 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <FaTimes className="h-4 w-4" />
              </button>

              <form onSubmit={handleContinue} className="mt-2 flex flex-1 flex-col">
                <label htmlFor="first-visit-id" className="sr-only">
                  Email or mobile number
                </label>
                <input
                  id="first-visit-id"
                  type="text"
                  autoComplete="username"
                  inputMode="email"
                  className="w-full rounded-sm border border-gray-300 px-3 py-3 text-[15px] outline-none transition-shadow focus:border-[#2874f0] focus:ring-2 focus:ring-[#2874f0]/25"
                  placeholder="Enter Email or Mobile number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <p className="mt-3 text-xs leading-snug text-gray-500">
                  By continuing, you agree to Sweet Home&apos;s{" "}
                  <Link
                    to="/terms"
                    onClick={dismiss}
                    className="text-[#2874f0] hover:underline"
                  >
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    onClick={dismiss}
                    className="text-[#2874f0] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Next, enter your password on the sign-in page to complete login.
                </p>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-sm bg-[#fb641b] py-3 text-[15px] font-semibold text-white shadow-md transition-transform hover:bg-[#fa5720] active:scale-[0.99]"
                >
                  Continue
                </button>
              </form>

              <button
                type="button"
                onClick={goRegister}
                className="mt-6 text-center text-sm font-medium text-[#2874f0] hover:underline"
              >
                New to Sweet Home? Create an account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

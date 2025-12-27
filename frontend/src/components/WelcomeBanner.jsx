import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaGift } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { token } = useContext(ShopContext);

  useEffect(() => {
    // Don't show if user is logged in
    if (token) return;

    // Check if banner was dismissed
    const dismissed = localStorage.getItem('welcomeBannerDismissed');
    const dismissedTime = localStorage.getItem('welcomeBannerDismissedTime');

    // Show banner again after 7 days
    if (dismissed && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // Show banner immediately
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [token]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcomeBannerDismissed', 'true');
    localStorage.setItem('welcomeBannerDismissedTime', Date.now().toString());
  };

  if (!isVisible || token) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 shadow-2xl">
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1">
            <FaGift className="text-2xl hidden sm:block" />
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">
                Welcome to Sweet Home! 🎉
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                Sign up now and get <span className="font-bold">10% OFF</span> on your first order!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
              onClick={handleDismiss}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white hover:text-orange-600 transition-colors whitespace-nowrap"
              onClick={handleDismiss}
            >
              Login
            </Link>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

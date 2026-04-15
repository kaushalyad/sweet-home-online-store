import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaUserAlt } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const { token } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) return;

    const authPaths = ['/login', '/register', '/verify', '/verify-account', '/forgot-password', '/reset-password'];
    if (authPaths.includes(location.pathname)) return;

    const showTimer = setTimeout(() => setIsVisible(true), 5000);
    const vibrateTimer = setTimeout(() => setIsVibrating(true), 7000);
    const stopVibrateTimer = setTimeout(() => setIsVibrating(false), 14000);
    const autoHideTimer = setTimeout(() => setIsVisible(false), 25000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(vibrateTimer);
      clearTimeout(stopVibrateTimer);
      clearTimeout(autoHideTimer);
    };
  }, [token, location.pathname]);

  const handleLoginClick = () => {
    setIsVisible(false);
    navigate('/login');
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || token) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[10000]">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#b91c1c] text-white shadow-2xl shadow-red-500/20 border border-red-600 overflow-hidden">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white text-lg">
              <FaUserAlt />
            </span>
            <div>
              <p className="font-semibold text-sm sm:text-base">Login now to unlock best prices</p>
              <p className="text-xs sm:text-sm text-red-100 opacity-90">Quick login to access deals and order faster.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            <button
              type="button"
              onClick={handleLoginClick}
              className={`px-4 py-2 rounded-full bg-white text-red-700 font-semibold transition-colors ${isVibrating ? 'login-vibrate' : ''}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-red-100 hover:text-white"
            >
              dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;

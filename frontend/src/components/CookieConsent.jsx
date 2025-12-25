import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookie, FaShieldAlt, FaCog, FaChartBar, FaBullhorn, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true
  });

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookieConsent');
      
      if (!consent) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    };

    checkConsent();
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      rejected: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieCategories = [
    {
      key: 'necessary',
      title: 'Necessary Cookies',
      description: 'Essential for the website to function. Cannot be disabled.',
      icon: FaShieldAlt,
      locked: true,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      key: 'functional',
      title: 'Functional Cookies',
      description: 'Remember your preferences and enhance your experience.',
      icon: FaCog,
      locked: false,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how you use our website to improve it.',
      icon: FaChartBar,
      locked: false,
      gradient: 'from-green-500 to-green-600'
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Show you relevant ads based on your interests.',
      icon: FaBullhorn,
      locked: false,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Backdrop for Preferences Modal */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9997]"
              onClick={() => setShowPreferences(false)}
            />
          )}

          {/* Main Cookie Banner - Clean Bottom Bar */}
          {!showPreferences && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-[9998] bg-white border-t-2 border-gray-200 shadow-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left: Content */}
                  <div className="flex items-start sm:items-center gap-3 text-center sm:text-left flex-1">
                    <div className="hidden sm:flex items-center justify-center bg-orange-100 rounded-full p-2.5 flex-shrink-0">
                      <FaCookie className="text-orange-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        We use cookies to improve your experience. By continuing, you accept our 
                        <Link 
                          to="/cookie-policy" 
                          className="text-orange-600 hover:text-orange-700 font-semibold mx-1 underline"
                        >
                          Cookie Policy
                        </Link>
                      </p>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      Settings
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Modal - Enhanced Design */}
          {showPreferences && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl z-[9998] max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Gradient Header */}
              <div className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 px-6 py-6">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Cookie Preferences</h2>
                    <p className="text-sm text-white/90">Customize your privacy settings</p>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Description */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-5">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-blue-900">Your privacy matters to us.</strong> We use cookies to enhance your 
                    browsing experience, personalize content, and analyze traffic. You can customize which cookies 
                    you allow below.
                  </p>
                </div>

                {/* Cookie Categories - Enhanced Cards */}
                <div className="space-y-3">
                  {cookieCategories.map((category, index) => {
                    const Icon = category.icon;
                    const isEnabled = preferences[category.key];
                    
                    return (
                      <motion.div
                        key={category.key}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                          isEnabled 
                            ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-pink-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Active Indicator */}
                        {isEnabled && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg"
                          >
                            <FaCheckCircle className="text-white text-xs" />
                          </motion.div>
                        )}
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`relative p-2.5 rounded-xl bg-gradient-to-br ${category.gradient} shadow-md`}>
                              <Icon className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-gray-900 text-sm">
                                  {category.title}
                                </h3>
                                {category.locked && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          {/* Enhanced Toggle Switch */}
                          <button
                            onClick={() => togglePreference(category.key)}
                            disabled={category.locked}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all flex-shrink-0 ${
                              isEnabled ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                            } ${category.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg transform hover:scale-105'}`}
                          >
                            <motion.span
                              animate={{ x: isEnabled ? 24 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="inline-block h-5 w-5 transform rounded-full bg-white shadow-md"
                            />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Enhanced Info Box */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <div className="text-2xl">💡</div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      <strong className="font-bold">Tip:</strong> Disabling certain cookies may affect your 
                      experience and limit some features. We recommend accepting all cookies for the best experience.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Modal Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    to="/cookie-policy"
                    className="text-xs text-gray-600 hover:text-orange-600 font-semibold underline decoration-2 underline-offset-2 flex items-center gap-1"
                    onClick={() => setShowPreferences(false)}
                  >
                    📋 View Full Cookie Policy →
                  </Link>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAcceptSelected}
                      className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Confirm Choices
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

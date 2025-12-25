import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCookie, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CookieSettings = () => {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Load saved preferences
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences({
          necessary: true, // Always true
          functional: parsed.functional || false,
          analytics: parsed.analytics || false,
          marketing: parsed.marketing || false
        });
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        localStorage.removeItem('cookieConsent');
      }
    }
  }, []);

  const handleToggle = (type) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString()
    }));
  };

  const cookieTypes = [
    {
      type: 'necessary',
      title: 'Necessary Cookies',
      icon: '🔒',
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.',
      examples: 'Authentication, security, session management'
    },
    {
      type: 'functional',
      title: 'Functional Cookies',
      icon: '⚙️',
      description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.',
      examples: 'Language preferences, theme settings, region selection'
    },
    {
      type: 'analytics',
      title: 'Analytics Cookies',
      icon: '📊',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: 'Google Analytics, page views, user behavior'
    },
    {
      type: 'marketing',
      title: 'Marketing Cookies',
      icon: '🎯',
      description: 'These cookies are used to track visitors across websites and display ads that are relevant and engaging for the individual user.',
      examples: 'Ad targeting, retargeting, social media integration'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto sm:px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-4 rounded-full">
                <FaCookie className="text-orange-500 text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Cookie Settings</h1>
                <p className="text-gray-600">Manage your cookie preferences</p>
              </div>
            </div>
            <p className="text-gray-600">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              You can choose which types of cookies you want to allow.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="space-y-4">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-3xl">{cookie.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {cookie.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {cookie.description}
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">
                          <strong>Examples:</strong> {cookie.examples}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div className="ml-4">
                    <button
                      onClick={() => handleToggle(cookie.type)}
                      disabled={cookie.type === 'necessary'}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                        preferences[cookie.type]
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      } ${cookie.type === 'necessary' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                          preferences[cookie.type] ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-1 mt-2">
                      {preferences[cookie.type] ? (
                        <>
                          <FaCheckCircle className="text-green-500 text-sm" />
                          <span className="text-xs text-green-600 font-medium">Enabled</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-gray-400 text-sm" />
                          <span className="text-xs text-gray-500 font-medium">Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-gray-600">
                Changes will be saved to your browser's local storage.
              </p>
              <button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 whitespace-nowrap"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>

          {/* Additional Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Necessary cookies cannot be disabled as they are required for the website to function.</li>
              <li>• Disabling certain cookies may affect your user experience on our website.</li>
              <li>• Your cookie preferences are stored locally in your browser.</li>
              <li>• You can change your preferences at any time by returning to this page.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookieSettings;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCookie, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto sm:px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8 md:p-12"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaCookie className="text-orange-500 text-4xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Cookie Policy</h1>
              <p className="text-gray-500 mt-1">Last updated: December 23, 2025</p>
            </div>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains how Sweet Home Online Store ("we", "us", or "our") uses cookies 
              and similar technologies to recognize you when you visit our website. It explains what these 
              technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </section>

          {/* What are cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-orange-500" />
              What are cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          {/* Types of cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  🔒 Necessary Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies are essential for the website to function properly. They enable basic functions 
                  like page navigation, access to secure areas, and maintaining your login session.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Authentication tokens, shopping cart items, security tokens
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  ⚙️ Functional Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies enable enhanced functionality and personalization. They may be set by us or 
                  third-party providers whose services we use on our pages.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Language preferences, theme settings, remembered choices
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  📊 Analytics Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our website and services.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Google Analytics, page views, bounce rate, traffic sources
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  🎯 Marketing Cookies
                </h3>
                <p className="text-gray-700 mb-3">
                  These cookies are used to track visitors across websites. They are used to display 
                  ads that are relevant and engaging for the individual user.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Examples:</strong> Facebook Pixel, Google Ads, retargeting campaigns
                </p>
              </div>
            </div>
          </section>

          {/* How we use cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Cookies</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>To remember your login information and preferences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>To understand and analyze how you use our website</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>To improve our website performance and user experience</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>To provide personalized content and advertisements</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>To maintain the security and integrity of our website</span>
              </li>
            </ul>
          </section>

          {/* Your choices */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-orange-500" />
              Your Choices Regarding Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can exercise your 
              cookie preferences by:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>Using our cookie consent banner when you first visit our website</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>Managing your preferences through our Cookie Settings page</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-500 font-bold">•</span>
                <span>Adjusting your browser settings to refuse or delete cookies</span>
              </li>
            </ul>
            <Link
              to="/cookie-settings"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Manage Cookie Preferences
            </Link>
          </section>

          {/* Third party cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report 
              usage statistics of our website and deliver advertisements on and through our website.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> We do not control the third-party cookies and their use is governed 
                by the privacy policies of the third parties using such cookies.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> {' '}
                <a href="mailto:support@sweethome-store.com" className="text-orange-500 hover:text-orange-600">
                  support@sweethome-store.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> Sweet Home Online Store, India
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy 
              regularly to stay informed about our use of cookies.
            </p>
          </section>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <Link to="/privacy-policy" className="text-orange-500 hover:text-orange-600">
                Privacy Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/terms" className="text-orange-500 hover:text-orange-600">
                Terms of Service
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/cookie-settings" className="text-orange-500 hover:text-orange-600">
                Cookie Settings
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;

import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaGooglePay,
} from "react-icons/fa";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setNewsletterLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { 
        email: newsletterEmail 
      });
      if (response.data.success) {
        setNewsletterEmail('');
      } else {
        toast.error(response.data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };
  return (
    <footer className="w-full bg-white text-gray-700 border-t border-gray-200" role="contentinfo">
      {/* Newsletter Section */}
      <div className="w-full bg-gradient-to-r from-orange-600 to-orange-500 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              SIGN UP FOR NEWSLETTER
            </h3>
            <p className="text-white mb-6">
              Want To Get Latest Updates! Sign Up For Free.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={newsletterLoading}
                className="px-8 py-4 bg-white text-orange-600 rounded-full font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 text-lg font-bold mb-4 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/process" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Our Process
                </Link>
              </li>
              <li>
                <Link to="/csr" className="text-gray-700 hover:text-orange-500 transition-colors">
                  CSR Activities
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/offices" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Offices
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Retail Stores & Restaurants
                </Link>
              </li>
              <li>
                <Link to="/locator" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Store Locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-gray-900 text-lg font-bold mb-4 uppercase">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/bulk-orders" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Videos */}
          <div>
            <h4 className="text-gray-900 text-lg font-bold mb-4 uppercase">
              Videos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/brand-videos" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Brand Videos
                </Link>
              </li>
              <li>
                <Link to="/recipe-videos" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Recipe Videos
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Policies */}
          <div>
            <h4 className="text-gray-900 text-lg font-bold mb-4 uppercase">
              Our Policies
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/refund-policy" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/quality" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link to="/certifications" className="text-gray-700 hover:text-orange-500 transition-colors">
                  Certification & Accolades
                </Link>
              </li>
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h4 className="text-gray-900 text-lg font-bold mb-4 uppercase">
              Reach Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <FaEnvelope className="mt-1 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-700">Email:</p>
                  <a href="mailto:support@sweethome.com" className="text-gray-700 hover:text-orange-500">
                    support@sweethome.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FaPhoneAlt className="mt-1 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-700">Call:</p>
                  <a href="tel:+919931018857" className="text-gray-700 hover:text-orange-500">
                    +91 9931018857
                  </a>
                  <p className="text-xs mt-1 text-gray-500">
                    Customer Care Timings:<br />10:00 AM To 6:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h4 className="text-gray-900 text-lg font-bold mb-4 text-center">
            Payment Secured By
          </h4>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <FaCcVisa className="text-4xl text-gray-600 hover:text-orange-500 transition-colors" />
            <FaCcMastercard className="text-4xl text-gray-600 hover:text-orange-500 transition-colors" />
            <FaCcPaypal className="text-4xl text-gray-600 hover:text-orange-500 transition-colors" />
            <FaGooglePay className="text-4xl text-gray-600 hover:text-orange-500 transition-colors" />
            <FaCreditCard className="text-4xl text-gray-600 hover:text-orange-500 transition-colors" />
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8">
          <h4 className="text-gray-900 text-lg font-bold mb-4 text-center">
            Follow Us
          </h4>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.facebook.com/share/16jjrxdGV3/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/sweethome_ladania_store?igsh=MTlqbTEzeTI3a3Nrbw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
            >
              <FaPinterestP />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-gray-100 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Copyright © 2025 Sweet Home India Pvt Ltd
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
              <Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/cookie-policy" className="hover:text-orange-500 transition-colors">
                Cookie Policy
              </Link>
              <span>•</span>
              <Link to="/cookie-settings" className="hover:text-orange-500 transition-colors">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

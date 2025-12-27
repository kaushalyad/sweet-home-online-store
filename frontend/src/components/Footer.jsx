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
      <div className="w-full bg-gradient-to-br from-pink-600 via-orange-600 to-orange-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-poppins text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Stay Sweet & Updated!
            </h3>
            <p className="font-inter text-white/90 text-lg mb-8">
              Get exclusive offers, new arrivals, and sweet surprises in your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="font-inter flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 shadow-strong text-gray-900 transition-all duration-300"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                disabled={newsletterLoading}
                className="btn-interactive font-semibold px-8 py-4 bg-white text-orange-600 rounded-full hover:bg-gray-50 hover:scale-105 transition-all shadow-strong disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
              >
                <span className="relative z-10">{newsletterLoading ? 'Subscribing...' : 'Subscribe'}</span>
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

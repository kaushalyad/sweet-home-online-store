import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLink,
  FaBoxOpen,
  FaPlayCircle,
  FaShieldAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaGooglePay,
} from "react-icons/fa";
import { backendUrl } from "../config";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, {
        email: newsletterEmail,
      });
      if (response.data.success) {
        setNewsletterEmail("");
        toast.success(response.data.message || "You subscribed successfully!");
      } else {
        toast.error(response.data.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error(error.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="w-full bg-gray-50 text-gray-700 border-t border-gray-200" role="contentinfo">
      <div className="w-full bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 py-8 sm:py-12 md:py-14">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-[32px] bg-white/95 border border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.1)] sm:shadow-[0_35px_80px_rgba(15,23,42,0.12)] py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 text-center">
            <h3 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3 leading-tight">
              Stay Sweet & Updated
            </h3>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-7 max-w-2xl mx-auto leading-relaxed px-1">
              Get exclusive offers, festive deals, and sweet surprises straight to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-2xl mx-auto px-1 sm:px-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-slate-100 rounded-2xl sm:rounded-[28px] p-1 shadow-sm">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="font-inter flex-1 min-w-0 rounded-xl sm:rounded-[24px] border border-slate-200 bg-white px-3.5 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="inline-flex items-center justify-center rounded-xl sm:rounded-[24px] bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-95 sm:active:scale-100"
                >
                  {newsletterLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
            <p className="text-slate-500 text-xs sm:text-sm mt-4 px-2">No spam, just sweet updates. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          <div>
            <h4 className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-4 uppercase flex items-center gap-2">
              <FaLink className="text-blue-500 flex-shrink-0" /> Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/process" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Our Process</Link></li>
              <li><Link to="/csr" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">CSR Activities</Link></li>
              <li><Link to="/recipes" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Recipes</Link></li>
              <li><Link to="/offices" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Offices</Link></li>
              <li><Link to="/stores" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Retail Stores & Restaurants</Link></li>
              <li><Link to="/locator" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-4 uppercase flex items-center gap-2">
              <FaBoxOpen className="text-blue-500 flex-shrink-0" /> Our Services
            </h4>
            <ul className="space-y-2">
              <li><Link to="/bulk-orders" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Bulk Orders</Link></li>
              <li><Link to="/careers" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-4 uppercase flex items-center gap-2">
              <FaPlayCircle className="text-blue-500 flex-shrink-0" /> Videos
            </h4>
            <ul className="space-y-2">
              <li><Link to="/brand-videos" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Brand Videos</Link></li>
              <li><Link to="/recipe-videos" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Recipe Videos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-4 uppercase flex items-center gap-2">
              <FaShieldAlt className="text-blue-500 flex-shrink-0" /> Our Policies
            </h4>
            <ul className="space-y-2">
              <li><Link to="/refund-policy" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Cancellation & Refund</Link></li>
              <li><Link to="/shipping" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Shipping</Link></li>
              <li><Link to="/payments" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Payments</Link></li>
              <li><Link to="/terms" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/quality" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Quality Assurance</Link></li>
              <li><Link to="/certifications" className="text-gray-700 text-sm hover:text-blue-500 transition-colors">Certification & Accolades</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-xs sm:text-sm font-bold mb-3 sm:mb-4 uppercase">Reach Us</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2">
                <FaEnvelope className="mt-0.5 sm:mt-1 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">Email:</p>
                  <a href="mailto:support@sweethome.com" className="text-gray-700 text-sm hover:text-blue-500 break-all">support@sweethome.com</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FaPhoneAlt className="mt-0.5 sm:mt-1 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-700">Call:</p>
                  <a href="tel:+919931018857" className="text-gray-700 text-sm hover:text-blue-500">+91 9931018857</a>
                  <p className="text-[10px] sm:text-xs mt-1 text-gray-500 leading-relaxed">Customer Care Timings:<br />10:00 AM To 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <h4 className="text-gray-900 text-sm sm:text-base font-bold mb-4 text-center">Payment Secured By</h4>
          <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
            <FaCcVisa className="text-3xl sm:text-4xl text-gray-600 hover:text-blue-500 transition-colors" />
            <FaCcMastercard className="text-3xl sm:text-4xl text-gray-600 hover:text-blue-500 transition-colors" />
            <FaCcPaypal className="text-3xl sm:text-4xl text-gray-600 hover:text-blue-500 transition-colors" />
            <FaGooglePay className="text-3xl sm:text-4xl text-gray-600 hover:text-blue-500 transition-colors" />
            <FaCreditCard className="text-3xl sm:text-4xl text-gray-600 hover:text-blue-500 transition-colors" />
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h4 className="text-gray-900 text-sm sm:text-base font-bold mb-4 text-center">Follow Us</h4>
          <div className="flex justify-center gap-3 sm:gap-4">
            <a href="https://www.facebook.com/share/16jjrxdGV3/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors active:scale-95"><FaFacebookF className="text-lg" /></a>
            <a href="https://www.instagram.com/sweethome_ladania_store?igsh=MTlqbTEzeTI3a3Nrbw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors active:scale-95"><FaInstagram className="text-lg" /></a>
            <a href="https://www.youtube.com/@SweetHomeStore-z4b" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors active:scale-95"><FaYoutube className="text-lg" /></a>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-4 sm:py-6 border-t border-gray-200">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center">Copyright © 2025 Sweet Home India Pvt Ltd</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
              <Link to="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline">•</span>
              <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
              <span className="hidden sm:inline">•</span>
              <Link to="/cookie-policy" className="hover:text-blue-500 transition-colors">Cookie Policy</Link>
              <span className="hidden sm:inline">•</span>
              <Link to="/cookie-settings" className="hover:text-blue-500 transition-colors">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



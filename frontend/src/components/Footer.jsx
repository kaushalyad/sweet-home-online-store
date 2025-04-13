import React from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white pt-16 border-t border-gray-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
          {/* About Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={assets.logo} className="w-20 mb-3" alt="Sweet Home Logo" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              At <span className="font-semibold text-pink-500">Sweet Home</span>, we specialize in delightful sweets made exclusively from 
              <span className="font-semibold text-pink-500"> pure cow milk</span>. Our artisanal treats combine traditional recipes with the rich, 
              creamy flavor of high-quality milk, ensuring every bite is a taste of indulgence.
            </p>
            
            <Link to="/about" className="inline-block text-black font-semibold hover:text-pink-500 transition-colors duration-200">
              Learn more about us →
            </Link>
            
            {/* Social Media Links */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                <FaPinterestP className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-500 hover:text-white transition-colors duration-300">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-800">Helpful Links</h4>
            <ul className="space-y-2.5">
              <li>
                <NavLink to="/about" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/collection" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Collections
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Payments
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Shipping
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Returns & Cancellations
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-800">Customer Service</h4>
            <ul className="space-y-2.5">
              <li>
                <NavLink to="/contact" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  My Account
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Track Order
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-5 text-gray-800">Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-pink-500 mt-1 mr-3" />
                <span className="text-gray-600">Nearby PNB BANK, Main Road JaiNagar, Ladania - 110001</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-pink-500 mr-3" />
                <a href="tel:+919931018857" className="text-gray-600 hover:text-pink-500 transition-colors duration-200">+91-9931018857</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-pink-500 mr-3" />
                <a href="mailto:sweethomeonlinestorehelp@gmail.com" className="text-gray-600 hover:text-pink-500 transition-colors duration-200">
                  sweethomeonlinestorehelp@gmail.com
                </a>
              </li>
            </ul>
            
            <Link to="/contact" className="inline-block mt-4 bg-pink-50 hover:bg-pink-100 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 border border-pink-100">
              Send us a message →
            </Link>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">Secure Payment Methods</p>
              <div className="flex gap-2 mt-2">
                <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-6" />
                </div>
                <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="MasterCard" className="h-6" />
                </div>
                <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/128/196/196559.png" alt="American Express" className="h-6" />
                </div>
                <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/128/6124/6124998.png" alt="PayPal" className="h-6" />
                </div>
                <div className="bg-white p-1.5 rounded shadow-sm border border-gray-100">
                  <img src="https://cdn-icons-png.flaticon.com/128/8677/8677548.png" alt="RazorPay" className="h-6" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center rounded-full mr-3">
                <img src={assets.logo} alt="Sweet Home" className="h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sweet Home</p>
                <p className="text-xs text-gray-500">Premium Quality Sweets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Sweet Home Store. All Rights Reserved.
            </p>
            <span className="hidden md:inline-block mx-2">•</span>
            <p className="text-sm text-gray-600">
              Designed with <span className="text-pink-500">♥</span> for sweet lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheck } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setIsLoading(false);
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="pb-16">
      {/* Hero Section with Decorative Elements */}
      <div className="relative bg-gradient-to-r from-pink-50 to-gray-50 py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch With Us</h1>
            <p className="text-gray-600 text-lg mb-8">
              We'd love to hear from you! Whether you have a question about our products, 
              orders, or just want to say hello, we're here to help.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Contact Information and Form Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-50 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Our Location</h4>
                    <p className="text-gray-600 mt-1">
                      Nearby PNB BANK<br />
                      Main Road JaiNagar, Ladania
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-50 p-3 rounded-full mr-4">
                    <FaPhoneAlt className="text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Phone Number</h4>
                    <p className="text-gray-600 mt-1">
                      <a href="tel:+919931018857" className="hover:text-pink-500 transition-colors">
                        (+91) 9931018857
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-50 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email Address</h4>
                    <p className="text-gray-600 mt-1">
                      <a href="mailto:sweethomeonlinestorehelp@gmail.com" className="hover:text-pink-500 transition-colors">
                        sweethomeonlinestorehelp@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-50 p-3 rounded-full mr-4">
                    <FaClock className="text-pink-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Working Hours</h4>
                    <p className="text-gray-600 mt-1">
                      Monday - Saturday: 9:00 AM - 8:00 PM<br />
                      Sunday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h4 className="font-medium text-gray-800 mb-4">Careers at Sweet Home</h4>
                <p className="text-gray-600 mb-5">
                  Join our team! Discover current openings and opportunities to be part of our sweet family.
                </p>
                <a href="#careers" className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded hover:bg-black transition-colors duration-300">
                  View Open Positions
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h3>
              
              {formSubmitted ? (
                <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaCheck className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Message Sent Successfully!</h4>
                    <p className="text-gray-600 mt-1">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                        placeholder="+91 9876543210"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                      placeholder="Please describe your query or message in detail..."
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-6 text-white bg-black hover:bg-gray-900 rounded-md transition-colors duration-300 flex items-center justify-center ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.6822461448924!2d86.29442937493664!3d24.459152478339446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f1312a10e3f563%3A0x9b000ea25b1dddba!2sJainagar%2C%20Ladania%2C%20Bihar%20811308!5m2!1s0x39f1312a10e3f563%3A0x9b000ea25b1dddba!2sJainagar%2C%20Ladania%2C%20Bihar%20811308"
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our products, ordering process, and more.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">How can I track my order?</h3>
            <p className="text-gray-600">
              Once your order is shipped, you will receive a tracking number via email. You can use this number to track your order on our website or through the shipping carrier's site.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">What is your return policy?</h3>
            <p className="text-gray-600">
              We accept returns within 7 days of delivery. The item must be unused and in its original packaging. Please contact our customer service team to initiate a return.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Do you offer international shipping?</h3>
            <p className="text-gray-600">
              Currently, we only ship within India. We're working on expanding our shipping options to international locations in the future.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">How long do your sweets stay fresh?</h3>
            <p className="text-gray-600">
              Our sweets typically stay fresh for 7-10 days when stored in a cool, dry place. Detailed shelf life information is provided on each product page.
            </p>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section is already in the original file */}
      <div className="bg-gray-50 py-12 mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Contact;

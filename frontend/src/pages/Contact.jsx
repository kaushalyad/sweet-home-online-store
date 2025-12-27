import React, { useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheck, FaDirections, FaGift, FaBoxOpen, FaSnowflake, FaTruck, FaQuestionCircle, FaPlus, FaMinus } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "general",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // FAQ questions related to sweet orders
  const faqs = [
    {
      question: "How long do your sweets stay fresh?",
      answer: "Our sweets have different shelf lives depending on the type. Milk-based sweets typically stay fresh for 2-3 days when refrigerated, while dry sweets can last 5-7 days. Namkeens can stay fresh for up to 2 weeks when stored in an airtight container."
    },
    {
      question: "Do you offer same-day delivery for sweet orders?",
      answer: "Yes! We offer same-day delivery for orders placed before 12 PM within city limits. This ensures our sweets reach you at their freshest state."
    },
    {
      question: "Can I customize my sweet box for special occasions?",
      answer: "Absolutely! We offer customized sweet boxes for birthdays, weddings, corporate events, and festivals. You can select your preferred sweets and packaging options. Please contact us at least 48 hours in advance for custom orders."
    },
    {
      question: "How should I store the sweets after delivery?",
      answer: "Milk-based sweets should be refrigerated immediately. Dry sweets and namkeens should be stored in airtight containers in a cool, dry place away from direct sunlight."
    },
    {
      question: "Do you provide information about ingredients and allergens?",
      answer: "Yes, we provide complete ingredient information for all our products. If you have specific allergies or dietary requirements, please mention them in your order notes or contact us directly."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

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
        inquiryType: "general",
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
      <div className="relative bg-gradient-to-r from-pink-50 to-orange-50 py-16 overflow-hidden">
        <div className="container mx-auto sm:px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch With Us</h1>
            <p className="text-gray-600 text-lg mb-8">
              Have a question about our sweets or need assistance with your order? 
              We're here to ensure your sweet experience is perfect!
            </p>
            
            {/* Quick Contact Options */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a href="tel:+919931018857" className="flex items-center px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                <FaPhoneAlt className="text-pink-500 mr-2" /> Call Us
              </a>
              <a href="https://wa.me/918797196867" className="flex items-center px-6 py-3 bg-green-500 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg> 
                WhatsApp
              </a>
              <a href="mailto:sweethomeonlinestorehelp@gmail.com" className="flex items-center px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                <FaEnvelope className="text-pink-500 mr-2" /> Email Us
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Contact Information and Form Section */}
      <div className="container mx-auto sm:px-4 py-16">
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
                    <a 
                      href="https://maps.app.goo.gl/Go8m7rehmm26THhX9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-pink-500 hover:text-pink-700 mt-2 transition-colors"
                    >
                      <FaDirections className="mr-1" /> Get Directions
                    </a>
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
              
              {/* Sweet Orders Info Box */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h4 className="font-medium text-gray-800 mb-4">Bulk Sweet Orders</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-50 p-2 rounded-full mr-3">
                      <FaGift className="text-orange-500 text-sm" />
                    </div>
                    <p className="text-gray-600 text-sm">Special discounts for orders over 5kg</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-50 p-2 rounded-full mr-3">
                      <FaBoxOpen className="text-orange-500 text-sm" />
                    </div>
                    <p className="text-gray-600 text-sm">Custom gift packaging available</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-50 p-2 rounded-full mr-3">
                      <FaSnowflake className="text-orange-500 text-sm" />
                    </div>
                    <p className="text-gray-600 text-sm">Temperature-controlled delivery</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-50 p-2 rounded-full mr-3">
                      <FaTruck className="text-orange-500 text-sm" />
                    </div>
                    <p className="text-gray-600 text-sm">Free delivery for corporate orders</p>
                  </div>
                </div>
                <div className="mt-5">
                  <a href="tel:+919931018857" className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors duration-300">
                    Call for Bulk Orders
                  </a>
                </div>
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
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
                        Inquiry Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
                        required
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Status</option>
                        <option value="bulk">Bulk/Custom Order</option>
                        <option value="freshness">Product Freshness</option>
                        <option value="delivery">Delivery Question</option>
                        <option value="feedback">Feedback/Suggestions</option>
                      </select>
                    </div>
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
                      className={`w-full py-3 px-6 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-50 transition-colors ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Common questions about our sweets, delivery, and storage
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <button 
                    className="w-full flex justify-between items-center py-3 text-left"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex items-center">
                      <FaQuestionCircle className="text-pink-500 mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-800">{faq.question}</span>
                    </div>
                    {activeAccordion === index ? 
                      <FaMinus className="text-pink-500 flex-shrink-0" /> : 
                      <FaPlus className="text-pink-500 flex-shrink-0" />
                    }
                  </button>
                  
                  {activeAccordion === index && (
                    <div className="pl-8 pr-4 pt-2 pb-3 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Google Maps Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Visit Our Sweet Shop</h2>
            <p className="text-gray-600">
              Come experience our freshly made sweets in person
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54742.27171531576!2d86.101417!3d26.2142296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eea026d3d88d25%3A0x9b7de36969de138a!2sJainagar%2C%20Bihar!5e0!3m2!1sen!2sin!4v1708532269884!5m2!1sen!2sin" 
                width="100%" 
                height="450" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Sweet Home Store Location"
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="p-6 flex justify-center">
              <a 
                href="https://maps.app.goo.gl/Go8m7rehmm26THhX9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                <FaDirections className="mr-2" /> Get Directions to Our Sweet Shop
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

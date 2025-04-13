import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa'

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (email) {
            setIsSubmitted(true);
            // Reset form after 5 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail('');
            }, 5000);
        }
    }

  return (
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
        >
          Subscribe Now & Get 20% Off
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Join our newsletter for exclusive offers, new product announcements, and sweet recipes delivered straight to your inbox.
        </motion.p>
        
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Thank You for Subscribing!</h3>
              <p className="text-gray-600">Your 20% discount code will be sent to your email.</p>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={onSubmitHandler} 
            className="max-w-lg mx-auto relative"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                className="w-full px-5 py-4 rounded-full shadow-sm border border-gray-200 outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all" 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center sm:justify-start"
              >
                <span className="mr-2">SUBSCRIBE</span>
                <FaPaperPlane />
              </button>
            </div>
          </motion.form>
        )}
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-gray-500 mt-6"
        >
          By subscribing, you agree to receive marketing emails from Sweet Home. You can unsubscribe at any time.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default NewsletterBox

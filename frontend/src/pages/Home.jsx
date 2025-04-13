import React from 'react'
import Slider from '../components/Slider'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white">
      {/* Hero section above the slider */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-orange-50 py-12">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Discover the Perfect <span className="text-pink-500">Sweet Delight</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Experience the authentic taste of traditional Indian sweets, delivered fresh to your doorstep
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/products" 
                className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 inline-flex items-center"
              >
                Shop Now <FaArrowRight className="ml-2" />
              </a>
              <a 
                href="#latest" 
                className="px-8 py-3 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                See Latest
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Featured Slider */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        <Slider />
      </motion.div>
      
      {/* Latest Collection Section */}
      <motion.div 
        id="latest"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-8"
      >
        <LatestCollection/>
      </motion.div>
      
      {/* Featured Product Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 py-12 px-8 md:py-16 md:px-12">
          <div className="max-w-lg relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Special Festive Collection
            </h2>
            <p className="text-white text-lg mb-6 opacity-90">
              Celebrate festivals with our specially curated sweet boxes. Perfect for gifting and sharing joy with your loved ones.
            </p>
            <a 
              href="/products/category/festive" 
              className="inline-block px-8 py-3 bg-white text-pink-500 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Explore Collection
            </a>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full opacity-10 transform translate-x-1/4 translate-y-1/4"></div>
        </div>
      </motion.div>
      
      {/* Best Seller Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-8"
      >
        <BestSeller/>
      </motion.div>
      
      {/* Our Policy Section with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gray-50 py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Sweet Home?</h2>
          <OurPolicy/>
        </div>
      </motion.div>
      
      {/* Newsletter Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12"
      >
        <NewsletterBox/>
      </motion.div>
    </div>
  )
}

export default Home

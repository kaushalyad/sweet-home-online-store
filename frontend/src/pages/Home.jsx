import React, { useState, useEffect } from 'react'
import Slider from '../components/Slider'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import { motion } from 'framer-motion'
import { FaArrowRight, FaShippingFast, FaRegClock, FaGift, FaBirthdayCake, FaHeart, FaStar, FaShoppingCart, FaCrown } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useShop } from '@/context/ShopContext'

const Home = () => {
  const { products, loading } = useShop()

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Sweet categories for the showcase
  const sweetCategories = [
    {
      name: "Traditional Sweets",
      image: "https://img.freepik.com/free-photo/top-view-delicious-sweet-dessert_23-2149168635.jpg?w=1380&t=st=1702396588~exp=1702397188~hmac=0151efdd2bfd087655a3b24f70d03232b37d4faed9e38d9d3a5fd4c741bb3af9",
      description: "Authentic flavors passed down through generations",
      path: "/collection?category=traditional"
    },
    {
      name: "Milk Sweets",
      image: "https://img.freepik.com/free-photo/side-view-rasgulla-sweet-dish-made-from-cheese-sugar-syrup_657921-858.jpg?w=1380&t=st=1702396645~exp=1702397245~hmac=8eeb1cd8b20ea2db9cdfa55c78a59dffa6e53bea9a8ef119af36d0a7dbf48a39",
      description: "Creamy delights made from the finest milk",
      path: "/collection?category=milk"
    },
    {
      name: "Dry Fruit Sweets",
      image: "https://img.freepik.com/free-photo/top-view-delicious-sweets-wooden-table_23-2148516578.jpg?w=1380&t=st=1702396682~exp=1702397282~hmac=f3dbd89d73ae46f8b44aef0b29d1a3a3a5de4fcd1eb5f2e8d4cd4f7a9e3fcd08",
      description: "Nutrient-rich treats packed with premium nuts",
      path: "/collection?category=dryfruits"
    },
    {
      name: "Namkeens & Snacks",
      image: "https://img.freepik.com/free-photo/indian-tasty-food-arrangement_23-2149328277.jpg?w=1380&t=st=1702396723~exp=1702397323~hmac=e45cbac1a18b24fca17073db05c0c8a9a48c4c2abb2d50c8e5cfe48e90a49f63",
      description: "Savory snacks perfect for any time of day",
      path: "/collection?category=namkeen"
    }
  ];

  // Special occasion sweets
  const occasions = [
    {
      name: "Birthday Celebrations",
      icon: <FaBirthdayCake className="text-pink-500 text-3xl mb-3" />,
      description: "Make birthdays extra special with our curated sweet boxes",
      path: "/collection?occasion=birthday"
    },
    {
      name: "Wedding Favors",
      icon: <FaHeart className="text-pink-500 text-3xl mb-3" />,
      description: "Elegant gift options for your special day",
      path: "/collection?occasion=wedding"
    },
    {
      name: "Festival Specials",
      icon: <FaGift className="text-pink-500 text-3xl mb-3" />,
      description: "Celebrate festivals with traditional sweet selections",
      path: "/collection?occasion=festival"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero section above the slider */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-pink-100 to-orange-50 py-16 lg:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={fadeIn} 
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                Discover Authentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">Indian Sweets</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Handcrafted with traditional recipes and premium ingredients, delivered fresh to your doorstep. Experience the true taste of celebration.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/collection" 
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center"
                >
                  Shop All Sweets <FaArrowRight className="ml-2" />
                </Link>
                <Link 
                  to="/collection?category=bestseller" 
                  className="px-8 py-4 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Best Sellers
                </Link>
              </div>
              
              {/* Freshness indicators */}
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="flex items-center bg-white p-3 rounded-full shadow-sm">
                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                    <FaShippingFast className="text-pink-500" />
                  </div>
                  <span className="text-sm text-gray-700">Same-Day Delivery</span>
                </div>
                <div className="flex items-center bg-white p-3 rounded-full shadow-sm">
                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                    <FaRegClock className="text-pink-500" />
                  </div>
                  <span className="text-sm text-gray-700">Made Fresh Daily</span>
                </div>
              </div>
            </motion.div>
            
            {/* Hero image with animation */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <img 
                src="https://img.freepik.com/free-photo/indian-sweet-food-mithai-diwali-festival_75648-402.jpg" 
                alt="Assorted Indian Sweets" 
                className="w-full h-auto rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-xl"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-200 to-pink-100 rounded-full opacity-50 blur-xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-orange-200 to-yellow-100 rounded-full opacity-40 blur-xl transform -translate-x-1/3 translate-y-1/3"></div>
        
        {/* Floating sweet illustrations */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 right-10 w-16 h-16 hidden lg:block"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/5275/5275355.png" alt="Sweet" className="w-full h-full" />
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-1/3 left-20 w-12 h-12 hidden lg:block"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4244/4244237.png" alt="Ladoo" className="w-full h-full" />
        </motion.div>
      </div>
      
      {/* Featured Slider */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="max-w-[1400px] mx-auto">
          <Slider />
        </div>
      </motion.div>
      
      {/* Sweet Categories Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Explore Our Sweet Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover a world of flavors with our diverse collection of authentic Indian sweets and savory treats</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sweetCategories.map((category, index) => (
              <Link 
                key={index} 
                to={category.path}
                className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-3 left-3 text-white font-bold text-lg">{category.name}</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  <div className="mt-3 text-pink-500 group-hover:text-pink-600 transition-colors text-sm font-medium flex items-center">
                    Explore Collection <FaArrowRight className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Latest Collection Section */}
      <motion.div 
        id="latest"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        <LatestCollection/>
      </motion.div>
      
      {/* Featured Product Banner - Festival Special */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 py-16 px-8 md:py-20 md:px-12">
          <div className="max-w-lg relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Festival Special Collection
            </h2>
            <p className="text-white text-lg mb-6 opacity-90">
              Celebrate with our specially curated sweet boxes. Perfect for gifting and sharing joy with your loved ones.
            </p>
            <Link 
              to="/collection?category=festive" 
              className="inline-block px-8 py-3 bg-white text-pink-500 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Explore Festival Specials
            </Link>
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
        className="container mx-auto px-4 py-16"
      >
        <BestSeller/>
      </motion.div>
      
      {/* Special Occasions Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-pink-50 py-16"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Sweets for Special Occasions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Make your celebrations memorable with our special collection</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {occasions.map((occasion, index) => (
              <Link 
                key={index} 
                to={occasion.path}
                className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col items-center">
                  {occasion.icon}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{occasion.name}</h3>
                  <p className="text-gray-600 mb-4">{occasion.description}</p>
                  <span className="text-pink-500 hover:text-pink-600 transition-colors font-medium flex items-center">
                    View Collection <FaArrowRight className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Our Policy Section with enhanced styling */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Why Choose Sweet Home?</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Premium quality, authentic flavors, and exceptional service</p>
          <OurPolicy/>
        </div>
      </motion.div>
      
      {/* Fresh Daily Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-50 to-lime-50 py-10"
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-green-800 mb-2">Made Fresh Every Day</h3>
          <p className="text-green-700 max-w-2xl mx-auto">
            Our sweets are prepared fresh daily using traditional methods and premium ingredients
          </p>
        </div>
      </motion.div>
      
      {/* Newsletter Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <NewsletterBox/>
      </motion.div>

      {/* Premium Products Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white text-sm font-medium shadow-lg">
              Premium Collection
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Exquisite Sweet Delights</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Discover our handcrafted premium sweets, made with the finest ingredients</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100"
                >
                  <div className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={product.images[0]?.url}
                        alt={product.name}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {product.isNew && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm font-medium rounded-full">
                        New Arrival
                      </div>
                    )}
                    {product.isBestseller && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-sm font-medium rounded-full">
                        Best Seller
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <button className="w-full py-2 bg-white text-amber-600 rounded-full font-medium hover:bg-amber-50 transition-colors duration-300 flex items-center justify-center">
                          <FaShoppingCart className="mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-600">{product.category}</span>
                      <div className="flex items-center">
                        <FaStar className="text-amber-400" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating || 4.5}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-600">₹{product.price}</span>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
                      >
                        View Details
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/collection"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg font-medium"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Premium Features Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-gradient-to-r from-amber-50 to-rose-50"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCrown className="text-amber-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted with the finest ingredients and traditional recipes</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShippingFast className="text-amber-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Express Delivery</h3>
              <p className="text-gray-600">Same-day delivery for the freshest experience</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGift className="text-amber-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Luxury Packaging</h3>
              <p className="text-gray-600">Elegant packaging perfect for gifting and special occasions</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home

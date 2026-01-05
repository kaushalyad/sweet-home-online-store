import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaCrown, FaGift, FaStar, FaLeaf, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const slides = [
  {
    id: 1,
    title: "Royal Sweets",
    subtitle: "Premium Collection",
    description: "Experience the epitome of luxury with our handcrafted, gold-leaf adorned sweets",
    image: assets.slider1,
    buttonText: "Explore Collection",
    buttonLink: "/products",
    bgColor: "from-amber-600 to-orange-500",
    badge: "Premium",
    price: "₹999",
    rating: 4.9,
    features: ["Handcrafted", "Gold Leaf", "Premium Quality"]
  },
  {
    id: 2,
    title: "Festive Elegance",
    subtitle: "Diwali Special",
    description: "Celebrate the festival of lights with our exclusive, premium sweet boxes",
    image: assets.slider2,
    buttonText: "View Collection",
    buttonLink: "/collection/diwali",
    bgColor: "from-purple-600 to-pink-500",
    badge: "Limited Edition",
    price: "₹1,499",
    rating: 4.8,
    features: ["Festive Special", "Gift Box", "Premium Packaging"]
  },
  {
    id: 3,
    title: "Corporate Luxury",
    subtitle: "Executive Gifting",
    description: "Elevate your corporate gifting with our premium, custom-designed sweet boxes",
    image: assets.slider3,
    buttonText: "Explore Gifts",
    buttonLink: "/gifts",
    bgColor: "from-blue-600 to-indigo-500",
    badge: "Exclusive",
    price: "₹2,999",
    rating: 4.9,
    features: ["Custom Design", "Premium Box", "Corporate Ready"]
  }
];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && !isHovered) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="relative h-[800px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background with Gradient */}
          <div className={`relative h-full bg-gradient-to-r ${slides[currentSlide].bgColor}`}>
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="container mx-auto px-4 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center h-full">
                <div className="text-white space-y-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className="bg-white/20 px-6 py-3 rounded-full text-base font-medium flex items-center gap-2">
                      <FaCrown className="text-amber-400 text-xl" />
                      {slides[currentSlide].badge}
                    </span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-7xl font-bold leading-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                  
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-semibold text-amber-200"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl text-gray-100 leading-relaxed"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    {slides[currentSlide].features.map((feature, index) => (
                      <span key={index} className="bg-white/10 px-6 py-3 rounded-full text-base flex items-center gap-2">
                        <FaLeaf className="text-green-400 text-xl" />
                        {feature}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-8"
                  >
                    <div className="flex items-center gap-3">
                      <FaStar className="text-amber-400 text-2xl" />
                      <span className="text-3xl font-semibold">{slides[currentSlide].rating}</span>
                    </div>
                    <span className="text-3xl font-bold text-amber-400">{slides[currentSlide].price}</span>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex gap-6"
                  >
                    <Link
                      to={slides[currentSlide].buttonLink}
                      className="inline-flex items-center gap-3 bg-white/10 text-white border border-white/20 px-10 py-5 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 group"
                    >
                      {slides[currentSlide].buttonText}
                      <FaShoppingCart className="text-xl group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="inline-flex items-center gap-3 bg-amber-500 text-white px-10 py-5 rounded-full text-lg font-semibold hover:bg-amber-600 transition-all duration-300">
                      <FaMedal className="text-2xl" />
                      Premium Quality
                    </button>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="relative h-[600px] hidden md:block"
                >
                  <img
                    src={slides[currentSlide].image}
                    alt={`${slides[currentSlide].title} - Indian Sweet, Mithai, or Namkeen`}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                  <div className="absolute -bottom-8 -right-8 bg-white/10 p-6 rounded-2xl border border-white/20">
                    <FaGift className="text-5xl text-amber-400" />
                  </div>
                  <div className="absolute -top-8 -left-8 bg-white/10 p-6 rounded-2xl border border-white/20">
                    <FaMedal className="text-5xl text-amber-400" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full border border-white/20 transition-all duration-300"
      >
        <FaChevronLeft className="text-2xl" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 text-white p-5 rounded-full border border-white/20 transition-all duration-300"
      >
        <FaChevronRight className="text-2xl" />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-amber-400 scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Pause/Play Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 bg-white/10 text-white p-4 rounded-full border border-white/20 transition-all duration-300"
      >
        {isAutoPlaying ? '⏸' : '▶'}
      </motion.button>
    </div>
  );
};

export default Slider;

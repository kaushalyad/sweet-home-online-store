import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";

const ProductItem = ({ id, image, name, price, index = 0, featured = false, bestseller = false }) => {
  const { currency, addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useContext(ShopContext);
  const [inWishlist, setInWishlist] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  // Check if product is in wishlist when component mounts or wishlist changes
  useEffect(() => {
    setInWishlist(isInWishlist(id));
  }, [id, isInWishlist]);

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Prevent event bubbling
    
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
    setInWishlist(!inWishlist); // Optimistic update
  };

  // Handle quick add to cart
  const handleQuickAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Show added animation immediately
      setIsAdded(true);
      
      // Add to cart
      await addToCart(id, 1);
      
      // Keep the animation for 1.5 seconds
      setTimeout(() => setIsAdded(false), 1500);
    } catch (error) {
      // If there's an error, hide the animation
      setIsAdded(false);
    }
  };

  // Animation variants
  const itemVariant = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05
      }
    }
  };

  // Image carousel logic
  useEffect(() => {
    let interval;
    if (isHovered && image.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % image.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovered, image.length]);

  return (
    <motion.div 
      variants={itemVariant}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="product-card-container"
    >
      <Link
        onClick={() => scrollTo(0, 0)}
        className="block group relative"
        to={`/collection/${id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
      >
        {/* Product image with hover effect */}
        <div className="overflow-hidden rounded-2xl shadow-soft relative bg-white transform transition-all duration-500 group-hover:shadow-medium group-hover:-translate-y-1 aspect-square sm:aspect-[4/5]">
          <img
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            src={image[currentImage]}
            alt={`${name} - Indian Sweet`}
            loading="lazy"
            width="400"
            height="400"
          />
          
          {/* Image indicator dots */}
          {image.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-1 sm:gap-1.5">
              {image.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    currentImage === idx 
                      ? 'w-3 sm:w-4 bg-pink-500' 
                      : 'w-1 sm:w-1.5 bg-white bg-opacity-70'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Added to cart success animation */}
          {isAdded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-20">
              <div className="bg-white rounded-lg p-3 flex items-center shadow-lg">
                <span className="text-green-500 mr-2 text-xl">✓</span>
                <span className="font-medium">Added to cart!</span>
              </div>
            </div>
          )}
          
          {/* Quick actions overlay on hover - visible on mobile, hover on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-2.5 mb-2 sm:mb-3 md:mb-4 transform md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 delay-75">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleQuickAddToCart}
                className={`bg-white text-pink-500 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${
                  isAdded ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : ''
                }`}
                aria-label="Add to cart"
              >
                <FaShoppingCart className="text-sm sm:text-base md:text-lg" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleWishlistToggle}
                className={`p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-300 ${
                  inWishlist 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600' 
                    : 'bg-white text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500'
                }`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart className="text-sm sm:text-base md:text-lg" />
              </motion.button>
            </div>
          </div>
          
          {/* Badges container - handles multiple badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
            {/* Bestseller badge */}
            {(featured || bestseller) && (
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center shadow-md">
                <FaStar className="mr-1 text-[8px] sm:text-xs" /> Bestseller
              </div>
            )}
            
            {/* Add more badges as needed */}
            {price < 200 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
                Budget Pick
              </div>
            )}
          </div>
        </div>
        
        {/* Product info with improved design */}
        <div className="mt-3 sm:mt-4 px-1">
          <h3 className="font-inter font-medium text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] text-sm sm:text-base leading-snug cursor-pointer">
            {name}
          </h3>
          <div className="flex justify-between items-center mt-3">
            <div className="flex flex-col">
              <p className="font-poppins font-bold text-gray-900 flex items-center">
                <span className="text-sm sm:text-base text-orange-600 mr-1 font-semibold">{currency}</span>
                <span className="text-lg sm:text-xl md:text-2xl">{price}</span>
              </p>
              {featured && <p className="text-xs sm:text-sm text-gray-500 line-through mt-0.5">₹{Math.round(price * 1.2)}</p>}
            </div>
            <div className="text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold shadow-soft whitespace-nowrap">
              Free Ship
            </div>
          </div>
          
          {/* Rating stars */}
          <div className="flex items-center mt-2 sm:mt-2.5">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-xs sm:text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs sm:text-sm text-gray-500 ml-1.5">(24)</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;

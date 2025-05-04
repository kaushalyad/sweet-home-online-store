import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaShoppingCart, FaEye } from "react-icons/fa";

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
  const handleQuickAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, 1); // Pass 1 as the default quantity
    
    // Show added animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Animation variants
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
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
      whileHover={{ y: -5 }}
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
        <div className="overflow-hidden rounded-2xl shadow-md relative bg-gray-50 aspect-square border border-gray-100 transform transition-all duration-300 group-hover:shadow-lg group-hover:border-pink-100">
          <img
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            src={image[currentImage]}
            alt={name}
          />
          
          {/* Image indicator dots */}
          {image.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {image.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentImage === idx 
                      ? 'w-4 bg-pink-500' 
                      : 'w-1.5 bg-white bg-opacity-70'
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
          
          {/* Quick actions overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
            <div className="flex gap-2 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuickAddToCart}
                className={`bg-white text-pink-500 hover:text-white hover:bg-pink-500 p-2.5 rounded-full shadow-md transition-colors duration-300 ${
                  isAdded ? 'bg-pink-500 text-white hover:bg-pink-600' : ''
                }`}
                aria-label="Add to cart"
              >
                <FaShoppingCart className="text-lg" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-full shadow-md transition-colors duration-300 ${
                  inWishlist 
                    ? 'bg-pink-500 text-white hover:bg-pink-600' 
                    : 'bg-white text-gray-400 hover:text-white hover:bg-pink-500'
                }`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart className="text-lg" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/collection/${id}`);
                }}
                className="bg-white text-gray-700 hover:text-white hover:bg-gray-700 p-2.5 rounded-full shadow-md transition-colors duration-300"
                aria-label="View details"
              >
                <FaEye className="text-lg" />
              </motion.button>
            </div>
          </div>
          
          {/* Badges container - handles multiple badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Bestseller badge */}
            {(featured || bestseller) && (
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-md">
                <FaStar className="mr-1.5" /> Bestseller
              </div>
            )}
            
            {/* Add more badges as needed */}
            {price < 200 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full shadow-md">
                Budget Pick
              </div>
            )}
          </div>
        </div>
        
        {/* Product info with improved design */}
        <div className="mt-4 px-1">
          <h3 className="font-medium text-gray-800 group-hover:text-pink-500 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex justify-between items-center mt-2.5">
            <div className="flex flex-col">
              <p className="font-bold text-gray-900 flex items-center">
                <span className="text-sm text-pink-500 mr-1">{currency}</span>
                <span className="text-lg">{price}</span>
              </p>
              {/* Optional: Add original price for comparison if on sale */}
              {featured && <p className="text-xs text-gray-500 line-through">₹{Math.round(price * 1.2)}</p>}
            </div>
            <div className="text-xs bg-pink-50 text-pink-600 px-2.5 py-1 rounded-full font-medium border border-pink-100">
              Free shipping
            </div>
          </div>
          
          {/* Rating stars */}
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-xs ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">(24)</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;

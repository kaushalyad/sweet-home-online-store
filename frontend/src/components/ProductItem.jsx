import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaStar } from "react-icons/fa";

const ProductItem = ({ id, image, name, price, index = 0, featured = false }) => {
  const { currency, addToWishlist, removeFromWishlist, isInWishlist } = useContext(ShopContext);
  const [inWishlist, setInWishlist] = useState(false);

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

  return (
    <motion.div variants={itemVariant}>
      <Link
        onClick={() => scrollTo(0, 0)}
        className="block group relative"
        to={`/collection/${id}`}
      >
        {/* Product image with hover effect */}
        <div className="overflow-hidden rounded-lg shadow-sm relative bg-gray-50 aspect-square">
          <img
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            src={image[0]}
            alt={name}
          />
          
          {/* Quick actions overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
            {/* Empty div to maintain layout */}
          </div>
          
          {/* Wishlist button */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md hover:shadow-lg z-10"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart 
              className={`text-lg ${inWishlist ? 'text-red-500' : 'text-gray-400'}`} 
            />
          </button>
          
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-sm">
              <FaStar className="mr-1" /> Bestseller
            </div>
          )}
        </div>
        
        {/* Product info */}
        <div className="mt-4">
          <h3 className="font-medium text-gray-800 group-hover:text-pink-500 transition-colors duration-300 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-gray-900">
              <span className="text-xs text-gray-500 mr-1">{currency}</span>
              <span>{price}</span>
            </p>
            <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Free shipping</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;

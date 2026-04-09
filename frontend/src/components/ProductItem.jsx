import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import PropTypes from "prop-types";

const ProductItem = ({ id, image, name, price, discountPrice = null, rating = 0, totalReviews = 0, index = 0, featured = false, bestseller = false }) => {
  const { currency, addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useContext(ShopContext);
  const [inWishlist, setInWishlist] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const originalPrice = Number(price) || 0;
  const salePrice = discountPrice !== null && discountPrice !== undefined && discountPrice !== ""
    ? Number(discountPrice) || 0
    : originalPrice;
  const hasDiscount = salePrice > 0 && originalPrice > 0 && salePrice < originalPrice;
  const discountAmount = hasDiscount ? Math.max(0, originalPrice - salePrice) : 0;
  const discountPercent = hasDiscount ? Math.round((discountAmount / originalPrice) * 100) : 0;

  const freeShippingEligible = Number(salePrice) >= 500;

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
      whileHover={{ y: -6 }}
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
        {/* Iconic border wrapper */}
        <div className="relative rounded-[30px] p-[1px] bg-gradient-to-br from-pink-200 via-orange-100 to-gray-200 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
          <div className="overflow-hidden rounded-[29px] bg-white border border-white/60 relative aspect-square sm:aspect-[4/5]">
            {/* subtle corner highlight */}
            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-pink-200/40 to-orange-200/30 blur-2xl pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 0 1px rgba(236,72,153,0.10)" }} />

            {/* inner padding around image */}
            <div className="p-3.5 sm:p-4 h-full w-full">
              <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 h-full w-full">
                <img
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  src={image[currentImage]}
                  alt={`${name} - Indian Sweet`}
                  loading="lazy"
                  width="400"
                  height="400"
                />
              </div>
            </div>
          
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4 sm:p-6">
              <div className="flex gap-2.5 sm:gap-3 mb-2 sm:mb-3 md:mb-4 transform md:translate-y-3 md:group-hover:translate-y-0 transition-all duration-300 delay-75">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleQuickAddToCart}
                  className={`bg-white/95 backdrop-blur text-gray-900 hover:text-white hover:bg-gray-900 p-3 sm:p-3.5 rounded-full shadow-lg transition-all duration-300 ${
                    isAdded ? 'bg-gray-900 text-white' : ''
                  }`}
                  aria-label="Add to cart"
                >
                  <FaShoppingCart className="text-base sm:text-lg md:text-xl" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleWishlistToggle}
                  className={`bg-white/95 backdrop-blur p-3 sm:p-3.5 rounded-full shadow-lg transition-all duration-300 ${
                    inWishlist 
                      ? 'bg-white text-pink-600 hover:bg-white' 
                      : 'bg-white text-gray-500 hover:text-gray-900'
                  }`}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FaHeart className="text-base sm:text-lg md:text-xl" />
                </motion.button>
              </div>
            </div>
          
            {/* Badges container - handles multiple badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
              {(featured || bestseller) && (
                <div className="bg-white/95 backdrop-blur text-gray-900 text-[11px] sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full flex items-center shadow-md border border-gray-200/70">
                  <FaStar className="mr-1 text-[9px] sm:text-xs text-yellow-500" /> Bestseller
                </div>
              )}
            </div>

            {freeShippingEligible && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <div className="bg-white/95 backdrop-blur text-gray-900 text-[11px] sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/70 whitespace-nowrap">
                  Free shipping
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Product info with improved design */}
        <div className="mt-5.5 px-3">
          <h3 className="font-inter font-semibold text-gray-900 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2 min-h-[3.25rem] sm:min-h-[3.5rem] text-[16px] sm:text-[18px] leading-snug cursor-pointer tracking-tight">
            {name}
          </h3>

          <div className="flex items-center justify-between mt-3.5">
            <div className="flex flex-col">
              <p className="font-poppins font-extrabold text-gray-900 flex items-baseline gap-1.5">
              <span className="text-[13px] sm:text-sm text-gray-700 font-semibold">{currency}</span>
              <span className="text-[22px] sm:text-[26px] leading-none">{salePrice}</span>
              {hasDiscount && (
                <span className="text-[12px] sm:text-sm text-gray-500 line-through font-semibold ml-2">
                  {currency}{originalPrice}
                </span>
              )}
              </p>

              {hasDiscount && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[11px] sm:text-xs font-semibold">
                    {discountPercent > 0 ? `${discountPercent}% OFF` : "OFFER"}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-600">
                    Save {currency}{discountAmount}
                  </span>
                </div>
              )}
            </div>

            {Number(totalReviews) > 0 ? (
              <div className="flex items-center gap-1.5 text-sm sm:text-base text-gray-600">
                <FaStar className="text-yellow-400" />
                <span className="font-semibold text-gray-800">{Number(rating || 0).toFixed(1)}</span>
                <span className="text-gray-500">({Number(totalReviews) || 0})</span>
              </div>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                New
              </span>
            )}
          </div>

          
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductItem;

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  discountPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalReviews: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.number,
  featured: PropTypes.bool,
  bestseller: PropTypes.bool
};

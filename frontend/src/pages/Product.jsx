import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaShoppingCart, FaShippingFast, FaRegClock, FaCheck, FaArrowLeft, FaStar, FaShare, FaFacebook, FaTwitter, FaPinterest, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { trackPageView, trackProductView, trackAddToCart, trackBuyNow } from "../utils/analytics";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { 
    products, 
    currency, 
    addToCart, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist 
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        setInWishlist(isInWishlist(item._id));
        return null;
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [productId, products]);

  // Update wishlist state when isInWishlist changes
  useEffect(() => {
    if (productData) {
      setInWishlist(isInWishlist(productData._id));
    }
  }, [isInWishlist, productData]);

  // Track page view when component mounts
  useEffect(() => {
    trackPageView(window.location.pathname, productData?.name || "Product Page");
  }, [productData]);

  // Track product view
  useEffect(() => {
    if (productData) {
      trackProductView(productData);
    }
  }, [productData]);

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    addToCart(productData._id, quantity);
    toast.success("Added to cart!");
    trackAddToCart(productData, quantity);
  };

  const handleBuyNow = () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    addToCart(productData._id, quantity);
    trackBuyNow(productData, quantity);
    navigate("/cart");
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(productData._id);
    } else {
      addToWishlist(productData._id);
    }
    setInWishlist(!inWishlist); // Optimistic update for smoother UX
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return productData ? (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-50/30 via-orange-50/20 to-rose-50/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <nav className="flex items-center text-xs sm:text-sm bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl shadow-soft overflow-x-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors font-medium whitespace-nowrap"
            >
              <FaArrowLeft className="mr-1.5 sm:mr-2 text-xs sm:text-sm" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="mx-1.5 sm:mx-2 text-gray-300">/</span>
            <Link to="/" className="text-gray-600 hover:text-orange-500 transition-colors font-medium whitespace-nowrap">Home</Link>
            <span className="mx-1.5 sm:mx-2 text-gray-300">/</span>
            <Link to="/collection" className="text-gray-600 hover:text-orange-500 transition-colors font-medium whitespace-nowrap">Collection</Link>
            <span className="mx-1.5 sm:mx-2 text-gray-300">/</span>
            <Link 
              to={`/collection?category=${productData.category}`}
              className="text-gray-600 hover:text-orange-500 transition-colors font-medium capitalize whitespace-nowrap"
            >
              {productData.category}
            </Link>
            <span className="mx-1.5 sm:mx-2 text-gray-300 hidden md:inline">/</span>
            <span className="text-gray-800 font-semibold truncate hidden md:inline max-w-[200px]">{productData.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-medium border border-gray-100/50 overflow-hidden hover:shadow-strong transition-shadow duration-300">
          <div className="flex flex-col lg:flex-row">
          {/* Product Images Section */}
          <div className="w-full lg:w-1/2 p-2 sm:p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6">
              {/* Thumbnails - Horizontal on mobile, Vertical on larger screens */}
              <div className="flex sm:flex-col gap-2 sm:gap-4 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden pb-2 sm:pb-0 sm:pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full sm:w-20">
                {productData.image.map((img, index) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={index}
                    onClick={() => setImage(img)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden min-w-16 sm:min-w-20 h-16 sm:h-20 flex-shrink-0 shadow-sm ${
                      image === img 
                        ? 'ring-2 ring-pink-500 ring-offset-2 shadow-md' 
                        : 'border border-gray-200 hover:border-pink-300 hover:shadow'
                    }`}
                  >
                    <div className="w-full h-full">
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`${productData.name} view ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-200"
              >
                <div 
                  className="group relative aspect-square overflow-hidden cursor-zoom-in"
                  onClick={() => setShowImageModal(true)}
                >
                  <motion.img 
                    key={image}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { duration: 0.3 }
                    }}
                    src={image} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={productData.name}
                    loading="eager"
                  />
                  
                  {/* Beautiful overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Zoom hint overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/10 to-transparent h-16 sm:h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  {/* Zoom text hint */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                      <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden sm:inline">Click to zoom</span>
                    <span className="sm:hidden">Zoom</span>
                  </div>
                </div>
                
                {/* Product Badges */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2 z-10">
                  {productData.bestseller && (
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center shadow-md">
                      <FaStar className="mr-1 sm:mr-1.5 text-[8px] sm:text-xs" /> Bestseller
                    </div>
                  )}
                  {productData.newArrival && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
                      New Arrival
                    </div>
                  )}
                  {productData.discountPrice && (
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-md">
                      Sale
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-wrap gap-1 sm:gap-2 z-10">
                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist();
                    }}
                    className="bg-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart 
                      className={`text-lg sm:text-xl ${inWishlist ? 'text-red-500' : 'text-gray-400'}`} 
                    />
                  </motion.button>
                  
                  {/* Share Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareOptions(!showShareOptions);
                    }}
                    className="bg-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                    aria-label="Share product"
                  >
                    <FaShare className="text-gray-600 text-lg sm:text-xl" />
                  </motion.button>
                  
                  {/* Share Options Popup */}
                  <AnimatePresence>
                    {showShareOptions && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-12 sm:top-16 right-0 bg-white rounded-lg shadow-lg p-2 sm:p-3 flex gap-1 sm:gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="bg-blue-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-600 transition-colors">
                          <FaFacebook className="text-sm sm:text-base" />
                        </button>
                        <button className="bg-blue-400 text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-500 transition-colors">
                          <FaTwitter className="text-sm sm:text-base" />
                        </button>
                        <button className="bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors">
                          <FaPinterest className="text-sm sm:text-base" />
                        </button>
                        <button className="bg-green-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-600 transition-colors">
                          <FaWhatsapp className="text-sm sm:text-base" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/2 p-4 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-100">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Category Tag */}
              <div className="mb-4">
                <Link 
                  to={`/collection?category=${productData.category}`}
                  className="inline-block bg-pink-50 text-pink-600 text-xs font-medium px-3 py-1.5 rounded-full capitalize hover:bg-pink-100 transition-colors shadow-sm"
                >
                  {productData.category}
                </Link>
              </div>
              
              {/* Product Title */}
              <h1 className="font-poppins text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-pink-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-3 leading-tight">
                {productData.name}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center mb-5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`${i < 4 ? 'text-yellow-400' : 'text-gray-300'} mr-1`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">(122 reviews)</span>
              </div>
              
              {/* Price */}
              <div className="mb-6 bg-gradient-to-br from-pink-50 via-orange-50 to-rose-50 p-4 sm:p-5 rounded-xl border border-pink-100/50">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-poppins text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                    {currency}{productData.price}
                  </span>
                  {productData.discountPrice && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through font-inter">
                      {currency}{productData.discountPrice}
                    </span>
                  )}
                  {productData.discountPrice && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold shadow-sm">
                      Save {Math.round(((productData.discountPrice - productData.price) / productData.discountPrice) * 100)}%
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-green-600 mt-3 flex items-center font-medium">
                  <FaCheck className="mr-1.5" /> In Stock - Ready to Ship
                </p>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <p className="font-inter text-gray-700 leading-relaxed text-sm sm:text-base">
                  {productData.description}
                </p>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="font-poppins font-semibold text-gray-800 mb-3 text-sm sm:text-base">Quantity</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-l-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white hover:border-transparent focus:outline-none transition-all duration-200 font-bold text-lg"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 sm:w-20 h-11 sm:h-12 border-t-2 border-b-2 border-gray-300 text-center font-poppins font-bold text-base sm:text-lg focus:outline-none focus:border-orange-400"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-r-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white hover:border-transparent focus:outline-none transition-all duration-200 font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="btn-interactive flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-poppins font-semibold flex items-center justify-center gap-2.5 transition-all shadow-medium hover:shadow-strong text-sm sm:text-base"
                >
                  <FaShoppingCart className="text-lg" /> Add to Cart
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-poppins font-semibold transition-all shadow-medium hover:shadow-strong text-sm sm:text-base"
                >
                  Buy Now
                </motion.button>
              </div>
              
              {/* Product Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-poppins font-semibold text-gray-800 mb-4 text-base sm:text-lg">Product Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2.5 text-sm text-gray-700 font-inter">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700 font-inter">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <FaShippingFast className="text-white text-xs" />
                    </div>
                    <span>Free shipping over ₹500</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700 font-inter">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <FaRegClock className="text-white text-xs" />
                    </div>
                    <span>Easy returns within 7 days</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700 font-inter">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
              
              {/* Product Specifications */}
              {(productData.ingredients || productData.weight || productData.shelfLife || productData.storage) && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="font-poppins font-semibold text-gray-800 mb-4 text-base sm:text-lg">Product Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-4 sm:gap-x-6">
                    {productData.ingredients && (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ingredients</span>
                        <span className="text-sm font-inter text-gray-700">{productData.ingredients}</span>
                      </div>
                    )}
                    {productData.weight && (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Weight</span>
                        <span className="text-sm font-inter text-gray-700">{productData.weight}</span>
                      </div>
                    )}
                    {productData.shelfLife && (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Shelf Life</span>
                        <span className="text-sm font-inter text-gray-700">{productData.shelfLife}</span>
                      </div>
                    )}
                    {productData.storage && (
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Storage Instructions</span>
                        <span className="text-sm font-inter text-gray-700">{productData.storage}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 sm:mt-12">
        <div className="flex gap-1 sm:gap-2 border-b-2 border-gray-200 bg-white/80 backdrop-blur-sm rounded-t-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-poppins font-semibold transition-all whitespace-nowrap ${
              activeTab === "description"
                ? "text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-t-xl shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("nutrition")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-poppins font-semibold transition-all whitespace-nowrap ${
              activeTab === "nutrition"
                ? "text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-t-xl shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-poppins font-semibold transition-all whitespace-nowrap ${
              activeTab === "reviews"
                ? "text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-t-xl shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Reviews (122)
          </button>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 border-t-0 rounded-b-xl shadow-medium p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 prose max-w-none"
              >
                <p>
                  {productData.description}
                </p>
                <p className="mt-4">
                  An e-commerce website is an online platform that facilitates the
                  buying and selling of products or services over the internet. It
                  serves as a virtual marketplace where businesses and individuals can
                  showcase their products, interact with customers, and conduct
                  transactions without the need for a physical presence. E-commerce
                  websites have gained immense popularity due to their convenience,
                  accessibility, and the global reach they offer.
                </p>
                <p className="mt-4">
                  E-commerce websites typically display products or services along
                  with detailed descriptions, images, prices, and any available
                  variations (e.g., sizes, colors). Each product usually has its own
                  dedicated page with relevant information.
                </p>
              </motion.div>
            )}
            
            {activeTab === "nutrition" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600"
              >
                {productData.nutrition ? (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Nutritional Information</h3>
                    <p>{productData.nutrition}</p>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-lg">
                    Nutritional information not available for this product.
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === "reviews" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <h3 className="text-2xl font-bold text-gray-800">4.2</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < 4 ? 'text-yellow-400' : 'text-gray-300'} mr-1`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Based on 122 reviews</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="text-sm w-8">5★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">70%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm w-8">4★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">20%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm w-8">3★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">5%</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm w-8">2★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '3%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">3%</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm w-8">1★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">2%</span>
                    </div>
                  </div>
                </div>
                
                <button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-poppins font-semibold transition-all shadow-medium hover:shadow-strong">
                  Write a Review
                </button>
                
                {/* Sample Reviews */}
                <div className="mt-8 space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-800 mr-3">Delicious and Fresh</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`${i < 5 ? 'text-yellow-400' : 'text-gray-300'} text-xs`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">by Amit Kumar • March 22, 2023</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Helpful?</span>
                        <button className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          Yes (12)
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      The sweets were absolutely delicious! They arrived fresh and the packaging was excellent. 
                      The taste was authentic and reminded me of homemade treats. Will definitely order again!
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-800 mr-3">Perfect Gift Box</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`${i < 4 ? 'text-yellow-400' : 'text-gray-300'} text-xs`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">by Priya Singh • February 14, 2023</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Helpful?</span>
                        <button className="px-2 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          Yes (8)
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">
                      I purchased this as a gift for my parents and they loved it! The presentation was beautiful 
                      and the sweets were fresh. The variety in the box was excellent too. Great value for money.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-12 sm:mt-16">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="font-poppins text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">You May Also Like</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto rounded-full"></div>
        </div>
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Previous image button */}
              {productData.image.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = productData.image.indexOf(image);
                    const prevIndex = currentIndex === 0 ? productData.image.length - 1 : currentIndex - 1;
                    setImage(productData.image[prevIndex]);
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3.5 rounded-full transition-colors z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {/* Next image button */}
              {productData.image.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = productData.image.indexOf(image);
                    const nextIndex = (currentIndex + 1) % productData.image.length;
                    setImage(productData.image[nextIndex]);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3.5 rounded-full transition-colors z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              
              {/* Main image with animation */}
              <motion.img
                key={image}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
                src={image}
                alt={productData.name}
                className="max-w-full max-h-[85vh] object-contain p-6 rounded-lg bg-white/5 backdrop-blur-sm"
              />
              
              {/* Image counter */}
              <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                {productData.image.indexOf(image) + 1} / {productData.image.length}
              </div>
              
              {/* Image indicator dots */}
              {productData.image.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {productData.image.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage(img);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        image === img 
                          ? 'bg-white scale-110' 
                          : 'bg-white/30 hover:bg-white/70'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  ) : (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-md">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 font-medium">Loading product details...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the sweet details</p>
      </div>
    </div>
  );
};

export default Product;

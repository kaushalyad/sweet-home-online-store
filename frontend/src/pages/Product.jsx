import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const Product = () => {
  const { productId } = useParams();
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
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const fetchProductData = async () => {
    setIsLoading(true);
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        setInWishlist(isInWishlist(item._id));
        setIsLoading(false);
        return null;
      }
    });
    setTimeout(() => setIsLoading(false), 500); // Ensure loading ends even if product not found
  };

  useEffect(() => {
    fetchProductData();
    setSelectedSize(null); // Reset size when product changes
  }, [productId, products]);

  // Update wishlist state when isInWishlist changes
  useEffect(() => {
    if (productData) {
      setInWishlist(isInWishlist(productData._id));
    }
  }, [isInWishlist, productData]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // If no size is selected, show error (using the existing toast from context)
      addToCart(productData._id, null);
      return;
    }
    addToCart(productData._id, selectedSize);
  };

  const toggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(productData._id);
    } else {
      addToWishlist(productData._id);
    }
    setInWishlist(!inWishlist); // Optimistic update for smoother UX
  };

  // Loading skeleton for size selector
  const SizeSkeleton = () => (
    <div className="flex gap-2 flex-wrap mt-5">
      {[1, 2, 3, 4].map((_, index) => (
        <div 
          key={index} 
          className="h-10 w-12 bg-gray-200 animate-pulse rounded-sm"
        ></div>
      ))}
    </div>
  );

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*----------- Product Data-------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*---------- Product Images------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] relative">
            <img className="w-full h-auto" src={image} alt="" />
            
            {/* Wishlist button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleWishlist}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart 
                className={`text-xl ${inWishlist ? 'text-red-500' : 'text-gray-400'}`} 
              />
            </motion.button>
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          
          {/* Size selector with loading animation */}
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-2">Select Size:</p>
            {isLoading ? (
              <SizeSkeleton />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {productData.sizes && productData.sizes.map((size, index) => (
                  <motion.button
                    key={index}
                    className={`h-10 min-w-12 px-3 border ${
                      selectedSize === size 
                        ? "border-black bg-black text-white" 
                        : "border-gray-300 hover:border-gray-500"
                    } rounded-sm transition-all duration-200`}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      opacity: 1,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.3 
                      }
                    }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            )}
            {selectedSize && (
              <motion.p 
                className="text-green-600 mt-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Size {selectedSize} selected
              </motion.p>
            )}
          </div>
          
          <div className="flex gap-8 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white mobile:px-8 py-3 small_mobile:px-4 text-sm active:bg-gray-700 rounded-sm hover:bg-gray-800 transition-colors"
            >
              ADD TO CART
            </button>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white small_mobile:px-6 mobile:px-11 py-3 text-sm active:bg-gray-700 rounded-sm hover:bg-gray-800 transition-colors"
            >
              <Link to="/cart">BUY NOW</Link>
            </button>
          </div>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      {/* --------- display related products ---------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-gray-200 rounded-full border-t-black"></div>
    </div>
  );
};

export default Product;

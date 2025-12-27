import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductSkeleton from "./ProductSkeleton";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const LatestCollection = () => {
  const { products, buffer } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="my-10">
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-poppins text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Latest <span className="gradient-text">Arrivals</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto mb-6 rounded-full"></div>
          <p className="font-inter text-gray-600 text-lg max-w-2xl mx-auto mb-8 px-4">
            Discover our newest creations - freshly made sweets and savory snacks
          </p>
        </motion.div>
      </div>

      {/* Rendering Products */}
      {buffer ? (
        <ProductSkeleton count={10} />
      ) : (
        <div className="px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 gap-y-5 sm:gap-y-6"
          >
            {latestProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
                index={index}
              />
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Link 
              to="/collection" 
              className="btn-interactive group inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:shadow-strong transition-all duration-300 font-semibold text-lg hover:scale-105 relative z-10"
            >
              <span className="relative z-10">View All Products</span>
              <FaArrowRight className="ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LatestCollection;

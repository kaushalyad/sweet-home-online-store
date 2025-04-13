import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Buffer from "./Buffer";
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
      <div className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Title text1={"Latest"} text2={"Sweets And Namkeens"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 px-4">
            Discover our newest arrivals - freshly made sweets and savory snacks that will delight your taste buds
          </p>
        </motion.div>
      </div>

      {/* Rendering Products */}
      {buffer ? (
        <Buffer />
      ) : (
        <div className="px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10"
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
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-300 text-gray-800 font-medium"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LatestCollection;

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import Buffer from "./Buffer";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const { products, buffer } = useContext(ShopContext);
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    const news = products.filter((p) => p.newArrival === true);
    setNewProducts(news.slice(0, 8));
  }, [products]);

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="text-center py-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Title text1={"New"} text2={"Arrivals"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 px-4">Fresh additions to our collection — try them while they're new.</p>
        </motion.div>
      </div>

      {buffer ? (
        <Buffer />
      ) : (
        <div className="px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 gap-y-10">
            {newProducts.map((item, idx) => (
              <ProductItem key={item._id || idx} id={item._id} name={item.name} image={item.image} price={item.price} index={idx} newArrival={true} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }} className="flex justify-center mt-12">
            <Link to="/collection?new=true" className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-300 text-gray-800 font-medium">
              View All New Arrivals
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;

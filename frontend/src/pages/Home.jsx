import ImageCarousel from "../components/ImageCarousel";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import { motion } from "framer-motion";
import { FaArrowRight, FaGift, FaShippingFast, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };



  return (
    <main className="bg-white">
      {/* Full Width Image Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 sm:-mt-6 md:-mt-0"
      >
        <ImageCarousel />
      </motion.div>

      {/* Discover Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto sm:px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight"
            >
              Explore Our <span className="gradient-text">Collection</span>
            </motion.h2>
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-24 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mx-auto mb-6 rounded-full"
            ></motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Handcrafted with love, delivered fresh to your doorstep
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sweets", path: "/collection?category=sweets", image: assets.category_sweets },
              { name: "Namkeen", path: "/collection?category=namkeen", image: assets.category_namkeen },
              { name: "Beverages", path: "/collection?category=beverages", image: assets.category_beverages },
              { name: "Cookies", path: "/collection?category=cookies", image: assets.category_cookies },
              { name: "Ready To Eat", path: "/collection?category=ready-to-eat", image: assets.category_ready_to_eat },
              { name: "Festive Packs/Gift Boxes", path: "/collection?category=gift-boxes", image: assets.category_gift_boxes },
            ].map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group relative overflow-hidden rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 h-72 bg-white"
              >
                <div className="relative h-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={`${category.name} - Indian Sweets & Snacks`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    width="400"
                    height="400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6">
                  <h3 className="font-poppins text-white font-bold text-3xl mb-4 text-center transform group-hover:-translate-y-2 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <div className="overflow-hidden">
                    <span className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-semibold text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-medium hover:shadow-strong hover:scale-105">
                      Explore Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Latest Collection Section */}
      <motion.div
        id="latest"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container sm:mx-auto sm:px-4 py-16 sm:py-20"
      >
        <LatestCollection />
      </motion.div>

      {/* Featured Product Banner - Festival Special */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto sm:px-4 py-12 sm:py-16"
      >
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14 shadow-strong">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_40%)]"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold backdrop-blur-sm">
                <FaGift className="text-xs" />
                Limited Time Festive Offers
              </div>

              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                Festival Special
                <span className="block text-yellow-100">Sweet Boxes</span>
              </h2>

              <p className="text-white/90 text-base sm:text-lg lg:text-xl mb-7 max-w-xl leading-relaxed">
                Make celebrations memorable with handcrafted gift packs made fresh every day. Ideal for family, friends, and corporate gifting.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/collection?category=festive"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-colors duration-300"
                >
                  Explore Festival Specials
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/collection"
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-white/60 text-white rounded-full font-semibold hover:bg-white/15 transition-colors duration-300"
                >
                  Browse All Products
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/30 bg-white/15 backdrop-blur-md p-4 sm:p-5 shadow-medium">
                <div className="rounded-2xl overflow-hidden border border-white/30 bg-white/20">
                  <img
                    src={assets.category_gift_boxes}
                    alt="Festive sweet gift boxes"
                    className="w-full h-52 sm:h-64 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                  <div className="rounded-xl bg-white/85 text-gray-900 px-3 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <FaStar className="text-amber-500" />
                    Premium Quality
                  </div>
                  <div className="rounded-xl bg-white/85 text-gray-900 px-3 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <FaGift className="text-pink-500" />
                    Gift Ready Packs
                  </div>
                  <div className="rounded-xl bg-white/85 text-gray-900 px-3 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <FaShippingFast className="text-emerald-500" />
                    Fast Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full opacity-10 transform translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute -bottom-8 left-16 w-28 h-28 bg-yellow-200 rounded-full opacity-20 blur-xl"></div>
        </div>
      </motion.div>

      {/* Our Policy Section with enhanced styling */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white py-20 sm:py-24"
      >
        <div className="container mx-auto sm:px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Why Choose Sweet Home?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Premium quality, authentic flavors, and exceptional service
          </p>
          <OurPolicy />
        </div>
      </motion.div>

      {/* About Us Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 bg-white"
      >
        <div className="container mx-auto sm:px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 text-center">
              About Us
            </h2>
            <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed">
              <p>
                Sweet Home began in 2015, started by Tribhuvan Yadav with a small samosa stall. Day by day, people in the area fell in love with the taste and freshness.
              </p>
              <p>
                With the same passion, we expanded into namkeen and sweets — made with purity, great ingredients, and consistent quality. Today, Sweet Home is one of the most loved sweets businesses in our area.
              </p>
              <p>
                Our next goal is simple: to reach all of India with the same delicious taste, affordable pricing, and trusted purity — so everyone can enjoy authentic sweets from Sweet Home.
              </p>
              <div className="text-center pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Explore <FaArrowRight className="ml-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Home;

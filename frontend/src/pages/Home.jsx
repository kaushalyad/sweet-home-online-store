import ImageCarousel from "../components/ImageCarousel";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
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
              { name: "Sweets", path: "/collection?category=sweets", image: assets.traditional_sweets },
              { name: "Namkeen", path: "/collection?category=namkeen", image: assets.milk_sweets },
              { name: "Beverages", path: "/collection?category=beverages", image: assets.dry_fruits },
              { name: "Cookies", path: "/collection?category=cookies", image: assets.hero_img },
              { name: "Ready To Eat", path: "/collection?category=ready-to-eat", image: assets.traditional_sweets },
              { name: "Festive Packs/Gift Boxes", path: "/collection?category=gift-boxes", image: assets.milk_sweets },
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-pink-500 py-20 px-8 md:py-24 md:px-12">
          <div className="max-w-lg relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Festival Special Collection
            </h2>
            <p className="text-white text-xl mb-8 opacity-90">
              Celebrate with our specially curated sweet boxes. Perfect for
              gifting and sharing joy with your loved ones.
            </p>
            <Link
              to="/collection?category=festive"
              className="inline-block px-10 py-4 bg-white text-pink-500 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300 text-lg"
            >
              Explore Festival Specials
            </Link>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full opacity-10 transform translate-x-1/4 translate-y-1/4"></div>
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
                Over the course of eight decades, a lot has changed about us. We have relocated, undergone expansion, developed new product lines & added segments, opened retail chains & stores across India and embraced new markets overseas.
              </p>
              <p>
                One thing hasn't changed - we're still a tight-knit family business, committed to serving the most authentic taste of India through our products.
              </p>
              <p>
                Our origins can be traced back to a small namkeen shop in Bikaner founded by Ganga Bishan Agarwal (Haldiram Ji). This modest shop quickly gained popularity and scaled up to meet a booming demand for its unique-tasting bhujia. Building on this legacy, his grandson, our pioneer Mr. Shiv Kishan Agrawal steered the business towards the heights it has tasted today.
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

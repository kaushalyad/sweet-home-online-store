import Slider from "../components/Slider";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaShippingFast,
  FaRegClock,
  FaGift,
  FaBirthdayCake,
  FaHeart,
  FaCrown,
  FaAward,
  FaLeaf,
  FaHandshake,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Sweet categories for the showcase
  const sweetCategories = [
    {
      name: "Traditional Sweets",
      image: assets.traditional_sweets,
      description: "Authentic flavors passed down through generations",
      path: "/collection?category=traditional",
    },
    {
      name: "Milk Sweets",
      image: assets.milk_sweets,
      description: "Creamy delights made from the finest milk",
      path: "/collection?category=milk",
    },
    {
      name: "Dry Fruit Sweets",
      image: assets.dry_fruits,
      description: "Nutrient-rich treats packed with premium nuts",
      path: "/collection?category=dryfruits",
    },
    {
      name: "Namkeens & Snacks",
      image: assets.namkeens,
      description: "Savory snacks perfect for any time of day",
      path: "/collection?category=namkeen",
    },
  ];

  // Special occasion sweets
  const occasions = [
    {
      name: "Birthday Celebrations",
      icon: <FaBirthdayCake className="text-pink-500 text-3xl mb-3" />,
      description: "Make birthdays extra special with our curated sweet boxes",
      path: "/collection?occasion=birthday",
    },
    {
      name: "Wedding Favors",
      icon: <FaHeart className="text-pink-500 text-3xl mb-3" />,
      description: "Elegant gift options for your special day",
      path: "/collection?occasion=wedding",
    },
    {
      name: "Festival Specials",
      icon: <FaGift className="text-pink-500 text-3xl mb-3" />,
      description: "Celebrate festivals with traditional sweet selections",
      path: "/collection?occasion=festival",
    },
  ];

  // Premium achievements
  const achievements = [
    {
      icon: <FaAward className="text-amber-500 text-4xl" />,
      number: "50+",
      title: "Years of Excellence",
      description: "Serving generations with authentic flavors",
    },
    {
      icon: <FaLeaf className="text-green-500 text-4xl" />,
      number: "100%",
      title: "Natural Ingredients",
      description: "Pure and premium quality ingredients",
    },
    {
      icon: <FaHandshake className="text-blue-500 text-4xl" />,
      number: "10K+",
      title: "Happy Customers",
      description: "Trusted by families nationwide",
    },
  ];

  return (
    <div className="bg-white">
      {/* Premium Announcement Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 text-center"
      >
        <p className="text-sm font-medium">
          🎉 Special Offer: Free Premium Gift Box with orders above ₹2000
        </p>
      </motion.div>

      {/* Hero section above the slider */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 via-pink-100 to-orange-50 py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-xl"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 sm:mb-8">
                Discover Authentic{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                  Indian Sweets
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                Handcrafted with traditional recipes and premium ingredients,
                delivered fresh to your doorstep. Experience the true taste of
                celebration.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Link
                  to="/collection"
                  className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center text-base sm:text-lg font-medium"
                >
                  Shop All Sweets <FaArrowRight className="ml-3" />
                </Link>
                <Link
                  to="/collection?category=bestseller"
                  className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg font-medium"
                >
                  Best Sellers
                </Link>
              </div>

              {/* Freshness indicators */}
              <div className="mt-8 sm:mt-10 flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center bg-white p-3 sm:p-4 rounded-full shadow-sm">
                  <div className="bg-pink-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaShippingFast className="text-pink-500 text-lg sm:text-xl" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Same-Day Delivery
                  </span>
                </div>
                <div className="flex items-center bg-white p-3 sm:p-4 rounded-full shadow-sm">
                  <div className="bg-pink-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                    <FaRegClock className="text-pink-500 text-lg sm:text-xl" />
                  </div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">
                    Made Fresh Daily
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Hero image with animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <img
                src={assets.hero_img}
                alt="Assorted Indian Sweets"
                className="w-[400px] h-auto rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full opacity-20 blur-xl"></div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-200 to-pink-100 rounded-full opacity-50 blur-xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-br from-orange-200 to-yellow-100 rounded-full opacity-40 blur-xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Featured Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4 py-12 sm:py-16"
      >
        <div className="max-w-[1400px] mx-auto">
          <Slider />
        </div>
      </motion.div>

      {/* Sweet Categories Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Explore Our Sweet Categories
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover a world of flavors with our diverse collection of
              authentic Indian sweets and savory treats
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {sweetCategories.map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl sm:text-2xl">
                    {category.name}
                  </h3>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-base text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="text-pink-500 group-hover:text-pink-600 transition-colors text-base font-medium flex items-center">
                    Explore Collection <FaArrowRight className="ml-2" />
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
        className="container mx-auto px-4 py-16 sm:py-20"
      >
        <LatestCollection />
      </motion.div>

      {/* Featured Product Banner - Festival Special */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-12 sm:py-16"
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

      {/* Best Seller Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16 sm:py-20"
      >
        <BestSeller />
      </motion.div>

      {/* Special Occasions Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-pink-50 py-16 sm:py-20 lg:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Sweets for Special Occasions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Make your celebrations memorable with our special collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {occasions.map((occasion, index) => (
              <Link
                key={index}
                to={occasion.path}
                className="bg-white p-6 sm:p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  {occasion.icon}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                    {occasion.name}
                  </h3>
                  <p className="text-base text-gray-600 mb-6">{occasion.description}</p>
                  <span className="text-pink-500 hover:text-pink-600 transition-colors text-base font-medium flex items-center">
                    View Collection <FaArrowRight className="ml-2" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
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
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Why Choose Sweet Home?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Premium quality, authentic flavors, and exceptional service
          </p>
          <OurPolicy />
        </div>
      </motion.div>

      {/* Fresh Daily Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-green-50 to-lime-50 py-16 sm:py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-green-800 mb-4">
            Made Fresh Every Day
          </h3>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            Our sweets are prepared fresh daily using traditional methods and
            premium ingredients
          </p>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 sm:py-24"
      >
        <NewsletterBox />
      </motion.div>

      {/* Premium Features Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-r from-amber-50 to-rose-50"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <FaCrown className="text-amber-500 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Premium Quality
              </h3>
              <p className="text-base text-gray-600">
                Handcrafted with the finest ingredients and traditional recipes
              </p>
            </div>
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <FaShippingFast className="text-amber-500 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Express Delivery
              </h3>
              <p className="text-base text-gray-600">
                Same-day delivery for the freshest experience
              </p>
            </div>
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <FaGift className="text-amber-500 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Luxury Packaging
              </h3>
              <p className="text-base text-gray-600">
                Elegant packaging perfect for gifting and special occasions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Achievements Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-amber-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full text-white text-base font-medium shadow-lg">
              Our Legacy
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Excellence in Every Bite
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              A tradition of quality and craftsmanship that spans generations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-amber-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">{achievement.icon}</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  {achievement.number}
                </h3>
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
                  {achievement.title}
                </h4>
                <p className="text-base text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Premium Experience Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 lg:py-24 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] bg-amber-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8">
              Experience Premium Sweetness
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10">
              Every sweet is crafted with precision, using traditional methods
              and premium ingredients. Our commitment to quality ensures that
              each bite brings joy and satisfaction.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link
                to="/collection"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center text-base sm:text-lg font-medium"
              >
                Explore Collection <FaArrowRight className="ml-3" />
              </Link>
              <Link
                to="/about"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 text-base sm:text-lg font-medium"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;

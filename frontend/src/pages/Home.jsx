import ImageCarousel from "../components/ImageCarousel";
import LatestCollection from "../components/LatestCollection";
import OurPolicy from "../components/OurPolicy";
import FAQSchema from "../components/FAQSchema";
import FAQSection from "../components/FAQSection";
import GoogleRating from "../components/GoogleRating";
import LocalSEO from "../components/LocalSEO";
import AdvancedSEO from "../components/AdvancedSEO";
import { motion } from "framer-motion";
import { FaArrowRight, FaGift, FaShippingFast, FaStar, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { Helmet } from "react-helmet-async";

const Home = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };



  return (
    <main className="bg-white">
      <Helmet>
        <title>Best Sweets in India - Buy Authentic Indian Sweets & Mithai Online | Sweet Home Store</title>
        <meta name="description" content="Discover the best sweets in India at Sweet Home Online Store. Order fresh, authentic Indian mithai, namkeen & festive sweets online. Daily fresh delivery across India. Premium quality traditional sweets made with pure ingredients." />
        <meta name="keywords" content="best sweets in India, Indian sweets online, mithai delivery, fresh sweets India, authentic Indian sweets, traditional mithai, sweets delivery India, Indian sweets store, festival sweets India, sweet home online" />
        <meta property="og:title" content="Best Sweets in India - Authentic Indian Sweets & Mithai Online" />
        <meta property="og:description" content="Order the best sweets in India online from Sweet Home. Fresh, authentic Indian mithai with daily delivery across India. Premium quality traditional sweets and festive packs." />
        <meta property="og:image" content="https://sweethome-store.com/sweet_home_logo.jpg" />
        <meta property="og:url" content="https://sweethome-store.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sweet Home Online Store" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Sweets in India - Authentic Indian Sweets Online" />
        <meta name="twitter:description" content="Order the best sweets in India online. Fresh, authentic Indian mithai with daily delivery across India." />
        <meta name="twitter:image" content="https://sweethome-store.com/sweet_home_logo.jpg" />
        <link rel="canonical" href="https://sweethome-store.com/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="author" content="Sweet Home Online Store" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sweet Home Online Store",
            "url": "https://sweethome-store.com",
            "logo": "https://sweethome-store.com/sweet_home_logo.jpg",
            "description": "Authentic Indian sweets and mithai online store with fresh daily delivery across India",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.facebook.com/sweethomeonline",
              "https://www.instagram.com/sweethomeonline",
              "https://twitter.com/sweethomeonline"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })}
        </script>
      </Helmet>
      {/* Full Width Image Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full overflow-hidden"
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
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-500 mx-auto mb-6 rounded-full"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-soft hover:shadow-strong transition-all duration-500 h-56 sm:h-72 bg-white active:scale-95 sm:active:scale-100"
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
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-8 px-4 sm:px-6">
                  <h3 className="font-poppins text-white font-bold text-xl sm:text-3xl mb-2 sm:mb-4 text-center transform group-hover:-translate-y-2 transition-transform duration-300 leading-tight">
                    {category.name}
                  </h3>
                  <div className="overflow-hidden">
                    <span className="inline-block px-4 sm:px-8 py-2 sm:py-3 bg-white text-gray-900 rounded-full font-semibold text-xs sm:text-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-medium hover:shadow-strong hover:scale-105 whitespace-nowrap">
                      Explore Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sweets in India Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4"
            >
              Authentic <span className="gradient-text">Sweets in India</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              India is renowned worldwide for its diverse and delicious sweets. From traditional mithai to regional specialties,
              our collection celebrates the rich culinary heritage of sweets in India, made with authentic recipes and premium ingredients.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-strong transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaStar className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Traditional Mithai</h3>
              <p className="text-gray-600">
                Experience the finest traditional sweets in India like Kaju Katli, Barfi, Laddoos, and Gulab Jamun,
                prepared using time-honored recipes passed down through generations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-strong transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaShippingFast className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pan-India Delivery</h3>
              <p className="text-gray-600">
                We deliver the best sweets in India to every corner of the country. From North Indian delicacies
                to South Indian favorites, enjoy authentic regional sweets at your doorstep.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-strong transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaCheck className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Festival Specials</h3>
              <p className="text-gray-600">
                Celebrate festivals with the most popular sweets in India. Diwali, Holi, Raksha Bandhan -
                we have special festive collections featuring traditional Indian sweets for every occasion.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              to="/collection"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore All Sweets in India
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Google Rating Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <GoogleRating />
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
        <div className="relative overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-r from-blue-500 via-blue-500 to-fuchsia-600 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 shadow-strong">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_36%)] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm">
                <FaGift className="text-xs text-yellow-100" />
                Limited Time Festive Offers
              </div>

              <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Festival Special
                <span className="block text-yellow-100">Sweet Boxes</span>
              </h2>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-8 text-white/90">
                Make celebrations memorable with handcrafted gift packs made fresh every day. Ideal for family, friends, and corporate gifting.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/collection?category=festive"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-lg shadow-white/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Explore Festival Specials
                  <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/collection"
                  className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20"
                >
                  Browse All Products
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-[32px] border border-white/20 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <img
                  src={assets.festive}
                  alt="Festive sweet gift boxes"
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-200 opacity-90">Festive special</p>
                  <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white">Deluxe Festival Gift Box</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/95 px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm">
                  Premium Quality
                </div>
                <div className="rounded-2xl bg-white/95 px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm">
                  Gift Ready Packs
                </div>
                <div className="rounded-2xl bg-white/95 px-4 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm">
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 top-10 hidden xl:block">
            <div className="h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8 hidden xl:block">
            <div className="h-24 w-24 rounded-full bg-yellow-200/30 blur-2xl" />
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <FAQSection />

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
            <div className="space-y-4 sm:space-y-6 text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
              <p>
                Sweet Home began in 2015, started by Tribhuvan Yadav with a small samosa stall. Day by day, people in the area fell in love with the taste and freshness.
              </p>
              <p>
                With the same passion, we expanded into namkeen and sweets — made with purity, great ingredients, and consistent quality. Today, Sweet Home is one of the most loved sweets businesses in our area.
              </p>
              <p>
                Our next goal is simple: to reach all of India with the same delicious taste, affordable pricing, and trusted purity — so everyone can enjoy authentic sweets from Sweet Home.
              </p>
              <div className="text-center pt-4 sm:pt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold text-sm sm:text-base active:scale-95"
                >
                  Explore <FaArrowRight className="ml-2 sm:ml-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Schema for SEO */}
      <FAQSchema />
      {/* Local SEO for Google Business Profile */}
      <LocalSEO />
      {/* Advanced SEO features */}
      <AdvancedSEO />
    </main>
  );
};

export default Home;



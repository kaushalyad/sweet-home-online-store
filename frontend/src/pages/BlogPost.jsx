import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaClock, FaUser, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const BlogPost = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide",
    "image": [
      "https://sweethome-store.com/blog/diwali-sweets-2025.jpg",
      "https://sweethome-store.com/blog/kaju-katli.jpg",
      "https://sweethome-store.com/blog/barfi.jpg"
    ],
    "datePublished": "2025-12-27",
    "dateModified": "2025-12-27",
    "author": {
      "@type": "Organization",
      "name": "Sweet Home Online Store",
      "url": "https://sweethome-store.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sweet Home Online Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sweethome-store.com/sweet_home_logo.jpg"
      }
    },
    "description": "Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance.",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://sweethome-store.com/blog/top-indian-sweets-diwali-2025"
    },
    "keywords": ["Indian sweets", "Diwali mithai", "traditional sweets", "kaju katli", "barfi", "laddoos"],
    "articleSection": "Food & Recipes",
    "wordCount": "1250"
  };

  return (
    <>
      <Helmet>
        <title>Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide | Sweet Home</title>
        <meta name="description" content="Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance." />
        <meta name="keywords" content="Indian sweets, Diwali mithai, traditional sweets, kaju katli, barfi, laddoos, festival sweets" />
        <meta name="author" content="Sweet Home Online Store" />
        <meta property="og:title" content="Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide" />
        <meta property="og:description" content="Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance." />
        <meta property="og:image" content="https://sweethome-store.com/blog/diwali-sweets-2025.jpg" />
        <meta property="og:url" content="https://sweethome-store.com/blog/top-indian-sweets-diwali-2025" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide" />
        <meta name="twitter:description" content="Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance." />
        <meta name="twitter:image" content="https://sweethome-store.com/blog/diwali-sweets-2025.jpg" />
        <link rel="canonical" href="https://sweethome-store.com/blog/top-indian-sweets-diwali-2025" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50"
      >
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-orange-600">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-orange-600">Blog</Link>
              <span>/</span>
              <span className="text-gray-900">Top 10 Indian Sweets for Diwali 2025</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/blog"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Blog
              </Link>

              <button
                onClick={() => {/* Share functionality */}}
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaShare className="mr-2" />
                Share
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <FaUser className="mr-1" />
                Sweet Home Team
              </div>
              <div className="flex items-center">
                <FaClock className="mr-1" />
                December 27, 2025
              </div>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                Food & Recipes
              </span>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src="/blog/diwali-sweets-2025.jpg"
                alt="Collection of traditional Indian sweets for Diwali"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Diwali, the festival of lights, is incomplete without the sweet aroma of traditional Indian mithai.
              As we prepare for Diwali 2025, let's explore the top 10 Indian sweets that have been delighting
              families for generations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Kaju Katli - The Silver Diamond</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <img
                  src="/blog/kaju-katli.jpg"
                  alt="Kaju Katli - Traditional Indian sweet"
                  className="rounded-lg w-full"
                />
              </div>
              <div>
                <p className="text-gray-700 mb-4">
                  Kaju Katli, also known as Kaju Barfi, is the most popular Diwali sweet. Made from cashews,
                  sugar, and ghee, this diamond-shaped delicacy represents prosperity and good fortune.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Made with premium cashews</li>
                  <li>Traditional diamond shape</li>
                  <li>Silver foil decoration</li>
                  <li>Shelf life: 10-15 days</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Besan Laddoo - The Golden Spheres</h2>
            <p className="text-gray-700 mb-4">
              Besan Laddoo is a classic Indian sweet made from roasted gram flour, ghee, and sugar.
              These golden spheres are a staple in every Indian household during festivals.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Motichoor Laddoo - Tiny Pearl Drops</h2>
            <p className="text-gray-700 mb-4">
              Motichoor Laddoo gets its name from the tiny pearl-like droplets (motichoor) that make up this delicious sweet.
              Perfect for gifting during Diwali celebrations.
            </p>

            {/* Continue with more sweets... */}

            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 my-8">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Pro Tip for Diwali 2025</h3>
              <p className="text-orange-800">
                Order your Diwali sweets at least 2-3 days in advance to ensure freshness and availability.
                Sweet Home offers free delivery on orders above ₹500 across India.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Tips for Diwali Sweets</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2 text-gray-700">
                <li><strong>Room Temperature:</strong> Most Indian sweets stay fresh for 7-10 days</li>
                <li><strong>Refrigeration:</strong> Store in airtight containers for up to 2 weeks</li>
                <li><strong>Freezing:</strong> Laddoos and barfi can be frozen for up to 3 months</li>
                <li><strong>Humidity:</strong> Keep away from moisture to prevent sogginess</li>
              </ul>
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t pt-8 mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <FaFacebook />
                <span>Facebook</span>
              </button>
              <button className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
                <FaTwitter />
                <span>Twitter</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
                <FaLinkedin />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Related Articles */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/blog/how-to-store-indian-sweets" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">How to Store Indian Sweets Fresh</h4>
                <p className="text-gray-600 text-sm">Learn the best practices for keeping your mithai fresh and delicious.</p>
              </Link>
              <Link to="/blog/diwali-sweets-traditions" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Diwali Sweets Traditions Across India</h4>
                <p className="text-gray-600 text-sm">Explore regional variations of Diwali sweets from different states.</p>
              </Link>
            </div>
          </div>
        </article>
      </motion.div>
    </>
  );
};

export default BlogPost;
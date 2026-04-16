import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaCalendar, FaUser, FaArrowRight, FaTag } from "react-icons/fa";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["All", "Recipes", "Festivals", "Health", "Storage", "Culture"];

  const blogPosts = [
    {
      id: "top-indian-sweets-diwali-2025",
      title: "Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide",
      excerpt: "Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance.",
      image: "/blog/diwali-sweets-2025.jpg",
      category: "Festivals",
      author: "Sweet Home Team",
      date: "December 27, 2025",
      readTime: "8 min read",
      tags: ["Diwali", "Indian Sweets", "Mithai", "Festivals"]
    },
    {
      id: "how-to-store-indian-sweets",
      title: "How to Store Indian Sweets Fresh - Complete Guide 2025",
      excerpt: "Learn the best practices for storing Indian sweets to keep them fresh and delicious for longer. Expert tips on temperature, containers, and shelf life.",
      image: "/blog/store-sweets-guide.jpg",
      category: "Storage",
      author: "Sweet Home Team",
      date: "December 25, 2025",
      readTime: "6 min read",
      tags: ["Storage", "Freshness", "Shelf Life"]
    },
    {
      id: "kaju-katli-vs-barfi-comparison",
      title: "Kaju Katli vs Barfi: Which is Better? Complete Comparison",
      excerpt: "Compare two popular Indian sweets - Kaju Katli and Barfi. Learn about their ingredients, taste, preparation methods, and when to choose each.",
      image: "/blog/kaju-vs-barfi.jpg",
      category: "Recipes",
      author: "Sweet Home Team",
      date: "December 23, 2025",
      readTime: "5 min read",
      tags: ["Kaju Katli", "Barfi", "Comparison"]
    },
    {
      id: "health-benefits-dry-fruits",
      title: "Health Benefits of Dry Fruits in Indian Sweets",
      excerpt: "Discover the nutritional benefits of dry fruits commonly used in Indian mithai. From almonds to cashews, learn how these ingredients boost your health.",
      image: "/blog/dry-fruits-health.jpg",
      category: "Health",
      author: "Sweet Home Team",
      date: "December 20, 2025",
      readTime: "7 min read",
      tags: ["Health", "Dry Fruits", "Nutrition"]
    },
    {
      id: "diwali-sweets-traditions-india",
      title: "Diwali Sweets Traditions Across Different States of India",
      excerpt: "Explore how Diwali sweets vary across different Indian states. From Bengali sweets to South Indian delicacies, discover regional specialties.",
      image: "/blog/diwali-traditions.jpg",
      category: "Culture",
      author: "Sweet Home Team",
      date: "December 18, 2025",
      readTime: "9 min read",
      tags: ["Culture", "Regional", "Traditions"]
    },
    {
      id: "best-sweets-weddings-india",
      title: "Best Indian Sweets for Weddings - Traditional & Modern Options",
      excerpt: "Find the perfect sweets for your Indian wedding. Traditional mithai and modern fusion options that will delight your guests.",
      image: "/blog/wedding-sweets.jpg",
      category: "Festivals",
      author: "Sweet Home Team",
      date: "December 15, 2025",
      readTime: "6 min read",
      tags: ["Weddings", "Festivals", "Traditional"]
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Sweet Home Blog - Indian Sweets & Mithai Guide",
    "description": "Comprehensive guide to Indian sweets, mithai recipes, festival traditions, and sweet-making tips from Sweet Home Online Store.",
    "url": "https://sweethome-store.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Sweet Home Online Store",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sweethome-store.com/sweet_home_logo.jpg"
      }
    },
    "mainEntity": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://sweethome-store.com/blog/${post.id}`,
      "datePublished": post.date,
      "author": {
        "@type": "Organization",
        "name": post.author
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Indian Sweets Blog - Mithai Recipes, Tips & Traditions | Sweet Home</title>
        <meta name="description" content="Comprehensive guide to Indian sweets, mithai recipes, festival traditions, and sweet-making tips. Learn about Diwali sweets, storage methods, and health benefits." />
        <meta name="keywords" content="Indian sweets blog, mithai recipes, Diwali sweets, sweet storage, Indian traditions, kaju katli, barfi, laddoos" />
        <meta property="og:title" content="Indian Sweets Blog - Mithai Recipes, Tips & Traditions" />
        <meta property="og:description" content="Comprehensive guide to Indian sweets, mithai recipes, festival traditions, and sweet-making tips from Sweet Home." />
        <meta property="og:image" content="https://sweethome-store.com/blog/blog-hero.jpg" />
        <meta property="og:url" content="https://sweethome-store.com/blog" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://sweethome-store.com/blog" />
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Indian Sweets & Mithai Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the art of traditional Indian sweets, recipes, and festival traditions
            </p>
            <div className="max-w-md mx-auto relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/blog/${post.id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>

                  <Link to={`/blog/${post.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="mr-1" />
                      {post.author}
                      <span className="mx-2">•</span>
                      <FaCalendar className="mr-1" />
                      {post.date}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center text-xs text-gray-500">
                        <FaTag className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    Read More
                    <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="bg-orange-50 rounded-lg p-8 mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Sweet Recipes
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get weekly sweet recipes, festival specials,
              and expert tips delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Blog;
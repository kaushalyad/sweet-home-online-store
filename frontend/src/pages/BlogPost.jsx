import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaClock, FaUser, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blogPosts = [
    {
      id: "best-sweets-in-india",
      title: "Best Sweets in India - A Complete Guide to Authentic Mithai & Regional Delicacies",
      excerpt: "Discover the best sweets in India with our comprehensive guide. From North Indian mithai to South Indian delicacies, explore the most popular and authentic Indian sweets that define our culinary heritage.",
      image: "/blog/best-sweets-india.jpg",
      category: "Recipes",
      author: "Sweet Home Team",
      date: "December 28, 2025",
      readTime: "12 min read",
      tags: ["Best Sweets", "India", "Mithai", "Regional", "Traditional"],
      content: `
        <h2>Introduction to Indian Sweets</h2>
        <p>India is renowned worldwide for its diverse and delicious sweets, known as mithai. Each region has its own specialties, traditions, and flavors that reflect the rich cultural heritage of our country. From the creamy ras malai of West Bengal to the crunchy jalebi of Uttar Pradesh, Indian sweets offer a symphony of tastes and textures.</p>

        <h2>North Indian Sweets</h2>
        <p>The northern region of India is famous for its rich, creamy sweets made with generous amounts of ghee and dry fruits.</p>

        <h3>Kaju Katli</h3>
        <p>This diamond-shaped sweet made from cashews is a Diwali favorite. The name "katli" means "thin slices," referring to the delicate, melt-in-your-mouth texture.</p>

        <h3>Barfi</h3>
        <p>A dense, milk-based sweet available in various flavors like kesar (saffron), pista (pistachio), and chocolate. The word "barfi" comes from the Persian word for "snow."</p>

        <h3>Gulab Jamun</h3>
        <p>Soft, spongy dumplings soaked in rose-flavored sugar syrup. These melt-in-your-mouth delicacies are perfect for celebrations.</p>

        <h2>South Indian Sweets</h2>
        <p>South Indian sweets often feature coconut, jaggery, and rice as primary ingredients, reflecting the region's agricultural bounty.</p>

        <h3>Mysore Pak</h3>
        <p>A ghee-rich sweet from Karnataka made with chickpea flour, sugar, and generous amounts of clarified butter. It's crumbly yet rich.</p>

        <h3>Coconut Barfi</h3>
        <p>Made with fresh coconut, this sweet is a staple in South Indian households and temples.</p>

        <h2>East Indian Sweets</h2>
        <p>Bengali sweets are known for their delicate flavors and use of chhena (fresh cheese).</p>

        <h3>Ras Malai</h3>
        <p>Soft cheese dumplings soaked in sweetened, cardamom-flavored milk. This is considered one of India's most elegant desserts.</p>

        <h3>Sandesh</h3>
        <p>A cheese-based sweet that's simple yet incredibly flavorful. It's often flavored with saffron or rose.</p>

        <h2>West Indian Sweets</h2>
        <p>Maharashtrian and Gujarati sweets often feature sesame, peanuts, and jaggery.</p>

        <h3>Modak</h3>
        <p>Steamed dumplings filled with coconut and jaggery, traditionally offered to Lord Ganesha during Ganesh Chaturthi.</p>

        <h2>Why Choose Authentic Indian Sweets?</h2>
        <p>Authentic Indian sweets are made with traditional recipes passed down through generations. They use:</p>
        <ul>
          <li>Pure ghee instead of vegetable oils</li>
          <li>Natural colors and flavors</li>
          <li>Premium quality ingredients</li>
          <li>Traditional cooking methods</li>
        </ul>

        <h2>Health Benefits of Indian Sweets</h2>
        <p>While sweets should be enjoyed in moderation, traditional Indian mithai offers some nutritional benefits:</p>
        <ul>
          <li>Dry fruits provide essential vitamins and minerals</li>
          <li>Ghee contains healthy fats</li>
          <li>Many sweets use natural sweeteners like jaggery</li>
        </ul>

        <h2>Conclusion</h2>
        <p>The best sweets in India represent more than just delicious treats - they embody our cultural heritage, traditions, and love for good food. Whether you're celebrating a festival or simply craving something sweet, there's an Indian mithai for every occasion and taste preference.</p>

        <p>At Sweet Home, we pride ourselves on offering authentic, freshly made Indian sweets that capture the true essence of our culinary traditions. Order online and experience the best of Indian mithai delivered to your doorstep.</p>
      `
    },
    {
      id: "top-indian-sweets-diwali-2025",
      title: "Top 10 Indian Sweets for Diwali 2025 - Traditional Mithai Guide",
      excerpt: "Discover the top 10 traditional Indian sweets perfect for Diwali 2025. From kaju katli to laddoos, learn about authentic mithai recipes and their cultural significance.",
      image: "/blog/diwali-sweets-2025.jpg",
      category: "Festivals",
      author: "Sweet Home Team",
      date: "December 27, 2025",
      readTime: "8 min read",
      tags: ["Diwali", "Indian Sweets", "Mithai", "Festivals"],
      content: `
        <h2>Diwali Sweets Tradition in India</h2>
        <p>Diwali, the festival of lights, is incomplete without traditional Indian sweets. These mithai not only symbolize prosperity and happiness but also bring families together in celebration.</p>

        <h2>1. Kaju Katli - The Diwali Favorite</h2>
        <p>Kaju Katli remains the most popular Diwali sweet. Made from cashews, this diamond-shaped delicacy represents good fortune and prosperity.</p>

        <h2>2. Laddoos - Traditional Round Sweets</h2>
        <p>From motichoor laddoos to besan laddoos, these round sweets are a staple in every Diwali celebration across India.</p>

        <h2>3. Barfi - Rich Milk Sweets</h2>
        <p>Kesar barfi, pista barfi, and chocolate barfi - these dense, milk-based sweets are perfect for gifting during Diwali.</p>

        <h2>4. Gulab Jamun - Soft Dumplings</h2>
        <p>These soft, syrupy dumplings are a crowd favorite and add elegance to any Diwali feast.</p>

        <h2>5. Ras Malai - Delicate Cheese Sweets</h2>
        <p>For those who prefer lighter sweets, ras malai offers a delicate, spongy texture soaked in cardamom-flavored syrup.</p>

        <h2>6. Jalebi - Crispy Spirals</h2>
        <p>The crispy, syrupy spirals of jalebi bring back childhood memories and add color to Diwali celebrations.</p>

        <h2>7. Halwa - Rich Puddings</h2>
        <p>From carrot halwa to moong dal halwa, these rich puddings are comfort food during the festival season.</p>

        <h2>8. Peda - Milk Sweets</h2>
        <p>Simple yet delicious milk-based sweets that are easy to make and share with family and friends.</p>

        <h2>9. Chivda and Namkeen</h2>
        <p>While not traditional sweets, savory snacks like chivda add variety to the Diwali feast.</p>

        <h2>10. Modern Fusion Sweets</h2>
        <p>Contemporary takes on traditional sweets like chocolate barfi or rose gulab jamun appeal to younger generations.</p>

        <h2>Diwali Sweets Across Indian States</h2>
        <p>Different states have their own Diwali sweet traditions:</p>
        <ul>
          <li><strong>North India:</strong> Kaju Katli, Barfi, Laddoos</li>
          <li><strong>West India:</strong> Modak, Anarse</li>
          <li><strong>South India:</strong> Mysore Pak, Coconut Sweets</li>
          <li><strong>East India:</strong> Ras Malai, Sandesh</li>
        </ul>

        <h2>Healthier Diwali Sweet Options</h2>
        <p>For health-conscious celebrants, consider:</p>
        <ul>
          <li>Sweets made with jaggery instead of refined sugar</li>
          <li>Dry fruit-based mithai</li>
          <li>Low-fat versions of traditional sweets</li>
          <li>Portion-controlled sweet boxes</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Diwali sweets are more than just desserts - they represent the joy, prosperity, and togetherness that the festival brings. Choose authentic, freshly made mithai to make your Diwali celebrations truly special.</p>
      `
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
      tags: ["Storage", "Freshness", "Shelf Life"],
      content: `
        <h2>Understanding Indian Sweets Storage</h2>
        <p>Indian sweets have varying shelf lives depending on their ingredients and preparation methods. Proper storage is crucial to maintain freshness and prevent spoilage.</p>

        <h2>Milk-Based Sweets Storage</h2>
        <p>Sweets made with milk, cream, or khoya require refrigeration:</p>
        <ul>
          <li>Ras Malai: 2-3 days in refrigerator</li>
          <li>Rasgulla: 3-4 days in refrigerator</li>
          <li>Gulab Jamun: 4-5 days in refrigerator</li>
          <li>Store in airtight containers</li>
          <li>Keep away from strong-smelling foods</li>
        </ul>

        <h2>Dry Sweets Storage</h2>
        <p>Sweets made primarily with sugar, nuts, and ghee can be stored at room temperature:</p>
        <ul>
          <li>Kaju Katli: Up to 15 days</li>
          <li>Barfi: 7-10 days</li>
          <li>Laddoos: 10-15 days</li>
          <li>Store in cool, dry place</li>
          <li>Use airtight containers</li>
        </ul>

        <h2>General Storage Tips</h2>
        <h3>Temperature Control</h3>
        <p>Maintain consistent temperatures to prevent moisture buildup and bacterial growth.</p>

        <h3>Container Selection</h3>
        <p>Choose appropriate containers based on the type of sweet:</p>
        <ul>
          <li>Glass or ceramic for dry sweets</li>
          <li>Plastic containers for refrigerated sweets</li>
          <li>Avoid metal containers for acidic sweets</li>
        </ul>

        <h3>Humidity Control</h3>
        <p>High humidity can make sweets soggy. Store in dry environments and use silica gel packets if needed.</p>

        <h2>Signs of Spoilage</h2>
        <p>Learn to identify when sweets have gone bad:</p>
        <ul>
          <li>Unusual odors</li>
          <li>Visible mold</li>
          <li>Discoloration</li>
          <li>Texture changes</li>
        </ul>

        <h2>Best Practices for Longevity</h2>
        <ul>
          <li>Buy from reputable sources</li>
          <li>Consume within recommended timeframes</li>
          <li>Store in appropriate conditions</li>
          <li>Share with others to avoid waste</li>
        </ul>
      `
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
      tags: ["Kaju Katli", "Barfi", "Comparison"],
      content: `
        <h2>Kaju Katli vs Barfi: The Ultimate Comparison</h2>
        <p>Two of India's most beloved sweets, Kaju Katli and Barfi, often spark debates among sweet lovers. Let's compare these delicacies to help you decide which one suits your taste buds better.</p>

        <h2>Ingredients Comparison</h2>
        <h3>Kaju Katli Ingredients:</h3>
        <ul>
          <li>Cashews (main ingredient)</li>
          <li>Sugar</li>
          <li>Ghee</li>
          <li>Cardamom</li>
          <li>Saffron (optional)</li>
        </ul>

        <h3>Barfi Ingredients:</h3>
        <ul>
          <li>Milk or milk powder</li>
          <li>Sugar</li>
          <li>Ghee</li>
          <li>Nuts (pistachios, almonds)</li>
          <li>Flavorings (saffron, rose, chocolate)</li>
        </ul>

        <h2>Texture and Taste</h2>
        <h3>Kaju Katli:</h3>
        <p>Delicate, melt-in-your-mouth texture. Rich, nutty flavor with subtle sweetness. The thin, diamond-shaped slices are elegant and sophisticated.</p>

        <h3>Barfi:</h3>
        <p>Dense, fudgy texture. Rich and creamy with intense sweetness. Available in various flavors and can be customized extensively.</p>

        <h2>Preparation Methods</h2>
        <h3>Kaju Katli:</h3>
        <p>Cashews are ground into a fine paste, cooked with sugar syrup, and shaped into thin diamonds. Requires precision and skill to achieve the perfect texture.</p>

        <h3>Barfi:</h3>
        <p>Milk is reduced to khoya, mixed with sugar and flavorings, then set in molds. More forgiving preparation method, easier to make at home.</p>

        <h2>Occasions and Usage</h2>
        <h3>Kaju Katli:</h3>
        <ul>
          <li>Diwali celebrations</li>
          <li>Weddings and formal events</li>
          <li>Gift boxes</li>
          <li>Premium occasions</li>
        </ul>

        <h3>Barfi:</h3>
        <ul>
          <li>Everyday treats</li>
          <li>Festivals</li>
          <li>Casual gifting</li>
          <li>Family gatherings</li>
        </ul>

        <h2>Nutritional Comparison</h2>
        <h3>Kaju Katli:</h3>
        <ul>
          <li>Higher in healthy fats from cashews</li>
          <li>Good source of magnesium and vitamin K</li>
          <li>Lower calorie density</li>
        </ul>

        <h3>Barfi:</h3>
        <ul>
          <li>Higher in calcium from milk</li>
          <li>Contains more carbohydrates</li>
          <li>Higher calorie density</li>
        </ul>

        <h2>Price Comparison</h2>
        <p>Kaju Katli is generally more expensive due to the high cost of cashews, while Barfi is more affordable and offers better value for money.</p>

        <h2>Which One Should You Choose?</h2>
        <h3>Choose Kaju Katli if you prefer:</h3>
        <ul>
          <li>Elegant, premium sweets</li>
          <li>Nutty flavors</li>
          <li>Delicate textures</li>
          <li>Special occasions</li>
        </ul>

        <h3>Choose Barfi if you prefer:</h3>
        <ul>
          <li>Rich, creamy sweets</li>
          <li>Variety of flavors</li>
          <li>Everyday indulgence</li>
          <li>Better value</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Both Kaju Katli and Barfi are exceptional Indian sweets with their own unique appeal. The choice ultimately depends on your personal preferences, the occasion, and your budget. Why not try both and decide for yourself?</p>
      `
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
      tags: ["Health", "Dry Fruits", "Nutrition"],
      content: `
        <h2>The Nutritional Power of Dry Fruits in Indian Sweets</h2>
        <p>Indian sweets are often enhanced with dry fruits that not only add flavor and texture but also provide significant nutritional benefits. Let's explore the health advantages of these nutritious additions.</p>

        <h2>Almonds - The Brain Food</h2>
        <p>Almonds are rich in vitamin E, healthy fats, and antioxidants. They support brain health, improve memory, and help maintain healthy cholesterol levels.</p>

        <h2>Cashews - Heart-Healthy Nuts</h2>
        <p>Cashews provide healthy monounsaturated fats that support heart health. They're also a good source of magnesium, which helps regulate blood pressure.</p>

        <h2>Pistachios - Antioxidant Rich</h2>
        <p>Pistachios contain antioxidants, fiber, and healthy fats. They help control blood sugar levels and support weight management.</p>

        <h2>Walnuts - Omega-3 Powerhouse</h2>
        <p>Walnuts are an excellent source of omega-3 fatty acids, which support heart and brain health. They also contain antioxidants that fight inflammation.</p>

        <h2>Raisins - Natural Sweetness</h2>
        <p>Raisins provide natural sweetness along with fiber, potassium, and antioxidants. They help maintain digestive health and provide sustained energy.</p>

        <h2>Health Benefits Summary</h2>
        <ul>
          <li>Improved heart health</li>
          <li>Better brain function</li>
          <li>Antioxidant protection</li>
          <li>Blood sugar regulation</li>
          <li>Digestive health support</li>
        </ul>

        <h2>Moderation is Key</h2>
        <p>While dry fruits offer many health benefits, they are calorie-dense. Enjoy them in moderation as part of a balanced diet.</p>
      `
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
      tags: ["Culture", "Regional", "Traditions"],
      content: `
        <h2>Regional Diwali Sweets Traditions</h2>
        <p>Diwali celebrations vary across India, and so do the sweets associated with the festival. Each region has its own specialties that reflect local ingredients and cultural preferences.</p>

        <h2>North India - Rich and Creamy</h2>
        <p>Northern states favor rich, ghee-laden sweets made with dry fruits and saffron.</p>
        <ul>
          <li>Kaju Katli from Rajasthan</li>
          <li>Pinni from Punjab</li>
          <li>Khoya sweets from Uttar Pradesh</li>
        </ul>

        <h2>West India - Nutritious and Flavorful</h2>
        <p>Maharashtra and Gujarat focus on sweets made with jaggery, sesame, and peanuts.</p>
        <ul>
          <li>Modak from Maharashtra</li>
          <li>Til Gul from Gujarat</li>
          <li>Anarse sweets</li>
        </ul>

        <h2>South India - Coconut and Jaggery Based</h2>
        <p>South Indian sweets often feature coconut, rice, and jaggery.</p>
        <ul>
          <li>Mysore Pak from Karnataka</li>
          <li>Coconut Barfi from Kerala</li>
          <li>Sunnundalu from Andhra Pradesh</li>
        </ul>

        <h2>East India - Delicate and Refined</h2>
        <p>Bengali sweets are known for their delicate flavors and use of chhena.</p>
        <ul>
          <li>Ras Malai from West Bengal</li>
          <li>Sandesh varieties</li>
          <li>Cham Cham sweets</li>
        </ul>

        <h2>Cultural Significance</h2>
        <p>Each regional sweet carries cultural significance and family traditions passed down through generations.</p>
      `
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
      tags: ["Weddings", "Festivals", "Traditional"],
      content: `
        <h2>Wedding Sweets in Indian Culture</h2>
        <p>Indian weddings are incomplete without an array of delicious sweets that symbolize prosperity, happiness, and the sweetness of married life.</p>

        <h2>Traditional Wedding Sweets</h2>
        <h3>Barfi</h3>
        <p>A wedding classic available in various flavors like kesar, pista, and chocolate.</p>

        <h3>Laddoos</h3>
        <p>Motichoor and besan laddoos are traditional favorites for wedding celebrations.</p>

        <h3>Gulab Jamun</h3>
        <p>Elegant dumplings that add sophistication to wedding sweet tables.</p>

        <h2>Regional Wedding Specialties</h2>
        <ul>
          <li>Punjabi weddings: Pinni and Khoya sweets</li>
          <li>Bengali weddings: Ras Malai and Sandesh</li>
          <li>South Indian weddings: Mysore Pak and Coconut sweets</li>
        </ul>

        <h2>Modern Fusion Options</h2>
        <p>Contemporary couples often choose modern takes on traditional sweets:</p>
        <ul>
          <li>Chocolate barfi</li>
          <li>Rose-flavored gulab jamun</li>
          <li>Fusion laddoos with international flavors</li>
        </ul>

        <h2>Planning Your Wedding Sweet Table</h2>
        <ul>
          <li>Consider guest preferences and dietary restrictions</li>
          <li>Balance traditional and modern options</li>
          <li>Include a variety of textures and flavors</li>
          <li>Don't forget vegan and sugar-free alternatives</li>
        </ul>

        <h2>Conclusion</h2>
        <p>The best wedding sweets blend tradition with modern tastes, creating memorable experiences for all guests.</p>
      `
    }
  ];

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === postId);
    setPost(foundPost);
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            â† Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [
      `https://sweethome-store.com${post.image}`,
      "https://sweethome-store.com/sweet_home_logo.jpg"
    ],
    "datePublished": post.date,
    "dateModified": post.date,
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
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sweethome-store.com/blog/${post.id}`
    },
    "keywords": post.tags,
    "articleSection": post.category,
    "wordCount": Math.floor(post.content.length / 5) // Rough estimate
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Sweet Home</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta name="author" content="Sweet Home Online Store" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`https://sweethome-store.com${post.image}`} />
        <meta property="og:url" content={`https://sweethome-store.com/blog/${post.id}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={`https://sweethome-store.com${post.image}`} />
        <link rel="canonical" href={`https://sweethome-store.com/blog/${post.id}`} />
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
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-blue-600">Blog</Link>
              <span>/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
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
              {post.title}
            </h1>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <FaUser className="mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-1" />
                {post.date}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-1" />
                {post.readTime}
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
            </div>

            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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

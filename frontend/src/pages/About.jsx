import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import { motion } from "framer-motion";
import { FaCheckCircle, FaUsers, FaStar, FaShippingFast } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  // Team members data
  const teamMembers = [
    {
      name: "Rahul Sharma",
      role: "Founder & CEO",
      image: assets.about_img, // Replace with actual team member image
      bio: "Passionate about traditional sweets with over 15 years of experience in the food industry."
    },
    {
      name: "Priya Patel",
      role: "Head Chef",
      image: assets.about_img, // Replace with actual team member image
      bio: "Award-winning chef specializing in authentic Indian sweets and innovative recipes."
    },
    {
      name: "Ajay Kumar",
      role: "Marketing Director",
      image: assets.about_img, // Replace with actual team member image
      bio: "Digital marketing expert with a sweet tooth and a passion for building customer relationships."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Anita Desai",
      location: "Mumbai",
      quote: "The sweets from Sweet Home remind me of my grandmother's kitchen. Absolutely authentic and delicious!",
      rating: 5
    },
    {
      name: "Raj Malhotra",
      location: "Delhi",
      quote: "Fast delivery and the sweets were still fresh. My family loved the assortment box!",
      rating: 5
    },
    {
      name: "Meera Singh",
      location: "Bangalore",
      quote: "Sweet Home's Kaju Katli is the best I've ever had. Will definitely order again!",
      rating: 4
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-orange-50 py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn} 
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Sweet Journey</h1>
            <p className="text-lg text-gray-600 mb-8">
              Delivering happiness through authentic flavors since 2015
            </p>
            <div className="flex justify-center">
              <a 
                href="#our-story" 
                className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 inline-block"
              >
                Our Story
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200 rounded-full opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Our Story Section */}
      <div id="our-story" className="container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <Title text1={"OUR"} text2={"STORY"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to becoming a beloved sweet destination, our journey has been as rich as our recipes.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative">
              <img
                className="w-full rounded-lg shadow-xl"
                src={assets.about_img}
                alt="Sweet Home Store"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:flex items-center space-x-2">
                <div className="bg-pink-500 text-white p-3 rounded-full">
                  <FaStar />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Since 2015</p>
                  <p className="text-sm text-gray-600">Serving quality sweets</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">A Legacy of Sweet Traditions</h2>
            <div className="flex flex-col gap-6 text-gray-600">
              <p className="leading-relaxed">
                Founded in 2015, Sweet Home has been dedicated to bringing the
                finest sweets to our customers at unbeatable prices. We pride
                ourselves on offering a wide variety of delicious, high-quality
                sweets that are both affordable and made with love.
              </p>
              <p className="leading-relaxed">
                Whether you're craving traditional favorites or something new, every treat at Sweet
                Home is crafted to perfection, ensuring the best taste in every
                bite. With a commitment to quality, taste, and value, Sweet Home is
                your go-to destination for satisfying your sweet tooth!
              </p>
              <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500 mt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h3>
                <p className="italic">
                  At Sweet Home, our mission is to bring the authentic taste of Indian
                  sweets to every doorstep, offering quality treats at affordable
                  prices. We are committed to delivering joy with each bite, ensuring
                  everyone can savor the richness of India's traditional sweets
                  without compromise on quality or cost.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <Title text1={"WHY"} text2={"CHOOSE US"} />
            <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We go above and beyond to ensure your sweet experience is nothing short of perfect.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-md text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-pink-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                We meticulously select and vet each product to ensure it meets our
                stringent quality standards. Only the finest ingredients make it into our sweets.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-md text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShippingFast className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Convenience</h3>
              <p className="text-gray-600">
                With our user-friendly interface and hassle-free ordering process,
                shopping has never been easier. Fast delivery to your doorstep.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-md text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Exceptional Service</h3>
              <p className="text-gray-600">
                Our team of dedicated professionals is here to assist you all the way,
                ensuring your satisfaction is our top priority every step of the journey.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white p-8 rounded-lg shadow-md text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStar className="text-orange-500 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Authentic Taste</h3>
              <p className="text-gray-600">
                We preserve traditional recipes while adding our special touch to create sweets that are both authentic and unique.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <Title text1={"CUSTOMER"} text2={"TESTIMONIALS"} />
          <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Hear what our happy customers have to say about their Sweet Home experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mr-1" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full mr-4 flex items-center justify-center text-pink-500 font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <Title text1={"MEET OUR"} text2={"TEAM"} />
            <div className="w-20 h-1 bg-pink-500 mx-auto mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The passionate people behind your favorite sweet treats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-md group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-pink-500 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h3 className="text-4xl font-bold text-pink-500 mb-2">8+</h3>
            <p className="text-gray-600">Years of Experience</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h3 className="text-4xl font-bold text-pink-500 mb-2">50+</h3>
            <p className="text-gray-600">Sweet Varieties</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h3 className="text-4xl font-bold text-pink-500 mb-2">10k+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-6"
          >
            <h3 className="text-4xl font-bold text-pink-500 mb-2">20+</h3>
            <p className="text-gray-600">Cities Served</p>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience Our Sweet Delights?</h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Browse our collection of authentic sweets and place your order today. Satisfaction guaranteed!
            </p>
            <Link 
              to="/collection" 
              className="inline-block px-8 py-4 bg-white text-pink-500 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Newsletter Section */}
      <div className="py-16">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default About;

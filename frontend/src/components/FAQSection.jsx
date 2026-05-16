import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuestionCircle, FaPlus, FaMinus } from "react-icons/fa";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Do you deliver sweets across India?",
      answer: "Yes, we deliver fresh sweets across all major cities in India including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, and many more. We use reliable courier partners to ensure your sweets reach you in perfect condition."
    },
    {
      question: "Are your sweets made fresh daily?",
      answer: "Absolutely! All our sweets are prepared fresh every morning using traditional recipes and the finest ingredients. We never use preservatives or artificial colors in our authentic Indian mithai."
    },
    {
      question: "What is the shelf life of your sweets?",
      answer: "Most of our sweets have a shelf life of 7-10 days when stored properly in an airtight container at room temperature. Dry fruits and certain sweets like kaju katli can last up to 15 days. We always recommend consuming them within 3-4 days for the best taste."
    },
    {
      question: "Do you offer bulk orders for weddings and festivals?",
      answer: "Yes, we specialize in bulk orders for weddings, festivals, corporate events, and celebrations. We offer special pricing for large orders and can customize sweets according to your requirements. Contact us for bulk order inquiries."
    },
    {
      question: "Are your sweets vegetarian?",
      answer: "Yes, all our sweets are completely vegetarian and made with pure ghee. We cater to vegetarian preferences and can also provide Jain-friendly options upon request."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including Credit/Debit cards, UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery. All transactions are secure and encrypted."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Find answers to common questions about our sweets, delivery, and services
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft hover:shadow-strong transition-shadow duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <FaQuestionCircle className="text-blue-500 text-xl flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {activeIndex === index ? (
                      <FaMinus className="text-blue-500 text-lg" />
                    ) : (
                      <FaPlus className="text-blue-500 text-lg" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;


import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaFileContract, FaShieldAlt, FaGavel } from 'react-icons/fa';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Sweet Home Online Store</title>
        <meta
          name="description"
          content="Read the Sweet Home Online Store Terms of Service. Learn the rules for using our site, placing orders, and shopping safely online."
        />
        <link rel="canonical" href="https://sweethome-store.com/terms" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto sm:px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaFileContract className="text-blue-500 text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Terms of Service</h1>
                <p className="text-gray-500 mt-1">Last updated: April 16, 2026</p>
              </div>
            </div>

            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service govern your use of the Sweet Home Online Store website and mobile experience.
                By accessing or using our site, you agree to follow these terms and comply with applicable laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Using the Site</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Customers must provide accurate information when registering or placing an order.</li>
                <li>Orders are subject to availability and confirmation from our team.</li>
                <li>Unauthorized use of the site is prohibited.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders, Pricing, and Payments</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Prices are displayed in Indian Rupees and may change due to offers or product availability. We accept payments through secure payment gateways.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to pay all charges at the prices then in effect for your orders, including any applicable taxes or delivery fees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns and Cancellations</h2>
              <p className="text-gray-700 leading-relaxed">
                Cancellation and refund policies are described on our dedicated policy page. Please contact customer support if you need assistance with returns, exchanges, or order cancellations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Sweet Home Online Store is not responsible for damages resulting from inappropriate storage of sweets, late delivery due to third-party carriers, or misuse of products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="flex flex-col gap-2 text-gray-700">
                <p>
                  <FaShieldAlt className="inline-block mr-2 text-blue-500" />
                  Email: <a href="mailto:sweethomeonlinestorehelp@gmail.com" className="text-blue-500">sweethomeonlinestorehelp@gmail.com</a>
                </p>
                <p>
                  <FaGavel className="inline-block mr-2 text-blue-500" />
                  Phone: <a href="tel:+919931018857" className="text-blue-500">+91 9931018857</a>
                </p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Terms;


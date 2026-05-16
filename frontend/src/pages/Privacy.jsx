import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaLock, FaUserShield, FaEnvelope } from 'react-icons/fa';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Sweet Home Online Store</title>
        <meta
          name="description"
          content="Read the Sweet Home Online Store privacy policy. Learn how we collect, use, and protect your personal information when you shop online."
        />
        <link rel="canonical" href="https://sweethome-store.com/privacy" />
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
                <FaLock className="text-blue-500 text-4xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Privacy Policy</h1>
                <p className="text-gray-500 mt-1">Last updated: April 16, 2026</p>
              </div>
            </div>

            <section className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                At Sweet Home Online Store, we are committed to protecting your privacy. This policy explains what
                information we collect, how we use it, and how we keep it safe when you visit our website and place
                orders.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Personal details like name, email, phone number, and delivery address.</li>
                <li>Order and payment information needed to process your purchases.</li>
                <li>Technical data such as device type, browser, IP address, and site activity.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To process and fulfill orders, including shipping and delivery.</li>
                <li>To communicate order status, offers, and customer service updates.</li>
                <li>To improve our website, products, and customer experience.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sharing and Security</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do not sell your personal information. We may share data with trusted service providers
                who help us deliver orders and manage payments. We use appropriate security measures to protect
                your information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We also use cookies and similar technologies as described in our Cookie Policy to provide a
                better shopping experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                You can contact us to review, correct, or delete your personal information. We will respond to
                your privacy requests in a timely manner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <div className="flex flex-col gap-2 text-gray-700">
                <p>
                  <FaUserShield className="inline-block mr-2 text-blue-500" />
                  Email: <a href="mailto:sweethomeonlinestorehelp@gmail.com" className="text-blue-500">sweethomeonlinestorehelp@gmail.com</a>
                </p>
                <p>
                  <FaEnvelope className="inline-block mr-2 text-blue-500" />
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

export default Privacy;


import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { FaExchangeAlt, FaUndoAlt, FaHeadset } from 'react-icons/fa'

const OurPolicy = () => {
  const policyItems = [
    {
      icon: <FaExchangeAlt className="text-pink-500 text-3xl" />,
      image: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy",
      gradient: "from-pink-50 to-white"
    },
    {
      icon: <FaUndoAlt className="text-orange-500 text-3xl" />,
      image: assets.quality_icon,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
      gradient: "from-orange-50 to-white"
    },
    {
      icon: <FaHeadset className="text-purple-500 text-3xl" />,
      image: assets.support_img,
      title: "Best Customer Support",
      description: "We provide 24/7 customer support",
      gradient: "from-purple-50 to-white"
    }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {policyItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className={`bg-gradient-to-br ${item.gradient} p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col items-center text-center border border-gray-100`}
        >
          <div className="w-20 h-20 rounded-2xl bg-white shadow-soft flex items-center justify-center mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-6">
            {item.icon}
          </div>
          <h3 className="font-poppins text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
          <p className="font-inter text-gray-600 leading-relaxed">{item.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default OurPolicy

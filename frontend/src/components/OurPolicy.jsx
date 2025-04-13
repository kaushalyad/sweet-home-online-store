import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { FaExchangeAlt, FaUndoAlt, FaHeadset } from 'react-icons/fa'

const OurPolicy = () => {
  const policyItems = [
    {
      icon: <FaExchangeAlt className="text-pink-500 text-2xl" />,
      image: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy",
      color: "bg-pink-50"
    },
    {
      icon: <FaUndoAlt className="text-blue-500 text-2xl" />,
      image: assets.quality_icon,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
      color: "bg-blue-50"
    },
    {
      icon: <FaHeadset className="text-green-500 text-2xl" />,
      image: assets.support_img,
      title: "Best Customer Support",
      description: "We provide 24/7 customer support",
      color: "bg-green-50"
    }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      {policyItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className={`${item.color} p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center`}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-5">
            {item.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default OurPolicy

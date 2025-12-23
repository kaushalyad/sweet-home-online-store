import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { FaBell, FaTimes, FaCheckCircle, FaEnvelope, FaUser } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const NotifyMeWidget = ({ productId = null, productName = '', onClose }) => {
  const [open, setOpen] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({ name: '', email: '' })

  const handleClose = () => {
    setOpen(false)
    onClose && onClose()
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = { name: '', email: '' }
    if (!name.trim()) newErrors.name = 'Please enter your name'
    if (!email.trim()) newErrors.email = 'Please enter your email'
    else if (!validateEmail(email)) newErrors.email = 'Please enter a valid email'
    
    if (newErrors.name || newErrors.email) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    try {
      const resp = await axios.post(`${backendUrl}/api/messages`, {
        name,
        email,
        message: `Notify me for product: ${productName}`,
        productId,
        productName
      })
      if (resp.data && resp.data.success) {
        setSuccess(true)
        setTimeout(() => {
          handleClose()
        }, 2500)
      } else {
        setErrors({ ...errors, email: resp.data?.message || 'Failed to submit' })
      }
    } catch (err) {
      console.error('Notify submit error', err)
      setErrors({ ...errors, email: err.response?.data?.message || 'Failed to submit. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 sm:p-6"
        onClick={handleClose}
      >
          <motion.div 
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 sm:p-6 relative">
              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all active:scale-90"
                aria-label="Close"
              >
                <FaTimes size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ rotate: -20 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 sm:p-3"
                >
                  <FaBell className="text-white text-xl sm:text-2xl" />
                </motion.div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Get Notified</h3>
                  <p className="text-pink-100 text-xs sm:text-sm">Stay in the loop</p>
                </div>
              </div>
            </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {success ? (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="text-center py-4 sm:py-6"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="mb-4 flex justify-center"
                >
                  <div className="bg-green-100 rounded-full p-3 sm:p-4">
                    <FaCheckCircle className="text-green-500 text-4xl sm:text-5xl" />
                  </div>
                </motion.div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">You're all set!</h4>
                <p className="text-sm sm:text-base text-gray-600 px-2">We'll notify you as soon as <span className="font-semibold text-pink-600">{productName}</span> becomes available.</p>
              </motion.div>
            ) : (
              <>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  Be the first to know when <span className="font-semibold text-gray-800">{productName || 'this product'}</span> is back in stock.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  {/* Name Input */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaUser size={14} className="sm:w-4 sm:h-4" />
                      </div>
                      <input 
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'} rounded-lg focus:outline-none focus:ring-2 transition-all`}
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => {
                          setName(e.target.value)
                          setErrors({ ...errors, name: '' })
                        }}
                      />
                    </div>
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaEnvelope size={14} className="sm:w-4 sm:h-4" />
                      </div>
                      <input 
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-pink-500 focus:border-pink-500'} rounded-lg focus:outline-none focus:ring-2 transition-all`}
                        placeholder="your.email@example.com" 
                        type="email"
                        value={email} 
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setErrors({ ...errors, email: '' })
                        }}
                      />
                    </div>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Buttons */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2"
                  >
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full sm:flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaBell />
                          <span>Notify Me</span>
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClose}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </form>

                {/* Privacy Note */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-gray-500 text-center mt-3 sm:mt-4"
                >
                  🔒 We respect your privacy. Your email will only be used for product notifications.
                </motion.p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotifyMeWidget

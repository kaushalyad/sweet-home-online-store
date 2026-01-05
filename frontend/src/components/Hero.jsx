import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <>
      <div className='flex flex-col sm:flex-row border border-gray-400'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
              <div className='text-[#414141]'>
                  <div className='flex items-center gap-2'>
                      <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                      <p className=' font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                  </div>
                  <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                  <Link to="/collection" className='flex items-center gap-2 hover:text-pink-600 transition-colors duration-300'>
                      <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                      <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>
                  </Link>
              </div>
        </div>
        {/* Hero Right Side */}
        <img className='w-full sm:w-1/2' src={assets.hero_img} alt="Sweet Home Online Store - Indian Sweets, Mithai, and Namkeen" />
      </div>

      {/* Customer Testimonials Section with Schema.org Review markup */}
      <section className="bg-orange-50 py-8 px-4 md:px-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">What Our Customers Say</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <blockquote itemScope itemType="https://schema.org/Review" className="bg-white p-6 rounded-xl shadow border">
              <p itemProp="reviewBody" className="text-gray-700 mb-2">"Absolutely delicious sweets! The Kaju Katli and Gulab Jamun were fresh and authentic. Fast delivery too!"</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-orange-700" itemProp="author">Priya Sharma</span>
                <meta itemProp="datePublished" content="2025-12-10" />
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <meta itemProp="reviewRating" content="5" />
            </blockquote>
            <blockquote itemScope itemType="https://schema.org/Review" className="bg-white p-6 rounded-xl shadow border">
              <p itemProp="reviewBody" className="text-gray-700 mb-2">"Best place to order sweets online for festivals. The packaging was beautiful and the taste was just like home!"</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-orange-700" itemProp="author">Amit Verma</span>
                <meta itemProp="datePublished" content="2025-11-01" />
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <meta itemProp="reviewRating" content="5" />
            </blockquote>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero

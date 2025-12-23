import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { FaBoxOpen, FaShoppingCart, FaBoxes, FaChartBar } from 'react-icons/fa'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/products">
                <FaBoxes className='w-5 h-5 text-pink-600' />
                <p className='hidden md:block'>Products</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/orders">
                <FaShoppingCart className='w-5 h-5 text-pink-600' />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
            
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/dashboard">
                <FaChartBar className='w-5 h-5 text-pink-600' />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar
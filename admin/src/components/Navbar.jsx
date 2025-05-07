import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { assets } from '../assets/assets';
import { FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();  // Initialize navigate function

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img 
        className='w-[max(8%,60px)] h-auto cursor-pointer transition-transform duration-300 hover:scale-105' 
        onClick={() => { navigate("/"); }}   // Use navigate to redirect to the home page
        src={assets.logo} 
        alt="Logo" 
      />
      <div className='text-2xl sm:text-3xl font-bold font-extrabold'>Admin Panel</div>
      <div className='flex items-center gap-4'>
        <Link to="/analytics" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300">
          <FaChartLine className="mr-2" />
          Analytics
        </Link>
        <button 
          onClick={() => setToken('')} 
          className='bg-gray-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-colors duration-300'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

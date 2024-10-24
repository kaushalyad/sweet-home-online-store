import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();  // Initialize navigate function

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img 
        className='w-[max(10%,80px)] cursor-pointer' 
        onClick={() => { navigate("/"); }}   // Use navigate to redirect to the home page
        src={assets.logo} 
        alt="Logo" 
      />
      <div className='text-3xl font-bold font-extrabold'>Admin Panel</div>
      <button 
        onClick={() => setToken('')} 
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;

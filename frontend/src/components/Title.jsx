import React from 'react';

const Title = ({ text1 = "Welcome to", text2 = "Our Store", className = "" }) => {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`} aria-label={`${text1} ${text2}`}>
      <div className="w-8 sm:w-10 h-[1px] bg-gradient-to-r from-gray-300 to-gray-500"></div>
      <p className="text-gray-600 text-xl sm:text-2xl font-medium tracking-wide">
        {text1}{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 font-semibold">
          {text2}
        </span>
      </p>
      <div className="w-8 sm:w-10 h-[1px] bg-gradient-to-r from-gray-500 to-gray-300"></div>
    </div>
  );
};

export default Title;

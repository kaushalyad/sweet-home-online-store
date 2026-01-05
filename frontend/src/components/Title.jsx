import React from "react";

const Title = ({
  text1 = "Welcome to",
  text2 = "Our Store",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-6 ${className}`}
      aria-label={`${text1} ${text2}`}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-gradient bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight mb-2">
        {text1} <span className="whitespace-nowrap">{text2}</span>
      </h1>
      <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full mb-2"></div>
    </div>
  );
};

export default Title;

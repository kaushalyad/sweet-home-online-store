import React from "react";

const Title = ({
  text1 = "Welcome to",
  text2 = "Our Store",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center ${className}`}
      aria-label={`${text1} ${text2}`}
    >
      <div className="text-gray-800 flex items-center small_mobile:text-xl mobile:text-2xl  font-medium tracking-wide">
        <span>{text1}</span>
        <span className="ml-1">{text2}</span>
      </div>
    </div>
  );
};

export default Title;

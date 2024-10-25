import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-14" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            At{" "}
            <span className=" font-semibold text-lg text-red-400">
              Sweet Home
            </span>
            , we specialize in delightful sweets made exclusively from{" "}
            <span className="font-semibold text-lg text-red-400">
              pure cow milk
            </span>
            . Our artisanal treats combine traditional recipes with the rich,
            creamy flavor of high-quality milk, ensuring every bite is a taste
            of indulgence. Whether you're looking for the latest sweet
            sensations or our best-selling favorites, our offerings promise to
            satisfy your cravings and bring a touch of sweetness to your day.
            Discover the essence of authentic sweetness with us!
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+91-9931018857</li>
            <li>sweethomeowner@sweethome-store.com </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ sweethome-store.com - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;

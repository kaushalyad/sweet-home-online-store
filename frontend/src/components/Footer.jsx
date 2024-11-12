import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Import icons

const Footer = () => {
  return (
    <div>
      <div className=" sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-7 my-10 mt-40 text-sm">
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
          <p className="text-xl font-medium mb-5">HELP</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <NavLink><li className="underline">Payments </li></NavLink>
            <NavLink><li className="underline">Shipping</li></NavLink>
            <NavLink><li className="underline">Cancellation & Returns</li></NavLink>
            <NavLink><li className="underline">FAQ</li></NavLink>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">CONSUMER POLICY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <NavLink><li className="underline">Cancellation & Returns</li></NavLink>
            <NavLink><li className="underline">Privacy policy</li></NavLink>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
    <li className="flex items-center gap-2">
      <FaPhoneAlt className="text-blue-600" />
      <span>+91-9931018857</span>
    </li>
    <li className="flex items-center gap-2">
      <FaEnvelope className="text-blue-600" />
      <a 
        href="mailto:sweethomeowner@sweethome-store.com" 
        className="hover:text-blue-600"
      >
        sweethomeowner@sweethome-store.com
      </a>
    </li>
    <li className="flex items-center gap-2">
      <FaEnvelope className="text-blue-600" />
      <a 
        href="kaushalyad321@gmail.com" 
        className="hover:text-blue-600"
      >
        kaushalyad321@gmail.com
      </a>
    </li>
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

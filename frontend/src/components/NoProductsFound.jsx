import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const NoProductsFound = ({
  title = "No products found",
  subtitle = "Try adjusting your filters or search terms.",
  primaryActionLabel = "Clear filters",
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 text-center">
      <div className="mx-auto mb-6 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        {/* Friendly “no data found” style illustration (document + magnifier) */}
        <svg
          viewBox="0 0 160 160"
          className="w-20 h-20 sm:w-24 sm:h-24"
          role="img"
          aria-label="No products found illustration"
        >
          <defs>
            <linearGradient id="npf_doc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#FCE7F3" />
            </linearGradient>
            <linearGradient id="npf_glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* document */}
          <path
            d="M54 38h45l17 17v58c0 6-5 11-11 11H54c-6 0-11-5-11-11V49c0-6 5-11 11-11z"
            fill="url(#npf_doc)"
            stroke="#93C5FD"
            strokeWidth="3"
            opacity="0.95"
          />
          <path
            d="M99 38v17c0 4 3 7 7 7h17"
            fill="#BFDBFE"
            opacity="0.9"
          />

          {/* question mark */}
          <path
            d="M73 78c0-9 7-14 15-14 7 0 14 4 14 11 0 6-4 9-9 12-5 3-6 4-6 9"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="86" cy="110" r="4.5" fill="#7DD3FC" />

          {/* animated magnifier */}
          <motion.g
            animate={{ x: [0, -4, 3, 0], y: [0, -3, 1, 0], rotate: [0, -3, 2, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "114px 114px" }}
          >
            <g transform="translate(78 78)">
              <motion.circle
                cx="36"
                cy="36"
                r="26"
                fill="rgba(255,255,255,0.65)"
                stroke="url(#npf_glass)"
                strokeWidth="8"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "36px 36px" }}
              />
              <path
                d="M56 56l16 16"
                stroke="url(#npf_glass)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M28 28l16 16M44 28L28 44"
                stroke="#93C5FD"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
          </motion.g>
        </svg>
      </div>

      <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {title}
      </h3>
      <p className="font-inter text-gray-600 text-base sm:text-lg mb-7">
        {subtitle}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {primaryActionLabel && onPrimaryAction && (
          <button
            onClick={onPrimaryAction}
            className="btn-interactive inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 hover:shadow-strong transition-all duration-200 font-semibold"
          >
            {primaryActionLabel}
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-gray-200 bg-white text-gray-900 font-semibold hover:border-gray-300 hover:bg-gray-50 hover:shadow-soft transition-all duration-200"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

NoProductsFound.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  primaryActionLabel: PropTypes.string,
  onPrimaryAction: PropTypes.func,
  secondaryActionLabel: PropTypes.string,
  onSecondaryAction: PropTypes.func,
};

export default NoProductsFound;


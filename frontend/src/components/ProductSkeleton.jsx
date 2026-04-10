import React from "react";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton = ({ count = 10 }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7 gap-y-8 md:gap-y-12">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="relative"
          >
            {/* Image Skeleton - matching ProductItem dimensions */}
            <div className="overflow-hidden rounded-lg md:rounded-2xl mb-2 md:mb-3">
              <Skeleton height="100%" className="h-44 sm:h-52 md:h-64 lg:h-72" />
            </div>

            {/* Product Name Skeleton */}
            <div className="px-0.5 md:px-1 space-y-1 md:space-y-2">
              <Skeleton height={14} className="md:h-4" />
              <Skeleton height={12} width="80%" className="md:h-3" />
            </div>

            {/* Rating Skeleton */}
            <div className="mt-1 md:mt-2 px-0.5 md:px-1 flex items-center gap-0.5 md:gap-1">
              <Skeleton circle width={10} height={10} count={5} inline containerClassName="flex gap-0.5 md:gap-1" />
            </div>

            {/* Price Skeleton */}
            <div className="mt-2 md:mt-3 px-0.5 md:px-1">
              <Skeleton height={20} width="50%" className="md:h-6" />
            </div>

            {/* Button Skeleton */}
            <div className="mt-2 md:mt-4">
              <Skeleton height={32} borderRadius={8} className="md:h-10 md:rounded-xl" />
            </div>
          </motion.div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default ProductSkeleton;


import React from "react";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton = ({ count = 10 }) => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 px-4">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="relative"
          >
            {/* Image Skeleton - matching ProductItem dimensions */}
            <div className="overflow-hidden rounded-2xl mb-3">
              <Skeleton height="100%" className="h-44 sm:h-48 md:h-56 lg:h-64" />
            </div>

            {/* Product Name Skeleton */}
            <div className="px-1 space-y-2">
              <Skeleton height={16} />
              <Skeleton height={12} width="80%" />
            </div>

            {/* Rating Skeleton */}
            <div className="mt-2 px-1 flex items-center gap-1">
              <Skeleton circle width={12} height={12} count={5} inline containerClassName="flex gap-1" />
            </div>

            {/* Price Skeleton */}
            <div className="mt-3 px-1">
              <Skeleton height={24} width="50%" />
            </div>

            {/* Button Skeleton */}
            <div className="mt-4">
              <Skeleton height={40} borderRadius={12} />
            </div>
          </motion.div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default ProductSkeleton;

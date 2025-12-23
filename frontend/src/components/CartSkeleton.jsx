import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CartSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="container mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <Skeleton width={200} height={36} className="mb-2" />
          <Skeleton width={150} height={20} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            {/* Cart Item Skeletons */}
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100 animate-pulse"
              >
                <div className="flex gap-4">
                  {/* Image Skeleton */}
                  <div className="flex-shrink-0">
                    <Skeleton width={100} height={100} className="rounded-lg" />
                  </div>

                  {/* Content Skeleton */}
                  <div className="flex-1 space-y-3">
                    {/* Product Name */}
                    <Skeleton width="80%" height={24} />
                    
                    {/* Price */}
                    <Skeleton width="40%" height={20} />
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <Skeleton width={120} height={36} className="rounded-lg" />
                      <Skeleton width={80} height={20} />
                    </div>
                  </div>

                  {/* Remove Button Skeleton */}
                  <div className="flex-shrink-0">
                    <Skeleton width={36} height={36} className="rounded-lg" />
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button Skeleton */}
            <div className="mt-6">
              <Skeleton width={200} height={44} className="rounded-lg" />
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-24">
              {/* Summary Title */}
              <Skeleton width={150} height={28} className="mb-6" />
              
              {/* Summary Items */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton width={80} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
                <div className="flex justify-between">
                  <Skeleton width={100} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
                <Skeleton height={1} className="my-4" />
                <div className="flex justify-between">
                  <Skeleton width={80} height={24} />
                  <Skeleton width={80} height={24} />
                </div>
              </div>

              {/* Checkout Button Skeleton */}
              <div className="mt-6">
                <Skeleton height={48} className="rounded-lg" />
              </div>

              {/* Additional Info Skeleton */}
              <div className="mt-6 space-y-2">
                <Skeleton width="100%" height={16} />
                <Skeleton width="90%" height={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CartSkeleton;

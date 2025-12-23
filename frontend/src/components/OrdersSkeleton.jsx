import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const OrdersSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          {/* Title Skeleton */}
          <div className="mb-8">
            <Skeleton width={200} height={36} className="mb-2" />
            <Skeleton width={300} height={20} />
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-6">
            <Skeleton height={48} className="rounded-lg" />
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((order) => (
              <div 
                key={order}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <Skeleton width={100} height={16} className="mb-2" />
                        <Skeleton width={150} height={20} />
                      </div>
                      <div className="hidden sm:block">
                        <Skeleton width={100} height={16} className="mb-2" />
                        <Skeleton width={120} height={20} />
                      </div>
                    </div>
                    <Skeleton width={120} height={32} className="rounded-full" />
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <Skeleton width={80} height={80} className="rounded-lg" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Skeleton width="70%" height={20} className="mb-2" />
                          <div className="flex flex-wrap gap-4 text-sm mb-2">
                            <Skeleton width={80} height={16} />
                            <Skeleton width={100} height={16} />
                          </div>
                          <Skeleton width={60} height={18} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Skeleton circle width={40} height={40} />
                      <div>
                        <Skeleton width={100} height={16} className="mb-1" />
                        <Skeleton width={150} height={14} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Skeleton width={100} height={40} className="rounded-lg" />
                      <Skeleton width={100} height={40} className="rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton width={100} height={16} className="mb-2" />
                    <Skeleton width={60} height={28} />
                  </div>
                  <Skeleton circle width={48} height={48} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default OrdersSkeleton;

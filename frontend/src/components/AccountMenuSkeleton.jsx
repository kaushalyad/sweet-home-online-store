import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AccountMenuSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="absolute right-0 top-full mt-2 w-60 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
        {/* Header Section with User Info */}
        <div className="px-4 py-3 border-b border-gray-200">
          <Skeleton width={80} height={12} className="mb-2" style={{ borderRadius: 0 }} />
          <Skeleton width={120} height={16} style={{ borderRadius: 0 }} />
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="px-4 py-2">
              <Skeleton width="100%" height={32} style={{ borderRadius: 0 }} />
            </div>
          ))}

          {/* Logout Button */}
          <div className="border-t border-gray-200 mt-2 pt-2 px-4">
            <Skeleton width="100%" height={32} style={{ borderRadius: 0 }} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AccountMenuSkeleton;

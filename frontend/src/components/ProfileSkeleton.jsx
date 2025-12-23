import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfileSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        {/* Section Title */}
        <Skeleton width={200} height={24} className="mb-4 sm:mb-6" style={{ borderRadius: 0 }} />

        {/* Profile Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start">
                <Skeleton circle width={32} height={32} className="mr-3 sm:mr-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton width={100} height={14} className="mb-2" style={{ borderRadius: 0 }} />
                  <Skeleton width="80%" height={18} style={{ borderRadius: 0 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-start">
                <Skeleton circle width={32} height={32} className="mr-3 sm:mr-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton width={100} height={14} className="mb-2" style={{ borderRadius: 0 }} />
                  <Skeleton width="80%" height={18} style={{ borderRadius: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 sm:mt-8 border-t border-gray-100 pt-4 sm:pt-6">
          <Skeleton width={140} height={44} style={{ borderRadius: '6px' }} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProfileSkeleton;

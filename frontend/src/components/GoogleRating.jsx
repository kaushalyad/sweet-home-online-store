import { FaStar, FaGoogle, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const GoogleRating = () => {
  // Replace these with your actual Google Business Profile data
  const rating = 4.8; // Your current rating
  const reviewCount = 127; // Your current review count
  const googleMapsUrl = "https://share.google/TPBYRJga7Z7Ze6FPe";

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={i} className="text-yellow-400 text-lg" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <FaStar className="text-gray-300 text-lg" />
          <FaStar className="text-yellow-400 text-lg absolute top-0 left-0 w-1/2 overflow-hidden" />
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300 text-lg" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-xl sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-sm">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Google logo"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#4285F4" d="M23.64 12.2c0-.78-.07-1.53-.2-2.26H12.24v4.28h6.35c-.27 1.4-1.06 2.59-2.27 3.39v2.82h3.67c2.14-1.97 3.38-4.88 3.38-8.23z" />
              <path fill="#34A853" d="M12.24 24c2.97 0 5.46-.98 7.28-2.66l-3.67-2.82c-1.02.69-2.34 1.1-3.61 1.1-2.78 0-5.14-1.88-5.98-4.4H3.39v2.76C5.21 21.95 8.45 24 12.24 24z" />
              <path fill="#FBBC05" d="M6.26 14.22c-.22-.66-.35-1.37-.35-2.1s.13-1.44.35-2.1V7.26H3.39A11.99 11.99 0 0 0 1.98 12.12c0 1.96.47 3.8 1.31 5.45l2.97-2.35z" />
              <path fill="#EA4335" d="M12.24 4.76c1.62 0 3.07.56 4.22 1.65l3.16-3.16C17.69 1.35 15.2 0 12.24 0 8.45 0 5.21 2.05 3.39 5.26l2.97 2.76C7.1 6.64 9.46 4.76 12.24 4.76z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Google Reviews</h3>
            <p className="text-sm text-slate-500">Trusted by our customers</p>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-center sm:text-right">
          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <span className="text-lg font-bold text-slate-900">{rating.toFixed(1)}</span>
            <span className="text-sm text-slate-500">/ 5</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 sm:justify-end text-slate-500">
            {renderStars(rating)}
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
            {reviewCount} reviews
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          aria-label="View on Google Maps"
        >
          <FaMapMarkerAlt className="text-slate-700" />
          View on Maps
        </a>
        <a
          href={`${googleMapsUrl}&rlfi=write-review`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
          aria-label="Write a review"
        >
          <FaStar className="text-white" />
          Write Review
        </a>
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Sweet Home Online Store",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": rating,
            "reviewCount": reviewCount,
            "bestRating": "5",
            "worstRating": "1"
          },
          "url": "https://sweethome-store.com",
          "sameAs": [googleMapsUrl]
        })}
      </script>
    </motion.div>
  );
};

export default GoogleRating;
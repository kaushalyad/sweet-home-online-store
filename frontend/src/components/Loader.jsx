import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-b from-orange-50/30 to-transparent">
      <div className="relative w-28 h-28">
        {/* Soft glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full blur-xl opacity-40"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ring spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-orange-100" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 border-r-orange-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />

        {/* Center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-medium border border-orange-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500" />
          </div>
        </div>
      </div>

      <motion.div
        className="mt-7 flex items-center gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="text-gray-700 font-semibold text-lg">Loading</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-orange-500 rounded-full"
            animate={{ y: [0, -7, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
      </motion.div>

      <p className="text-gray-500 text-sm mt-2">Preparing your experience…</p>
    </div>
  );
};

export default Loader;

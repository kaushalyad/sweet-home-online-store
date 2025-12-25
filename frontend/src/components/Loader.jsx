import { motion } from 'framer-motion';

const Loader = () => {
  const sweets = ['🍬', '🍭', '🧁'];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gradient-to-b from-orange-50/30 to-transparent">
      <div className="relative w-32 h-32">
        {/* Outer glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur-xl opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Three rotating dots */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2,
            }}
            style={{
              transformOrigin: '0 0',
            }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg"
              style={{
                x: 40 * Math.cos((index * 120 * Math.PI) / 180),
                y: 40 * Math.sin((index * 120 * Math.PI) / 180),
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          </motion.div>
        ))}

        {/* Center animated sweet icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-orange-200">
            <motion.span
              className="text-4xl"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🍬
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Loading text with dots */}
      <motion.div
        className="mt-8 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-gray-700 font-semibold text-lg">Loading</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-orange-500 rounded-full"
            animate={{
              y: [0, -8, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-gray-500 text-sm mt-2"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Preparing sweet delights for you...
      </motion.p>
    </div>
  );
};

export default Loader;

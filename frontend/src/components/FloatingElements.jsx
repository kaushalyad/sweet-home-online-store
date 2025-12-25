import { motion } from 'framer-motion';

const FloatingElements = () => {
  const elements = [
    { emoji: '🍬', size: 'text-3xl', delay: 0, x: '10%', duration: 20 },
    { emoji: '🍭', size: 'text-4xl', delay: 2, x: '85%', duration: 25 },
    { emoji: '🧁', size: 'text-3xl', delay: 4, x: '70%', duration: 22 },
    { emoji: '🍰', size: 'text-2xl', delay: 1, x: '25%', duration: 18 },
    { emoji: '🎂', size: 'text-3xl', delay: 3, x: '50%', duration: 24 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} opacity-10`}
          style={{
            left: element.x,
            bottom: '-10%',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            rotate: [0, 360],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
            ease: "linear",
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;

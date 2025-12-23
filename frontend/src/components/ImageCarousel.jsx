import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Placeholder images - replace these with your actual image URLs
  const images = [
    'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=1920&h=600&fit=crop', // Indian sweets 1
    'https://images.unsplash.com/photo-1606312619070-d48b4d42c937?w=1920&h=600&fit=crop', // Indian sweets 2
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1920&h=600&fit=crop', // Indian sweets 3
    'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=1920&h=600&fit=crop', // Sweets display 1
    'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=1920&h=600&fit=crop', // Sweets display 2
    'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=1920&h=600&fit=crop', // Desserts 1
    'https://images.unsplash.com/photo-1619985632461-f33748ef8f3e?w=1920&h=600&fit=crop', // Desserts 2
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=1920&h=600&fit=crop', // Sweets platter 1
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1920&h=600&fit=crop', // Indian desserts
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1920&h=600&fit=crop', // Sweets collection
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative w-full min-w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Images */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full relative"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Optional overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 hover:scale-125 z-10"
        aria-label="Previous slide"
        style={{ filter: 'drop-shadow(0 0 3px black) drop-shadow(0 0 2px black)' }}
      >
        <FaChevronLeft className="w-16 h-16" style={{ stroke: 'black', strokeWidth: '8px' }} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 hover:scale-125 z-10"
        aria-label="Next slide"
        style={{ filter: 'drop-shadow(0 0 3px black) drop-shadow(0 0 2px black)' }}
      >
        <FaChevronRight className="w-16 h-16" style={{ stroke: 'black', strokeWidth: '8px' }} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'bg-white w-8 h-3'
                : 'bg-white/60 hover:bg-white/80 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;

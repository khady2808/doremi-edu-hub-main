import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Switzerland',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    buttonText: 'Voir plus'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'France',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    buttonText: 'Voir plus'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Italy',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    buttonText: 'Voir plus'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Norway',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    buttonText: 'Voir plus'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Canada',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    buttonText: 'Voir plus'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    title: 'Japan',
    description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
    buttonText: 'Voir plus'
  }
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isHovered) {
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    } else {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isHovered]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  };

  const getVisibleSlides = () => {
    const visibleSlides = [];
    const slidesToShow = {
      desktop: 4,
      tablet: 2,
      mobile: 1
    };

    // Determine how many slides to show based on screen size
    // This will be handled by responsive classes in the JSX

    for (let i = 0; i < slides.length; i++) {
      visibleSlides.push(slides[i]);
    }
    return visibleSlides;
  };

  // Responsive slide calculations
  const getTranslateValue = () => {
    // Desktop: show 4 slides, Tablet: show 2 slides, Mobile: show 1 slide
    return -(currentIndex * (100 / 4)); // Default desktop view
  };

  return (
    <div 
      className="relative w-full bg-background rounded-2xl shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container */}
      <div className="relative h-96 overflow-hidden">
        {/* Slides Container - Desktop: 4 slides, Tablet: 2 slides, Mobile: 1 slide */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full lg:w-[150%] md:w-[300%] w-[600%]"
          style={{ 
            transform: `translateX(${getTranslateValue()}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id} 
              className="relative flex-shrink-0 h-full group lg:w-1/4 md:w-1/2 w-full"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <div className="transform transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
                    {slide.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 mb-4 line-clamp-3 animate-fade-in delay-100">
                    {slide.description}
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="self-start bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30 animate-fade-in delay-200"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
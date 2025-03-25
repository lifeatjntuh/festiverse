
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/types";
import EventCard from "./EventCard";

interface FeaturedEventsProps {
  events: Event[];
}

const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const showPreviousSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };
  
  const showNextSlide = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };
  
  const getVisibleCount = () => {
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };
  
  const visibleCount = getVisibleCount();
  
  return (
    <div className="relative pb-10">
      <div className="overflow-hidden py-4">
        <motion.div
          ref={carouselRef}
          className="flex"
          animate={{
            x: `calc(-${currentIndex * (100 / visibleCount)}%)`,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="min-w-0"
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="px-2">
                <EventCard event={event} index={index} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentIndex === index
                ? "bg-primary w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={showPreviousSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={showNextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FeaturedEvents;

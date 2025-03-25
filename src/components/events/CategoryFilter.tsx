
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCategory, CategoryFilterOption } from "@/types";

interface CategoryFilterProps {
  selectedCategory: EventCategory | null;
  onChange: (category: EventCategory | null) => void;
}

const CategoryFilter = ({ selectedCategory, onChange }: CategoryFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories: CategoryFilterOption[] = [
    { value: "competition", label: "Competitions", color: "bg-festive-blue" },
    { value: "workshop", label: "Workshops", color: "bg-festive-purple" },
    { value: "stall", label: "Stalls", color: "bg-festive-orange" },
    { value: "exhibit", label: "Exhibits", color: "bg-festive-teal" },
    { value: "performance", label: "Performances", color: "bg-festive-pink" },
    { value: "lecture", label: "Lectures", color: "bg-festive-indigo" },
    { value: "games", label: "Games", color: "bg-festive-green" },
    { value: "food", label: "Food", color: "bg-festive-red" },
    { value: "merch", label: "Merchandise", color: "bg-festive-yellow" },
    { value: "art", label: "Art", color: "bg-festive-purple" },
    { value: "sport", label: "Sports", color: "bg-festive-blue" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth / 2;
    
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto py-2 scrollbar-hidden"
      >
        <button
          onClick={() => onChange(null)}
          className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Events
        </button>
        
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onChange(category.value)}
            className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              selectedCategory === category.value
                ? `${category.color}`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search events..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);
  
  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };
  
  return (
    <motion.div
      className={`relative flex items-center overflow-hidden rounded-full border transition-all duration-300 ${
        isFocused
          ? "border-primary shadow-sm ring-2 ring-primary/10"
          : "border-gray-200"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className={`h-5 w-5 ${isFocused ? "text-primary" : "text-gray-400"}`} />
      </div>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-transparent py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none"
        placeholder={placeholder}
      />
      
      <AnimatePresence>
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;

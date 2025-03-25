
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div 
        className="mx-auto max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-primary">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
        <p className="mb-8 text-xl text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

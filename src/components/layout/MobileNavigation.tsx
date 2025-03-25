
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Calendar, User, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const MobileNavigation = () => {
  const { user } = useAuth();
  
  return (
    <motion.nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid grid-cols-5 h-16">
        <NavItem to="/" icon={<Home />} label="Events" />
        <NavItem to="/map" icon={<MapPin />} label="Map" />
        <NavItem to="/timeline" icon={<Calendar />} label="Schedule" />
        <NavItem to="/updates" icon={<Bell />} label="Updates" />
        <NavItem to={user ? "/profile" : "/login"} icon={<User />} label={user ? "Profile" : "Login"} />
      </div>
    </motion.nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const pathname = window.location.pathname;
    setIsActive(
      to === "/" 
        ? pathname === "/" 
        : pathname.startsWith(to)
    );
  }, [to]);
  
  return (
    <Link 
      to={to} 
      className="relative flex flex-col items-center justify-center"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        isActive 
          ? "text-primary" 
          : "text-gray-600"
      }`}>
        {icon}
        {isActive && (
          <motion.div 
            layoutId="mobileNavIndicator"
            className="absolute inset-0 bg-primary/10 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      <span className="text-xs mt-0.5 font-medium">{label}</span>
    </Link>
  );
};

export default MobileNavigation;

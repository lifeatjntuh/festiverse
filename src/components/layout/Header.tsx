
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, Calendar, MapPin, LogOut, Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UpdatesNotification from "@/components/updates/UpdatesNotification";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  scrolled: boolean;
}

const Header = ({ scrolled }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-350 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="text-xl font-medium text-primary flex items-center"
          >
            <span className="bg-primary text-white px-2 py-1 rounded-md mr-1">Next</span>
            <span>Fest</span>
          </Link>
          
          <nav className="hidden md:flex items-center ml-8 space-x-8">
            <NavLink to="/" exact>Events</NavLink>
            <NavLink to="/map">Map</NavLink>
            <NavLink to="/timeline">Schedule</NavLink>
            <NavLink to="/updates">Updates</NavLink>
            {user && user.type === 'admin' && (
              <NavLink to="/admin">Admin</NavLink>
            )}
          </nav>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <UpdatesNotification />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative rounded-full w-10 h-10 p-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {(user.type === 'admin' || user.type === 'organizer') && (
                    <DropdownMenuItem onClick={() => navigate('/create-event')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Create Event</span>
                    </DropdownMenuItem>
                  )}
                  {user.type === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="flex items-center py-2">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/" className="flex items-center py-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Events</span>
                    </Link>
                    <Link to="/map" className="flex items-center py-2">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Map</span>
                    </Link>
                    <Link to="/timeline" className="flex items-center py-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Schedule</span>
                    </Link>
                    <Link to="/updates" className="flex items-center py-2">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Updates</span>
                    </Link>
                    {(user.type === 'admin' || user.type === 'organizer') && (
                      <Link to="/create-event" className="flex items-center py-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Create Event</span>
                      </Link>
                    )}
                    {user.type === 'admin' && (
                      <Link to="/admin" className="flex items-center py-2">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <div className="border-t pt-4 mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/" className="flex items-center py-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Events</span>
                    </Link>
                    <Link to="/map" className="flex items-center py-2">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>Map</span>
                    </Link>
                    <Link to="/timeline" className="flex items-center py-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Schedule</span>
                    </Link>
                    <Link to="/updates" className="flex items-center py-2">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Updates</span>
                    </Link>
                    <div className="border-t pt-4 mt-4 flex flex-col space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => navigate('/login')}
                      >
                        Sign in
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => navigate('/register')}
                      >
                        Register
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

interface NavLinkProps {
  to: string;
  exact?: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, exact, children }: NavLinkProps) => {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const pathname = window.location.pathname;
    if (exact) {
      setIsActive(pathname === to);
    } else {
      setIsActive(pathname.startsWith(to));
    }
  }, [to, exact]);
  
  return (
    <Link 
      to={to} 
      className={`relative py-1 font-medium transition-colors ${
        isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
      {isActive && (
        <motion.div 
          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
          layoutId="navIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default Header;

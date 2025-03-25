
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Calendar, Clock, MapPin, ChevronRight, User } from "lucide-react";
import { Event, User as UserType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserProfileView from "@/components/profile/UserProfileView";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
  const { user } = useAuth();
  const [isStarred, setIsStarred] = useState(event.is_starred || false);
  const [organizer, setOrganizer] = useState<UserType | null>(null);
  const [showOrganizerDialog, setShowOrganizerDialog] = useState(false);
  
  useEffect(() => {
    // Fetch organizer information if the current user is an admin or organizer
    if ((user?.type === 'admin' || user?.type === 'organizer') && event.organizer_id) {
      const fetchOrganizer = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', event.organizer_id)
            .single();
            
          if (!error && data) {
            setOrganizer(data);
          }
        } catch (error) {
          console.error('Error fetching organizer:', error);
        }
      };
      
      fetchOrganizer();
    }
  }, [event.organizer_id, user?.type]);
  
  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsStarred(!isStarred);
    // In a real app, we would call an API to update the star status
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      competition: "bg-festive-blue text-white",
      workshop: "bg-festive-purple text-white",
      stall: "bg-festive-orange text-white",
      exhibit: "bg-festive-teal text-white",
      performance: "bg-festive-pink text-white",
      lecture: "bg-festive-indigo text-white",
      game: "bg-festive-green text-white",
      food: "bg-festive-red text-white",
      merch: "bg-festive-yellow text-black",
      art: "bg-festive-purple text-white",
    };
    return colors[category] || "bg-gray-500 text-white";
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <Link to={`/event/${event.id}`}>
          <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            {event.image_url ? (
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div className="h-full w-full overflow-hidden bg-gray-100">
                  <motion.img
                    src={event.image_url}
                    alt={event.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-r from-primary-soft to-blue-50" />
            )}
            
            <div className="absolute right-3 top-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleStar}
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-colors ${
                  isStarred ? "text-festive-red" : "text-gray-500"
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-all ${isStarred ? "fill-festive-red" : ""}`}
                />
              </motion.button>
            </div>
            
            <div className="p-4">
              <div className="mb-2 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
                {event.star_count > 0 && (
                  <span className="flex items-center text-xs text-gray-500">
                    <Heart className="mr-1 h-3 w-3 fill-festive-red text-festive-red" />
                    {event.star_count}
                  </span>
                )}
              </div>
              
              <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                {event.name}
              </h3>
              
              {event.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {event.description}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(event.date)}
                </div>
                
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatTime(event.time)}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {event.venue}
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  {organizer && (user?.type === 'admin' || user?.type === 'organizer') && (
                    <div 
                      className="flex items-center text-xs text-muted-foreground cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOrganizerDialog(true);
                      }}
                    >
                      <User className="h-3 w-3 mr-1" />
                      Organizer: {organizer.name}
                    </div>
                  )}
                  {!organizer && (
                    <span className="text-xs text-gray-500">
                      {event.department || event.college}
                    </span>
                  )}
                </div>
                
                <span className="flex items-center text-sm font-medium text-primary">
                  View details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
      
      <Dialog open={showOrganizerDialog} onOpenChange={setShowOrganizerDialog}>
        <DialogContent className="sm:max-w-md" onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Event Organizer</DialogTitle>
          </DialogHeader>
          {organizer && <UserProfileView user={organizer} showDetailedInfo={user?.type === 'admin'} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;

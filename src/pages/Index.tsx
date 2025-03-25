
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAllEvents } from "@/hooks/useEvents";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Event, EventCategory } from "@/types";
import CategoryFilter from "@/components/events/CategoryFilter";
import EventList from "@/components/events/EventList";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const { data: allEvents, isLoading, error } = useAllEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    if (!allEvents) return;
    
    // Apply filters
    let result = [...allEvents];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(event => event.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.name.toLowerCase().includes(query) || 
        event.description?.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.department?.toLowerCase().includes(query) ||
        event.college?.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(result);
  }, [allEvents, selectedCategory, searchQuery]);

  // For demo purposes, create a featured events array
  const featuredEvents = allEvents && allEvents.length > 0 
    ? allEvents.slice(0, Math.min(3, allEvents.length)) 
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Festiverse</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and join exciting events happening across campus. 
            Find competitions, workshops, performances and more!
          </p>
        </div>
        
        {featuredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured Events</h2>
            <FeaturedEvents events={featuredEvents} />
          </div>
        )}
        
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search events by name, description, or venue..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onChange={setSelectedCategory} 
          />
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">All Events</h2>
            {selectedCategory && (
              <p className="text-sm text-muted-foreground">
                Showing events in category: <span className="font-semibold">{selectedCategory}</span>
              </p>
            )}
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                Search results for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            filteredEvents && filteredEvents.length > 0 ? (
              <EventList events={filteredEvents} />
            ) : (
              <div className="text-center py-12">
                <p className="text-xl font-medium">No events found</p>
                <p className="text-muted-foreground">
                  {selectedCategory || searchQuery 
                    ? "Try changing your filters or search query."
                    : "Check back later for upcoming events."}
                </p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;

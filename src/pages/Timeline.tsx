
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, Clock, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Event, EventCategory } from "@/types";
import { useAllEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

// Group events by date
const groupEventsByDate = (events: Event[]) => {
  const groupedEvents: Record<string, Event[]> = {};
  
  events.forEach((event) => {
    if (!groupedEvents[event.date]) {
      groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });
  
  // Sort events by time within each date
  Object.keys(groupedEvents).forEach((date) => {
    groupedEvents[date].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  });
  
  return groupedEvents;
};

const Timeline = () => {
  const { data: events, isLoading, error } = useAllEvents();
  const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>({});
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroupedEvents, setFilteredGroupedEvents] = useState<Record<string, Event[]>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load event timeline. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  useEffect(() => {
    if (!events) return;
    
    const grouped = groupEventsByDate(events);
    
    // Set all dates to expanded by default
    const expanded: Record<string, boolean> = {};
    Object.keys(grouped).forEach((date) => {
      expanded[date] = true;
    });
    
    setGroupedEvents(grouped);
    setFilteredGroupedEvents(grouped);
    setExpandedDates(expanded);
  }, [events]);
  
  useEffect(() => {
    if (!events || events.length === 0) return;
    
    if (searchQuery.trim() === "") {
      setFilteredGroupedEvents(groupedEvents);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filteredEvents = events.filter(event => 
      event.name.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.department?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );
    
    setFilteredGroupedEvents(groupEventsByDate(filteredEvents));
  }, [events, groupedEvents, searchQuery]);
  
  const toggleDateExpansion = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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
      competition: "border-festive-blue",
      workshop: "border-festive-purple",
      stall: "border-festive-orange",
      exhibit: "border-festive-teal",
      performance: "border-festive-pink",
      lecture: "border-festive-indigo",
      games: "border-festive-green",
      food: "border-festive-red",
      merch: "border-festive-yellow",
      art: "border-festive-purple",
      sport: "border-festive-blue",
    };
    return colors[category] || "border-gray-300";
  };
  
  const getCategoryBgColor = (category: string) => {
    const colors: Record<string, string> = {
      competition: "bg-festive-blue text-white",
      workshop: "bg-festive-purple text-white",
      stall: "bg-festive-orange text-white",
      exhibit: "bg-festive-teal text-white",
      performance: "bg-festive-pink text-white",
      lecture: "bg-festive-indigo text-white",
      games: "bg-festive-green text-white",
      food: "bg-festive-red text-white",
      merch: "bg-festive-yellow text-white",
      art: "bg-festive-purple text-white",
      sport: "bg-festive-blue text-white",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };
  
  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Event Schedule</h1>
          <p className="mt-2 text-gray-600">
            Plan your Festiverse experience with our timeline view
          </p>
        </div>
        
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="Search events by name, venue, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-gray-500">Loading schedule...</p>
          </div>
        ) : Object.keys(filteredGroupedEvents).length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-medium mb-2">No events found</p>
            <p className="text-muted-foreground">
              Try adjusting your search query or check back later.
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-6 border-l-2 border-dashed border-gray-200 md:left-1/4 md:ml-3"></div>
            
            {Object.keys(filteredGroupedEvents)
              .sort()
              .map((date) => (
                <div key={date} className="mb-8">
                  <button
                    onClick={() => toggleDateExpansion(date)}
                    className="group mb-4 flex w-full items-center"
                  >
                    <div className="relative mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white md:mr-8">
                      <span className="font-medium">
                        {new Date(date).getDate()}
                      </span>
                      <motion.div
                        initial={false}
                        animate={{ opacity: expandedDates[date] ? 0 : 1 }}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary shadow-sm"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </motion.div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary">
                      {formatDate(date)}
                    </h2>
                    
                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors group-hover:bg-gray-100 group-hover:text-gray-600">
                      {expandedDates[date] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                  
                  {expandedDates[date] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pl-16 md:pl-[calc(25%+2rem)]"
                    >
                      {filteredGroupedEvents[date].map((event, index) => (
                        <Link
                          key={event.id}
                          to={`/event/${event.id}`}
                          className="group relative mb-8 block"
                        >
                          <div className="absolute -left-[3.25rem] top-0 h-full w-0.5 bg-gray-100 md:-left-8"></div>
                          <div className="absolute -left-[3.5rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-white md:-left-[2.25rem]"></div>
                          
                          <div className="-mt-1 text-sm font-medium text-gray-500">
                            {formatTime(event.time)}
                          </div>
                          
                          <motion.div
                            whileHover={{ x: 5 }}
                            className={`mt-2 overflow-hidden rounded-lg border-l-4 bg-white p-4 shadow-sm transition-all group-hover:shadow ${getCategoryColor(
                              event.category
                            )}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-primary">
                                  {event.name}
                                </h3>
                                
                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="mr-1 h-3.5 w-3.5" />
                                    {event.venue}
                                  </div>
                                  
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-3.5 w-3.5" />
                                    {formatTime(event.time)}
                                  </div>
                                </div>
                                
                                {event.description && (
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {event.description}
                                  </p>
                                )}
                              </div>
                              
                              <span
                                className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-medium ${getCategoryBgColor(event.category)}`}
                              >
                                {event.category.charAt(0).toUpperCase() +
                                  event.category.slice(1)}
                              </span>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;

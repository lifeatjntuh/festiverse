
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, Filter, MapPin, Loader2 } from "lucide-react";
import { Event, EventCategory } from "@/types";
import { useAllEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Map = () => {
  const { data: events, isLoading, error } = useAllEvents();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load event locations. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  useEffect(() => {
    if (!events) return;
    
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = events.filter(event => 
      event.venue.toLowerCase().includes(query) ||
      event.name.toLowerCase().includes(query) ||
      event.department?.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
    
    setFilteredEvents(filtered);
  }, [events, searchQuery]);
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };
  
  const getCategoryColor = (category: EventCategory) => {
    const colors: Record<string, string> = {
      competition: "bg-festive-blue",
      workshop: "bg-festive-purple",
      stall: "bg-festive-orange",
      exhibit: "bg-festive-teal",
      performance: "bg-festive-pink",
      lecture: "bg-festive-indigo",
      games: "bg-festive-green",
      food: "bg-festive-red",
      merch: "bg-festive-yellow",
      art: "bg-festive-purple",
      sport: "bg-festive-blue",
    };
    return colors[category] || "bg-gray-400";
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  
  return (
    <div className="min-h-screen pb-20 md:pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Event Map</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto"
              onClick={() => setSearchQuery("")}
              disabled={searchQuery === ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            placeholder="Search for venues or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 shadow-sm">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : (
                <div className="relative flex h-full items-center justify-center bg-blue-50">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583089892943-c0a050d265a8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-center text-gray-500">
                      Interactive map will be displayed here
                    </p>
                  </div>
                  
                  {/* Map Markers */}
                  {filteredEvents.map((event, index) => {
                    // Create pseudo-random positions for demo
                    const left = 20 + (index * 15) % 60;
                    const top = 30 + (index * 12) % 40;
                    
                    return (
                      <motion.div
                        key={event.id}
                        className="absolute cursor-pointer"
                        style={{ left: `${left}%`, top: `${top}%` }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getCategoryColor(event.category)} text-white`}>
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className={`absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform ${getCategoryColor(event.category)}`}></div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedEvent.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getCategoryColor(selectedEvent.category)} text-white`}>
                      {selectedEvent.category}
                    </Badge>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {formatTime(selectedEvent.time)} • {formatDate(selectedEvent.date)}
                </div>
                {selectedEvent.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {selectedEvent.description}
                  </p>
                )}
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-2 px-0 text-primary"
                  asChild
                >
                  <a href={`/event/${selectedEvent.id}`}>View Details</a>
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="md:col-span-1">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-medium text-gray-900">
                Venues
              </h2>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No venues found for this search
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <motion.button
                      key={event.id}
                      className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50 ${
                        selectedEvent?.id === event.id ? "bg-gray-50 ring-1 ring-primary/10" : ""
                      }`}
                      onClick={() => setSelectedEvent(event)}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start">
                        <div
                          className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${getCategoryColor(event.category)} text-white`}
                        >
                          <MapPin className="h-3 w-3" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900">
                            {event.venue}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {event.name}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(event.date)} • {formatTime(event.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

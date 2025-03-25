
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, CalendarDays, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Event, EventCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useStarredEvents } from "@/hooks/useEvents";

const StarredEvents = () => {
  const { user } = useAuth();
  const { data: starredEvents, isLoading, error } = useStarredEvents();
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    if (starredEvents) {
      setLocalEvents(starredEvents);
    }
  }, [starredEvents]);

  const handleUnstar = async (eventId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("starred_events")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);
      
      if (error) throw error;
      
      // Update local state
      setLocalEvents(prev => prev.filter(event => event.id !== eventId));
      
      toast({
        title: "Event removed",
        description: "Event has been removed from your starred events.",
      });
    } catch (error) {
      console.error("Error unstarring event:", error);
      toast({
        title: "Error",
        description: "Failed to unstar the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="h-48 animate-pulse">
            <CardContent className="p-0 h-full bg-muted" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading starred events.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (localEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No starred events yet</h3>
        <p className="text-muted-foreground mb-4">You haven't starred any events yet. Browse events and star the ones you're interested in.</p>
        <Button asChild>
          <Link to="/">Browse Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {localEvents.map((event) => (
        <Card key={event.id} className="overflow-hidden group">
          <div className="relative h-40 bg-muted">
            {event.image_url ? (
              <img 
                src={event.image_url} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/30 hover:bg-black/50 text-yellow-400"
                onClick={(e) => {
                  e.preventDefault();
                  handleUnstar(event.id);
                }}
              >
                <Star className="h-5 w-5 fill-current" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <Link to={`/event/${event.id}`} className="hover:underline">
              <h3 className="font-semibold line-clamp-1">{event.name}</h3>
            </Link>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.venue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StarredEvents;

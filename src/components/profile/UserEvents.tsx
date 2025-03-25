
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Plus, Edit, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Event, EventCategory } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const UserEvents = () => {
  const { user } = useAuth();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        let query = supabase
          .from("events")
          .select("*");
        
        // If the user is an organizer, show only their events
        // If admin, show all events
        if (user.type === 'organizer') {
          query = query.eq("organizer_id", user.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Fetched events for user:", data);
          
          // Properly cast the events with the correct category type
          const typedEvents = data.map(event => ({
            ...event,
            category: event.category as EventCategory
          })) as Event[];
          
          setUserEvents(typedEvents);
        } else {
          console.log("No events found for user");
          setUserEvents([]);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
        toast({
          title: "Error",
          description: "Failed to load your events. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserEvents();
  }, [user]);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventToDelete);
      
      if (error) throw error;
      
      // Update local state
      setUserEvents(prev => prev.filter(event => event.id !== eventToDelete));
      
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const openDeleteDialog = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {user?.type === 'admin' ? 'All Events' : 'My Events'}
        </h2>
        <Button asChild>
          <Link to="/create-event">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>
      
      {userEvents.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No events yet</h3>
          <p className="text-muted-foreground mb-4">
            {user?.type === 'admin' 
              ? "There are no events in the system yet."
              : "You haven't created any events yet."}
          </p>
          <Button asChild>
            <Link to="/create-event">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
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
                <div className="absolute top-2 right-2 flex space-x-1">
                  {!event.is_approved && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Pending Approval
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <Link to={`/event/${event.id}`} className="hover:underline">
                    <h3 className="font-semibold line-clamp-1">{event.name}</h3>
                  </Link>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link to={`/edit-event/${event.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => openDeleteDialog(event.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
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
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEvent}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserEvents;

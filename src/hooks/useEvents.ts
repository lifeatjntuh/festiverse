
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event, StarredEvent, CategoryFilterOption, EventCategory } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

// Category filter options with colors
export const categoryFilterOptions: CategoryFilterOption[] = [
  { value: "competition", label: "Competition", color: "#ef4444" },
  { value: "workshop", label: "Workshop", color: "#3b82f6" },
  { value: "stall", label: "Stall", color: "#10b981" },
  { value: "exhibit", label: "Exhibit", color: "#8b5cf6" },
  { value: "performance", label: "Performance", color: "#f97316" },
  { value: "lecture", label: "Lecture", color: "#0ea5e9" },
  { value: "games", label: "Games", color: "#6366f1" },
  { value: "food", label: "Food", color: "#f59e0b" },
  { value: "merch", label: "Merchandise", color: "#14b8a6" },
  { value: "art", label: "Art", color: "#ec4899" },
  { value: "sport", label: "Sport", color: "#3b82f6" },
];

// Get color for a category
export const getCategoryColor = (category: EventCategory): string => {
  const option = categoryFilterOptions.find(opt => opt.value === category);
  return option ? option.color : "#71717a"; // Default color
};

// Custom hook to fetch all events
export const useAllEvents = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        console.log("Fetching all events");
        // Get all approved events
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_approved', true)
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        console.log("Fetched events:", events);
        
        if (!user) return (events || []).map(event => ({
          ...event,
          category: event.category as EventCategory,
          is_starred: false
        }));
        
        // If user is logged in, get their starred events
        const { data: starredData, error: starredError } = await supabase
          .from('starred_events')
          .select('event_id')
          .eq('user_id', user.id);
          
        if (starredError) throw starredError;
        
        // Add is_starred flag to each event
        const starredIds = starredData?.map(item => item.event_id) || [];
        const eventsWithStarred = (events || []).map(event => ({
          ...event,
          category: event.category as EventCategory,
          is_starred: starredIds.includes(event.id)
        }));
        
        return eventsWithStarred;
      } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

// Custom hook to fetch a single event
export const useEvent = (eventId: string | undefined) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('Event ID is required');
      
      try {
        console.log("Fetching event with ID:", eventId);
        const { data: event, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();
        
        if (error) throw error;
        
        console.log("Fetched event:", event);
        
        // Ensure the event category is cast to EventCategory
        const typedEvent = {
          ...event,
          category: event.category as EventCategory
        };
        
        if (!user) return typedEvent;
        
        // Check if event is starred by current user
        const { data: starredData, error: starredError } = await supabase
          .from('starred_events')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (starredError) throw starredError;
        
        return {
          ...typedEvent,
          is_starred: !!starredData
        };
      } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
      }
    },
    enabled: !!eventId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Custom hook to star/unstar an event
export const useStarEvent = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, starred }: { eventId: string; starred: boolean }) => {
      if (!user) throw new Error('You must be logged in to star events');
      
      if (starred) {
        // Star the event
        const { data, error } = await supabase
          .from('starred_events')
          .insert([
            { user_id: user.id, event_id: eventId }
          ]);
        
        if (error) throw error;
        return data;
      } else {
        // Unstar the event
        const { data, error } = await supabase
          .from('starred_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['starred-events'] });
      
      toast({
        title: variables.starred ? "Event starred" : "Event unstarred",
        description: variables.starred 
          ? "Event has been added to your starred events" 
          : "Event has been removed from your starred events",
      });
    },
    onError: (error) => {
      console.error('Error starring/unstarring event:', error);
      toast({
        title: "Error",
        description: "Failed to update star status. Please try again.",
        variant: "destructive",
      });
    }
  });
};

// Custom hook to fetch user's starred events
export const useStarredEvents = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['starred-events'],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        console.log("Fetching starred events for user:", user.id);
        // Get starred events IDs for the current user
        const { data: starredData, error: starredError } = await supabase
          .from('starred_events')
          .select('event_id')
          .eq('user_id', user.id);
        
        if (starredError) throw starredError;
        
        if (starredData.length === 0) return [];
        
        // Get the actual event details
        const eventIds = starredData.map(item => item.event_id);
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .in('id', eventIds);
        
        if (eventsError) throw eventsError;
        
        console.log("Fetched starred events:", eventsData);
        
        // Add is_starred flag
        return (eventsData || []).map(event => ({
          ...event,
          category: event.category as EventCategory,
          is_starred: true
        }));
      } catch (error) {
        console.error('Error fetching starred events:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });
};

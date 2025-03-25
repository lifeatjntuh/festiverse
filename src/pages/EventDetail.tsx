
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEvent } from "@/hooks/useEvents";
import EventDetailView from "@/components/events/EventDetailView";
import { Event } from "@/types";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error, refetch } = useEvent(id);

  const handleEventUpdated = (updatedEvent: Event) => {
    // Refetch the event data to get the updated event
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse mb-4 h-6 w-24 bg-muted rounded"></div>
            <div className="animate-pulse mb-6 h-64 w-full bg-muted rounded-lg"></div>
            <div className="animate-pulse mb-4 h-10 w-3/4 bg-muted rounded"></div>
            <div className="animate-pulse mb-6 h-6 w-1/4 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
              ))}
            </div>
            <div className="animate-pulse h-1 w-full bg-muted rounded my-8"></div>
            <div className="animate-pulse h-4 w-full bg-muted rounded mb-2"></div>
            <div className="animate-pulse h-4 w-full bg-muted rounded mb-2"></div>
            <div className="animate-pulse h-4 w-3/4 bg-muted rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground">
              We couldn't find the event you're looking for.
            </p>
          </div>
        ) : event ? (
          <EventDetailView 
            event={event as Event} 
            onEventUpdated={handleEventUpdated}
          />
        ) : null}
      </motion.div>
    </div>
  );
};

export default EventDetail;

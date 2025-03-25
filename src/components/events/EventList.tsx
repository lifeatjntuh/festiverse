
import { motion } from "framer-motion";
import { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-700">
          No events found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try changing your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </motion.div>
  );
};

export default EventList;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Edit, Star, SendHorizontal, RefreshCw, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Event, EventCategory, EventUpdate, User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventForm from './EventForm';
import SocialShare from '@/components/common/SocialShare';
import UserProfileView from '@/components/profile/UserProfileView';

interface EventDetailViewProps {
  event: Event;
  onEventUpdated?: (updatedEvent: Event) => void;
}

interface EventUpdateWithUserName extends EventUpdate {
  user_name?: string;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ event, onEventUpdated = () => {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const [isStarring, setIsStarring] = useState(false);
  const [starCount, setStarCount] = useState(event.star_count || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [eventUpdates, setEventUpdates] = useState<EventUpdateWithUserName[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [refreshingUpdates, setRefreshingUpdates] = useState(false);
  const [organizer, setOrganizer] = useState<UserType | null>(null);
  const [showOrganizerDialog, setShowOrganizerDialog] = useState(false);

  // Check if event is starred by current user
  useEffect(() => {
    const checkIfStarred = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('starred_events')
          .select('*')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .maybeSingle();
          
        if (!error && data) {
          setIsStarred(true);
        }
      } catch (error) {
        console.error('Error checking starred status:', error);
      }
    };
    
    checkIfStarred();
  }, [user, event.id]);
  
  // Fetch event organizer
  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!event.organizer_id) return;
      
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
  }, [event.organizer_id]);
  
  // Fetch event updates
  const fetchEventUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('event_updates')
        .select(`
          *,
          users:user_id (name)
        `)
        .eq('event_id', event.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedUpdates = data.map(update => ({
        ...update,
        user_name: update.users?.name || 'Unknown'
      }));
      
      setEventUpdates(formattedUpdates);
    } catch (error) {
      console.error('Error fetching event updates:', error);
    } finally {
      setLoadingUpdates(false);
      setRefreshingUpdates(false);
    }
  };
  
  useEffect(() => {
    fetchEventUpdates();
    
    // Set up real-time subscription for updates
    const subscription = supabase
      .channel(`event-updates-${event.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'event_updates', filter: `event_id=eq.${event.id}` },
        async (payload) => {
          console.log('New event update:', payload);
          
          // Fetch the user name for the new update
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', payload.new.user_id)
            .single();
            
          const newUpdate: EventUpdateWithUserName = {
            id: payload.new.id,
            event_id: payload.new.event_id,
            message: payload.new.message,
            user_id: payload.new.user_id,
            created_at: payload.new.created_at,
            user_name: userData?.name || 'Unknown'
          };
          
          setEventUpdates(prev => [newUpdate, ...prev]);
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [event.id]);

  const handleStarEvent = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsStarring(true);
    
    try {
      if (isStarred) {
        // Unstar the event
        const { error } = await supabase
          .from('starred_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id);
          
        if (error) throw error;
        
        setIsStarred(false);
        setStarCount(prev => Math.max(0, prev - 1));
        
        // Update event star count
        await supabase
          .from('events')
          .update({ star_count: Math.max(0, starCount - 1) })
          .eq('id', event.id);
        
        toast({
          title: 'Removed from starred events',
          description: 'This event has been removed from your starred events.'
        });
      } else {
        // Star the event
        const { error } = await supabase
          .from('starred_events')
          .insert([{ user_id: user.id, event_id: event.id }]);
          
        if (error) throw error;
        
        setIsStarred(true);
        setStarCount(prev => prev + 1);
        
        // Update event star count
        await supabase
          .from('events')
          .update({ star_count: starCount + 1 })
          .eq('id', event.id);
        
        toast({
          title: 'Added to starred events',
          description: 'This event has been added to your starred events.'
        });
      }
    } catch (error) {
      console.error('Error starring/unstarring event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update starred status.',
        variant: 'destructive'
      });
    } finally {
      setIsStarring(false);
    }
  };
  
  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newUpdate.trim()) return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('event_updates')
        .insert([{
          event_id: event.id,
          message: newUpdate.trim(),
          user_id: user.id
        }]);
        
      if (error) throw error;
      
      setNewUpdate('');
      
      toast({
        title: 'Update posted',
        description: 'Your update has been posted successfully.'
      });
    } catch (error) {
      console.error('Error posting event update:', error);
      toast({
        title: 'Error',
        description: 'Failed to post update.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const refreshUpdates = () => {
    setRefreshingUpdates(true);
    fetchEventUpdates();
  };
  
  // Check if user is allowed to edit (either the organizer or an admin)
  const canEditEvent = user && (user.id === event.organizer_id || user.type === 'admin');

  // Get current URL for sharing
  const currentUrl = window.location.href;

  if (isEditing) {
    return (
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <EventForm 
          existingEvent={event} 
          onSuccess={(updatedEvent) => {
            setIsEditing(false);
            onEventUpdated(updatedEvent);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{event.name}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="capitalize">{event.category}</Badge>
                {event.department && <Badge variant="outline" className="capitalize">{event.department}</Badge>}
                {event.college && <Badge variant="outline" className="capitalize">{event.college}</Badge>}
              </div>
            </div>
            
            <div className="flex gap-2">
              <SocialShare 
                url={currentUrl}
                title={`${event.name} - Festiverse Event`}
                description={event.description || `Join us for ${event.name} at ${event.venue} on ${format(new Date(event.date), 'MMM dd, yyyy')}`}
              />
            
              <Button
                variant="outline"
                size="sm"
                disabled={isStarring}
                onClick={handleStarEvent}
                className={isStarred ? "bg-yellow-50" : ""}
              >
                <Star className={`h-4 w-4 mr-1 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                <span className="relative">
                  {isStarred ? "Starred" : "Star"}
                  {starCount > 0 && (
                    <span className="absolute -right-5 -top-1 text-xs bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                      {starCount}
                    </span>
                  )}
                </span>
              </Button>
              
              {canEditEvent && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{format(new Date(`2000-01-01 ${event.time}`), 'h:mm a')}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.venue}</span>
            </div>
            {organizer && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground" 
                onClick={() => setShowOrganizerDialog(true)}
              >
                <User className="h-4 w-4 mr-1" />
                <span>Organized by {organizer.name}</span>
              </Button>
            )}
          </div>
          
          <p className="text-foreground whitespace-pre-line">{event.description}</p>
        </div>
        
        <div className="md:w-1/3">
          {event.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img 
                src={event.image_url} 
                alt={event.name} 
                className="w-full h-auto object-cover aspect-video"
              />
            </motion.div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Event Updates</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshUpdates}
            disabled={refreshingUpdates}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshingUpdates ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        
        {(user?.type === 'admin' || user?.id === event.organizer_id) && (
          <form onSubmit={handlePostUpdate} className="flex gap-2">
            <Input
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Post an update about this event..."
              disabled={submitting}
              className="flex-1"
            />
            <Button type="submit" disabled={submitting || !newUpdate.trim()}>
              <SendHorizontal className="h-4 w-4 mr-2" />
              Post
            </Button>
          </form>
        )}
        
        <div className="space-y-3">
          {loadingUpdates ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : eventUpdates.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              No updates for this event yet.
            </div>
          ) : (
            eventUpdates.map(update => (
              <Card key={update.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{update.user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(update.created_at), "MMM d 'at' h:mm a")}
                    </span>
                  </div>
                  <p className="mt-1">{update.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={showOrganizerDialog} onOpenChange={setShowOrganizerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Organizer</DialogTitle>
          </DialogHeader>
          {organizer && <UserProfileView user={organizer} showDetailedInfo={user?.type === 'admin' || user?.type === 'organizer'} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetailView;

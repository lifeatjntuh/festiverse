
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Event, EventCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Event form values excluding computed fields
interface EventFormValues {
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  department?: string;
  college?: string;
  image_url?: string;
}

interface EventFormProps {
  existingEvent?: Event;
  onSuccess?: (event: Event) => void;
}

const EventForm: React.FC<EventFormProps> = ({ existingEvent, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(existingEvent?.image_url || '');
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EventFormValues>({
    defaultValues: {
      name: existingEvent?.name || '',
      description: existingEvent?.description || '',
      category: existingEvent?.category || 'competition',
      date: existingEvent?.date ? new Date(existingEvent.date).toISOString().substring(0, 10) : '',
      time: existingEvent?.time || '',
      venue: existingEvent?.venue || '',
      department: existingEvent?.department || '',
      college: existingEvent?.college || '',
      image_url: existingEvent?.image_url || '',
    }
  });
  
  // Set image URL in form when input changes
  useEffect(() => {
    setValue('image_url', imageUrlInput);
  }, [imageUrlInput, setValue]);
  
  const onSubmit = async (data: EventFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to create or edit events.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (existingEvent) {
        // Update existing event
        const { data: updatedEvent, error } = await supabase
          .from('events')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEvent.id)
          .select('*')
          .single();
        
        if (error) throw error;
        
        toast({
          title: 'Event updated',
          description: 'Your event has been updated successfully.'
        });
        
        if (onSuccess && updatedEvent) {
          onSuccess(updatedEvent as Event);
        }
      } else {
        // Create new event
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert([{
            ...data,
            organizer_id: user.id,
            is_approved: user.type === 'admin' // Auto-approve if admin
          }])
          .select('*')
          .single();
        
        if (error) throw error;
        
        toast({
          title: 'Event created',
          description: user.type === 'admin' 
            ? 'Your event has been created and published.'
            : 'Your event has been created and is pending approval.'
        });
        
        reset();
        
        if (onSuccess && newEvent) {
          onSuccess(newEvent as Event);
        } else {
          navigate(`/event/${newEvent.id}`);
        }
      }
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save event.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Event name is required' })}
            placeholder="Enter event name"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={5}
            placeholder="Describe your event"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              onValueChange={(value) => setValue('category', value as EventCategory)}
              defaultValue={watch('category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="lecture">Lecture</SelectItem>
                <SelectItem value="exhibit">Exhibition</SelectItem>
                <SelectItem value="stall">Stall</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="games">Games</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="merch">Merchandise</SelectItem>
                <SelectItem value="art">Art</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="venue">Venue *</Label>
            <Input
              id="venue"
              {...register('venue', { required: 'Venue is required' })}
              placeholder="Event location"
            />
            {errors.venue && <p className="text-sm text-red-500 mt-1">{errors.venue.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              {...register('time', { required: 'Time is required' })}
            />
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('department')}
              placeholder="Organizing department (optional)"
            />
          </div>
          
          <div>
            <Label htmlFor="college">College</Label>
            <Input
              id="college"
              {...register('college')}
              placeholder="College name (optional)"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a URL for the event image (optional)
          </p>
          
          {imageUrlInput && (
            <div className="mt-2 rounded-md border overflow-hidden w-40 h-24 relative">
              <img 
                src={imageUrlInput}
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (existingEvent) {
              onSuccess?.(existingEvent);
            } else {
              navigate(-1);
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? 'Saving...' 
            : existingEvent 
              ? 'Update Event' 
              : 'Create Event'
          }
        </Button>
      </div>
    </form>
  );
};

export default EventForm;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EventCategory } from "@/types";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const categoryOptions: { value: EventCategory; label: string }[] = [
  { value: "competition", label: "Competition" },
  { value: "workshop", label: "Workshop" },
  { value: "stall", label: "Stall" },
  { value: "exhibit", label: "Exhibit" },
  { value: "performance", label: "Performance" },
  { value: "lecture", label: "Lecture" },
  { value: "games", label: "Games" },
  { value: "food", label: "Food" },
  { value: "merch", label: "Merchandise" },
  { value: "art", label: "Art" },
];

type FormValues = {
  name: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  department?: string;
  college?: string;
  description?: string;
  longitude?: number;
  latitude?: number;
};

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an event",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;
      
      // Upload image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `event-images/${fileName}`;
        
        // Upload the image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('events')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('events')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      // Create the event
      const { error } = await supabase
        .from('events')
        .insert([
          {
            name: data.name,
            category: data.category,
            date: data.date,
            time: data.time,
            venue: data.venue,
            department: data.department,
            college: data.college,
            description: data.description,
            longitude: data.longitude,
            latitude: data.latitude,
            image_url: imageUrl,
            organizer_id: user.id,
            is_approved: user.type === 'admin', // Auto-approve if admin
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Event created",
        description: user.type === 'admin' 
          ? "Your event has been created successfully." 
          : "Your event has been submitted and is pending approval.",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create Event</h1>
          <p className="text-muted-foreground">Create a new event for the festival</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Fill in the details for your new event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter event name"
                    {...register("name", {
                      required: "Event name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => setValue("category", value as EventCategory)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        {...register("date", {
                          required: "Date is required",
                        })}
                      />
                    </div>
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10"
                        {...register("time", {
                          required: "Time is required",
                        })}
                      />
                    </div>
                    {errors.time && (
                      <p className="text-sm text-red-500">{errors.time.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="venue"
                      placeholder="Enter venue"
                      className="pl-10"
                      {...register("venue", {
                        required: "Venue is required",
                      })}
                    />
                  </div>
                  {errors.venue && (
                    <p className="text-sm text-red-500">{errors.venue.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department (Optional)</Label>
                    <Input
                      id="department"
                      placeholder="Enter department"
                      {...register("department")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college">College (Optional)</Label>
                    <Input
                      id="college"
                      placeholder="Enter college"
                      {...register("college")}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description"
                    rows={4}
                    {...register("description")}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Event Image (Optional)</Label>
                  {imagePreview ? (
                    <div className="relative mt-2">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="max-h-64 rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-sm mb-2">Click to upload or drag and drop</p>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude (Optional)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="e.g. 40.7128"
                      {...register("latitude", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude (Optional)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="e.g. -74.0060"
                      {...register("longitude", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateEvent;


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Update {
  id: string;
  message: string;
  admin_id: string;
  created_at: string;
  admin_name?: string;
}

const FestivalUpdates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from("festival_updates")
        .select(`
          *,
          users:admin_id (name)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      const formattedUpdates = data.map(update => ({
        ...update,
        admin_name: update.users?.name || "Unknown Admin"
      }));
      
      setUpdates(formattedUpdates);
    } catch (error) {
      console.error("Error fetching festival updates:", error);
      toast({
        title: "Error",
        description: "Failed to load festival updates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUpdates();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel("festival-updates-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "festival_updates" },
        async (payload) => {
          console.log("New festival update:", payload);
          
          // Fetch the user name for the new update
          const { data: userData } = await supabase
            .from("users")
            .select("name")
            .eq("id", payload.new.admin_id)
            .single();
            
          const newUpdate: Update = {
            id: payload.new.id,
            message: payload.new.message,
            admin_id: payload.new.admin_id,
            created_at: payload.new.created_at,
            admin_name: userData?.name || "Unknown Admin"
          };
          
          setUpdates(prev => [newUpdate, ...prev]);
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });
      
    return () => {
      console.log("Removing channel subscription");
      subscription.unsubscribe();
    };
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUpdates();
    setRefreshing(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || user.type !== 'admin') return;
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("festival_updates")
        .insert([{
          message: newMessage.trim(),
          admin_id: user.id
        }]);
        
      if (error) throw error;
      
      setNewMessage("");
      
      toast({
        title: "Success",
        description: "Festival update has been posted.",
      });
    } catch (error) {
      console.error("Error posting festival update:", error);
      toast({
        title: "Error",
        description: "Failed to post festival update.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Festival Updates</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <Card className="shadow-lg overflow-hidden">
        <div className="p-4 bg-primary text-primary-foreground">
          <h2 className="text-lg font-semibold">Festiverse Announcements</h2>
        </div>
        
        <ScrollArea className="h-[60vh]">
          <div className="p-4 flex flex-col-reverse space-y-reverse space-y-4">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading updates...</p>
                </div>
              </div>
            ) : updates.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No festival updates yet.
              </div>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {getInitials(update.admin_name || "NA")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className="font-medium mr-2">{update.admin_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="mt-1 p-3 bg-secondary/10 rounded-lg text-foreground">
                      {update.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        {user && user.type === 'admin' && (
          <>
            <Separator />
            <form onSubmit={handleSubmit} className="p-4 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your announcement here..."
                disabled={submitting}
                className="flex-1"
              />
              <Button type="submit" disabled={submitting || !newMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </form>
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default FestivalUpdates;

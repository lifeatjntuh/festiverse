
import { supabase } from "@/integrations/supabase/client";
import { generateSeedData } from "./seedData";
import { toast } from "@/hooks/use-toast";

/**
 * Inserts seed data into the database
 * @param adminId The ID of the admin user
 */
export const insertSeedData = async (adminId: string) => {
  try {
    // Generate the seed data SQL
    const seedData = generateSeedData(adminId);
    
    // Insert events
    console.log("Inserting seed events...");
    for (const event of seedData.events) {
      const { error } = await supabase
        .from("events")
        .insert([event]);
      
      if (error) {
        console.error("Error inserting event:", error);
        throw error;
      }
    }
    console.log("Events inserted successfully");
    
    // Insert festival updates
    console.log("Inserting seed festival updates...");
    for (const update of seedData.festivalUpdates) {
      const { error } = await supabase
        .from("festival_updates")
        .insert([update]);
      
      if (error) {
        console.error("Error inserting festival update:", error);
        throw error;
      }
    }
    console.log("Festival updates inserted successfully");
    
    toast({
      title: "Seed Data Inserted",
      description: `Successfully inserted ${seedData.events.length} events and ${seedData.festivalUpdates.length} festival updates.`,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to insert seed data:", error);
    toast({
      title: "Seed Data Error",
      description: "Failed to insert seed data. Check console for details.",
      variant: "destructive",
    });
    return false;
  }
};

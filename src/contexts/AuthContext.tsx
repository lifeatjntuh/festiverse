
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  requestRoleElevation: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    // First check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Initial session check:", sessionData.session?.user?.id);
        
        if (sessionData.session?.user) {
          setSession(sessionData.session);
          
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", sessionData.session.user.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile on init:", error);
            setUser(null);
          } else {
            console.log("Initial user profile:", userData);
            setUser(userData);
          }
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
        
        // Now set up the auth listener AFTER initial check completes
        setupAuthListener();
      }
    };

    const setupAuthListener = () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        if (newSession) {
          setSession(newSession);
          
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            setIsLoading(true);
            try {
              // Fetch user profile
              const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("auth_id", newSession.user.id)
                .single();
              
              if (!error && data) {
                console.log("User profile fetched:", data);
                setUser(data);
              } else {
                console.error("Error fetching user profile on auth change:", error);
                setUser(null);
              }
            } catch (err) {
              console.error("Error in auth state change handler:", err);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      });
      
      subscription = data.subscription;
    };

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Success will be handled by the auth state change listener
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");
      
      // Create user profile
      const { error: profileError } = await supabase
        .from("users")
        .insert([{ 
          auth_id: authData.user.id,
          email,
          name: userData.name || '',
          phone: userData.phone,
          passout_year: userData.passout_year,
          admission_year: userData.admission_year,
          course: userData.course,
          department: userData.department,
          college: userData.college,
          type: 'attendee', // Default role
          role_elevation_requested: false
        }]);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Account created!",
        description: "Welcome to Festiverse. You've successfully signed up.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate("/login");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      console.log("Updating profile with data:", data);
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestRoleElevation = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("users")
        .update({ role_elevation_requested: true })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update local user state
      setUser(prev => prev ? { ...prev, role_elevation_requested: true } : null);
      
      toast({
        title: "Request submitted",
        description: "Your request for role elevation has been submitted and is pending approval.",
      });
    } catch (error: any) {
      console.error("Role elevation request error:", error);
      toast({
        title: "Request failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isLoading, 
        signIn, 
        signUp, 
        signOut, 
        updateProfile,
        requestRoleElevation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

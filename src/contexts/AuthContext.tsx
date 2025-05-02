import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../supabaseClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "Admin" | "User";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const fetchSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setIsLoading(false);
          return;
        }
        
        if (sessionData?.session) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (userError || !userData) {
            console.error("User data error:", userError);
            setIsLoading(false);
            return;
          }
          
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as "Admin" | "User"
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!userError && userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role as "Admin" | "User"
            });
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For development/testing, keep admin hardcoded credential
      if (email === "admin@aivia.com" && password === "admin123") {
        const adminUser = {
          id: "admin-1",
          email: "admin@aivia.com",
          name: "Admin User",
          role: "Admin" as const,
        };
        
        setUser(adminUser);
        localStorage.setItem("aivia_user", JSON.stringify(adminUser));
        
        toast({
          title: "Login successful",
          description: "Welcome back, Admin",
        });
        
        navigate("/inbox");
        setIsLoading(false);
        return;
      }
      
      // Normal Supabase auth flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Fetch additional user data from your users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userError) {
          throw userError;
        }
        
        const userInfo = {
          id: data.user.id,
          email: data.user.email as string,
          name: userData.name,
          role: userData.role as "Admin" | "User"
        };
        
        setUser(userInfo);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}`,
        });
        
        navigate("/inbox");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("aivia_user");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Helper properties
  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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

  // This will be replaced with actual Supabase integration later
  useEffect(() => {
    // Check for user session in localStorage (temporary solution)
    const storedUser = localStorage.getItem("aivia_user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - will be replaced with Supabase auth
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
      } else if (email === "test@example.com" && password === "password") {
        const regularUser = {
          id: "user-1",
          email: "test@example.com",
          name: "Regular User",
          role: "User" as const,
        };
        
        setUser(regularUser);
        localStorage.setItem("aivia_user", JSON.stringify(regularUser));
        
        toast({
          title: "Login successful",
          description: "Welcome to AIVIA-MBox",
        });
        
        navigate("/inbox");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try admin@aivia.com / admin123 (admin) or test@example.com / password (regular user)",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aivia_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
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

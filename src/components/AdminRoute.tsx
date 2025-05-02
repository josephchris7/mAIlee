
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="size-16 rounded-full border-4 border-transparent border-t-primary animate-spin mb-4"></div>
        <p className="text-lg text-primary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    });
    return <Navigate to="/inbox" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;

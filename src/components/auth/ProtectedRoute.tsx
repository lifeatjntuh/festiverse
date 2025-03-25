
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "organizer" | "attendee";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show nothing (or could show a spinner)
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check is required and user doesn't have the required role
  if (requiredRole && user.type !== requiredRole && 
      // Special case: if organizer role is required, admin can also access
      !(requiredRole === "organizer" && user.type === "admin")) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;


import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Phone, GraduationCap, Building, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserProfileViewProps {
  user: User;
  showDetailedInfo?: boolean;
}

const UserProfileView = ({ user, showDetailedInfo = true }: UserProfileViewProps) => {
  if (!user) return null;

  const getRoleBadgeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return "bg-red-500";
      case 'organizer':
        return "bg-blue-500";
      case 'attendee':
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mr-3">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {user.name}
          <Badge className={`ml-3 ${getRoleBadgeColor(user.type)}`}>
            {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDetailedInfo && (
          <>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            
            {user.college && (
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.college}</span>
              </div>
            )}
            
            {user.department && (
              <div className="flex items-center">
                <School className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.department}</span>
              </div>
            )}
            
            {user.course && (
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.course}</span>
              </div>
            )}
            
            {(user.admission_year || user.passout_year) && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {user.admission_year && `${user.admission_year}`}
                  {user.admission_year && user.passout_year && " - "}
                  {user.passout_year && `${user.passout_year}`}
                </span>
              </div>
            )}
            
            {user.role_elevation_requested && (
              <Badge variant="outline" className="mt-2">Role Request Pending</Badge>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileView;

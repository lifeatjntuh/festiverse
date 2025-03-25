
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Edit2, Save, X, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import StarredEvents from "@/components/profile/StarredEvents";
import UserEvents from "@/components/profile/UserEvents";
import { toast } from "@/hooks/use-toast";

type ProfileFormValues = {
  name: string;
  phone: string;
  college: string;
  department: string;
  course: string;
  admission_year: number | undefined;
  passout_year: number | undefined;
};

const Profile = () => {
  const { user, updateProfile, requestRoleElevation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [confirmRoleRequest, setConfirmRoleRequest] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      college: user?.college || "",
      department: user?.department || "",
      course: user?.course || "",
      admission_year: user?.admission_year || undefined,
      passout_year: user?.passout_year || undefined,
    }
  });

  // Form for role elevation dialog
  const roleForm = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      college: user?.college || "",
      department: user?.department || "",
      course: user?.course || "",
      admission_year: user?.admission_year || undefined,
      passout_year: user?.passout_year || undefined,
    }
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        college: user.college || "",
        department: user.department || "",
        course: user.course || "",
        admission_year: user.admission_year || undefined,
        passout_year: user.passout_year || undefined,
      });
      
      roleForm.reset({
        name: user.name || "",
        phone: user.phone || "",
        college: user.college || "",
        department: user.department || "",
        course: user.course || "",
        admission_year: user.admission_year || undefined,
        passout_year: user.passout_year || undefined,
      });
      
      setPhoneNumber(user.phone || "");
    }
  }, [user, reset, roleForm]);

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Convert string years to numbers if they exist
      if (data.admission_year) {
        data.admission_year = Number(data.admission_year);
      }
      if (data.passout_year) {
        data.passout_year = Number(data.passout_year);
      }
      
      console.log("Submitting profile update:", data);
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleRequest = () => {
    // Check if all required fields are filled
    const hasEmptyRequiredFields = !user.name || !user.phone || !user.college || !user.department || !user.course;
    
    if (hasEmptyRequiredFields) {
      setShowRoleDialog(true);
    } else {
      setConfirmRoleRequest(true);
    }
  };
  
  const submitRoleRequest = async () => {
    await requestRoleElevation();
    setConfirmRoleRequest(false);
  };
  
  const submitRoleProfile = async (data: ProfileFormValues) => {
    try {
      // Convert string years to numbers if they exist
      if (data.admission_year) {
        data.admission_year = Number(data.admission_year);
      }
      if (data.passout_year) {
        data.passout_year = Number(data.passout_year);
      }
      
      // Update the profile first
      await updateProfile(data);
      
      // Then request role elevation
      await requestRoleElevation();
      
      setShowRoleDialog(false);
      toast({
        title: "Profile updated and role requested",
        description: "Your profile has been updated and your request for organizer role has been submitted.",
      });
    } catch (error) {
      console.error("Error updating profile for role request:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (type: UserType) => {
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    reset({
                      name: user.name || "",
                      phone: user.phone || "",
                      college: user.college || "",
                      department: user.department || "",
                      course: user.course || "",
                      admission_year: user.admission_year || undefined,
                      passout_year: user.passout_year || undefined,
                    });
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSubmit(onSubmit)}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic account information and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 text-center mb-4">
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <Badge className={getRoleBadgeColor(user.type)}>
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </Badge>
                  {user.role_elevation_requested && (
                    <Badge variant="outline">Role Request Pending</Badge>
                  )}
                </div>
              </div>
              
              {user.type === 'attendee' && !user.role_elevation_requested && (
                <Button 
                  className="w-full"
                  onClick={handleRoleRequest}
                >
                  Request Organizer Role
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Your personal and academic information</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("phone")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("college")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("department")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("course")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admission_year">Admission Year</Label>
                    <Input
                      id="admission_year"
                      type="number"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("admission_year", {
                        valueAsNumber: true,
                        validate: value => 
                          !value || (value >= 1900 && value <= new Date().getFullYear()) || 
                          "Please enter a valid year"
                      })}
                    />
                    {errors.admission_year && (
                      <p className="text-sm text-red-500">{errors.admission_year.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="passout_year">Passout Year</Label>
                    <Input
                      id="passout_year"
                      type="number"
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                      {...register("passout_year", {
                        valueAsNumber: true,
                        validate: value => 
                          !value || (value >= 1900 && value <= new Date().getFullYear() + 10) || 
                          "Please enter a valid year"
                      })}
                    />
                    {errors.passout_year && (
                      <p className="text-sm text-red-500">{errors.passout_year.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="starred" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="starred">Starred Events</TabsTrigger>
            {user.type !== 'attendee' && (
              <TabsTrigger value="myevents">My Events</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="starred" className="mt-6">
            <StarredEvents />
          </TabsContent>
          {user.type !== 'attendee' && (
            <TabsContent value="myevents" className="mt-6">
              <UserEvents />
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
      
      {/* Dialog for completing profile for role elevation */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              To request an organizer role, please complete your profile information.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(submitRoleProfile)} className="space-y-4">
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Name is required" }}
              />
              
              <FormField
                control={roleForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Phone number is required" }}
              />
              
              <FormField
                control={roleForm.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College/University</FormLabel>
                    <FormControl>
                      <Input placeholder="Your college or university" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "College/University is required" }}
              />
              
              <FormField
                control={roleForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Your department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Department is required" }}
              />
              
              <FormField
                control={roleForm.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Your course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{ required: "Course is required" }}
              />
              
              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for confirming role elevation */}
      <Dialog open={confirmRoleRequest} onOpenChange={setConfirmRoleRequest}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Role Request</DialogTitle>
            <DialogDescription>
              Please confirm your profile information before submitting your request to become an organizer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">College</p>
                <p className="text-sm">{user.college}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm">{user.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Course</p>
                <p className="text-sm">{user.course}</p>
              </div>
            </div>
            
            {/* Update phone option */}
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="updatePhone">Update Phone Number</Label>
                <Input 
                  id="updatePhone" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (phoneNumber !== user.phone) {
                      await updateProfile({ phone: phoneNumber });
                      toast({
                        title: "Phone number updated",
                        description: "Your phone number has been updated successfully.",
                      });
                    }
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Update
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRoleRequest(false)}>
              Cancel
            </Button>
            <Button onClick={submitRoleRequest}>
              <User className="h-4 w-4 mr-2" />
              Request Organizer Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

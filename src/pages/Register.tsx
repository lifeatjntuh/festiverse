
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, School, BookOpen, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User as UserType } from "@/types";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  college?: string;
  department?: string;
  course?: string;
  admission_year?: number;
  passout_year?: number;
};

const Register = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>();
  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userData: Partial<UserType> = {
        name: data.name,
        phone: data.phone,
        college: data.college,
        department: data.department,
        course: data.course,
        admission_year: data.admission_year,
        passout_year: data.passout_year,
      };
      
      await signUp(data.email, data.password, userData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Enter your basic information to create an account" 
                : "Tell us more about your academic details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-10"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="pl-10"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: value => value === password || "Passwords do not match",
                        })}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                        {...register("phone")}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="button"
                    className="w-full" 
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="college"
                        placeholder="e.g. Harvard University"
                        className="pl-10"
                        {...register("college")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="department"
                        placeholder="e.g. Computer Science"
                        className="pl-10"
                        {...register("department")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="course"
                        placeholder="e.g. Bachelor of Science"
                        className="pl-10"
                        {...register("course")}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admission_year">Admission Year</Label>
                      <Input
                        id="admission_year"
                        type="number"
                        placeholder="e.g. 2020"
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
                        placeholder="e.g. 2024"
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
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-1/2" 
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="w-1/2" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;

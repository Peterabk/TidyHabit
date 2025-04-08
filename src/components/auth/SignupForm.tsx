
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  onSignup: () => void;
}

const signupSchema = z.object({
  familyName: z.string().min(2, "Family name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm: React.FC<SignupFormProps> = ({ onSignup }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      familyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Signup data:", data);
    
    // This would normally send data to a backend
    toast({
      title: "Account Created",
      description: `Welcome to Chore Crew Organizer, ${data.familyName}!`,
    });
    
    onSignup();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="familyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="Smith Family" 
                    {...field} 
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder="your@email.com" 
                    {...field} 
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="******" 
                    {...field} 
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="******" 
                    {...field} 
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
          Create Account
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;

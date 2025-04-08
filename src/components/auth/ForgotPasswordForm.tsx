
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = React.useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log("Reset password email:", data.email);
    
    // This would normally send a password reset email
    toast({
      title: "Reset Link Sent",
      description: "If an account exists with this email, you'll receive a password reset link",
    });
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-medium">Check your inbox</h3>
        <p className="text-muted-foreground text-sm">
          We've sent a password reset link to your email address if an account exists.
        </p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-2 pl-0 text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
      </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
            Send Reset Link
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;

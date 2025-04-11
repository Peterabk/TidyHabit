
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  onLogin: () => void;
  isAuthenticated: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, isAuthenticated }) => {
  const [activeView, setActiveView] = useState<"login" | "signup" | "forgot-password">("login");
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleDemo = () => {
    toast({
      title: "Demo Login",
      description: "Logged in with demo account successfully!",
      duration: 3000,
    });
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">TidyHabit</h1>
          <p className="text-teal-600 mt-2">Manage your family tasks efficiently</p>
        </div>

        <Card>
          <CardHeader>
            {activeView === "forgot-password" ? (
              <>
                <CardTitle className="text-xl text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email to receive a password reset link
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center">
                  Login to your account or create a new one
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            {activeView === "forgot-password" ? (
              <ForgotPasswordForm onBack={() => setActiveView("login")} />
            ) : (
              <Tabs defaultValue="login" value={activeView} onValueChange={(v) => setActiveView(v as any)}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm 
                    onLogin={onLogin} 
                    onForgotPassword={() => setActiveView("forgot-password")} 
                  />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSignup={onLogin} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="w-full h-px bg-gray-200"></div>
            <button 
              onClick={handleDemo} 
              className="w-full py-2 rounded-md border border-teal-400 text-teal-600 hover:bg-teal-50 transition-colors"
            >
              Try Demo Version
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

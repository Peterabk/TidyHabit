import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FamilyProvider } from "./context/FamilyContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FamilyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={isAuthenticated ? <Index /> : <Navigate to="/auth" />} 
              />
              <Route 
                path="/auth" 
                element={<AuthPage onLogin={login} isAuthenticated={isAuthenticated} />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FamilyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

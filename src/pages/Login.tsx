
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import AiBackgroundElements from "@/components/AiBackgroundElements";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This would connect to your backend in a real app
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo, always succeed with test@example.com
      if (credentials.email === "test@example.com" && credentials.password === "password") {
        toast({
          title: "Login successful",
          description: "Welcome back to AI MailBox",
        });
        navigate("/inbox");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try test@example.com / password",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-50 to-white dark:from-mailgray-950 dark:to-mailgray-900 overflow-hidden relative">
      <AiBackgroundElements />
      
      <Card className="w-[350px] shadow-xl glass-card relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="size-16 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center animate-pulse-glow">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-6 7-6" />
                <path d="M5 13h14" />
                <path d="M19 7v10" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">AI MailBox</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="bg-white/50 dark:bg-mailgray-900/50"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="bg-white/50 dark:bg-mailgray-900/50"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-lavender-600 to-lavender-500 hover:from-lavender-700 hover:to-lavender-600 transition-all duration-300 border-none"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-xs text-mailgray-500">
            Demo access: test@example.com / password
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

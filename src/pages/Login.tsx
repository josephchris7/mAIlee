
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AiBackgroundElements from "@/components/AiBackgroundElements";
import { useAuth } from "@/contexts/AuthContext";
import AiviaLogo from "@/components/AiviaLogo";

const Login = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(credentials.email, credentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-aivia-very-light-purple to-white dark:from-aivia-deep-purple dark:to-background overflow-hidden relative">
      <AiBackgroundElements />
      
      <Card className="w-[350px] shadow-xl glass-card relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <AiviaLogo className="size-32" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-aivia-deep-purple dark:text-aivia-light-purple">AIVIA-MBox</CardTitle>
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
                  className="bg-white/50 dark:bg-aivia-deep-purple/30"
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
                  className="bg-white/50 dark:bg-aivia-deep-purple/30"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-aivia-deep-purple to-aivia-medium-purple hover:from-aivia-medium-purple hover:to-aivia-deep-purple transition-all duration-300 border-none text-white"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground">
            Admin: admin@aivia.com / admin123
          </div>
          <div className="text-xs text-muted-foreground">
            User: test@example.com / password
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

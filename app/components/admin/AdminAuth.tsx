"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// This is just for demo purposes - in a real app, this would be handled securely on the server
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

interface AdminAuthProps {
  onAuthenticated: (isAuthenticated: boolean) => void;
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // In a real app, we'd store a token in localStorage or use cookies
      localStorage.setItem("adminAuthenticated", "true");
      onAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: "You are now logged in as an administrator",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>
          Enter your admin credentials to manage the padel calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full">Login</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
} 
"use client";

import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNo,
        }),
      });

      if (response.ok) {
        setLoading(false);
        toast({
          title: "Account Created Successfully!",
          description: "Welcome aboard! You can now log in.",
          variant: "default",
        });
        console.log("Registration successful");
      } else {
        console.log("Registration failed", response);
        setLoading(false);
        toast({
          title: "Registration Failed",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast({
        title: "An Error Occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md overflow-hidden bg-black text-white shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <CardHeader className="relative space-y-1 border-b border-gray-800 px-6 pb-6 pt-8">
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join us today and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4 px-6 py-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-200">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-700 bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-700 bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNo" className="text-sm font-medium text-gray-200">Phone Number</Label>
            <Input
              id="phoneNo"
              type="tel"
              placeholder="15556664444"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="border-gray-700 bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-700 bg-white pr-10 text-black placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="relative border-t border-gray-800 px-6 py-8">
          <Button
            className="w-full bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Your Account..." : "Register Now"}
          </Button>
        </CardFooter>
        
      </Card>
      
    </div>
  );
};

export default Register;
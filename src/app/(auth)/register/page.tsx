'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNo,
          department,
          designation,
        }),
      });

      if (response.ok) {
        setLoading(false);
        toast({
          title: 'Account Created Successfully!',
          description: 'Welcome aboard! You can now log in.',
          variant: 'default',
        });
        router.replace('/check-email');
        console.log('Registration successful');
      } else {
        console.log('Registration failed', response);
        setLoading(false);
        toast({
          title: 'Registration Failed',
          description: 'Please check your information and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast({
        title: 'An Error Occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <Card className="relative w-full max-w-md overflow-hidden bg-black text-white shadow-2xl rounded-lg">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black opacity-30 pointer-events-none"></div>

        {/* Header */}
        <CardHeader className="relative space-y-2 border-b border-gray-800 px-6 pb-6 pt-8 text-center">
          <CardTitle className="text-4xl font-extrabold text-yellow-400">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-400">
            Join us today and start your journey
          </CardDescription>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="relative space-y-6 px-6 py-8">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-200">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label
              htmlFor="phoneNo"
              className="text-sm font-medium text-gray-200"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNo"
              type="tel"
              placeholder="15556664444"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          {/* Department Field */}
          <div className="space-y-2">
            <Label
              htmlFor="department"
              className="text-sm font-medium text-gray-200"
            >
              Department
            </Label>
            <Input
              id="department"
              type="text"
              placeholder="Engineering"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          {/* Designation Field */}
          <div className="space-y-2">
            <Label
              htmlFor="designation"
              className="text-sm font-medium text-gray-200"
            >
              Designation
            </Label>
            <Input
              id="designation"
              type="text"
              placeholder="Software Engineer"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full rounded-md border-gray-700 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-gray-700 bg-gray-900 pr-10 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="relative border-t border-gray-800 px-6 py-6 flex flex-col items-center space-y-4">
          <Button
            className="w-full rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black transition-transform transform hover:scale-105"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating Your Account...' : 'Register Now'}
          </Button>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-semibold text-yellow-400 hover:underline hover:text-yellow-500"
            >
              Login here
            </a>
          </p>
        </CardFooter>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse"></div>
      </Card>
    </div>
  );
};

export default Register;

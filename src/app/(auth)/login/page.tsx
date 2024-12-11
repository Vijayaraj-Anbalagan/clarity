'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import axios from 'axios';
import { useRef } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const router = useRouter();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOTPSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), type: 'verify' }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || 'Invalid OTP');
        return;
      }

      toast({
        variant: 'default',
        title: '2-Factor Authentication done successfully',
      });
      router.push('/chat');
    } catch (error) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Something went wrong' });
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return toast({ variant: 'destructive', title: 'Please fill all fields' });
    }

    if (email === 'head@clarity.com' && password === 'admin123') {
      router.replace('/admin');
    }

    const result = await axios.post('/api/login', {
      email,
      password,
    });

    setLoading(false);

    console.log('Status', result.status);
    console.log('data', result.data.otpReq);
    if (result.status === 200 && result.data.otpReq === false) {
      router.replace('/chat');
    } else if (result.status === 200 && result.data.otpReq === true) {
      setStep('otp');
      const response = await axios.post('/api/send-otp', { email });
    } else {
      toast({ variant: 'destructive', title: result.data });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div
        className={`w-full max-w-md ${
          step === 'otp' && 'bg-yellow-400 rounded-lg shadow-lg p-6 '
        } space-y-4`}
      >
        {step === 'email' ? (
          <>
            <Card className="w-full max-w-md overflow-hidden bg-black text-white shadow-2xl">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <CardHeader className="relative space-y-1 border-b border-gray-800 px-6 pb-6 pt-8">
                <CardTitle className="text-3xl font-bold">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-4 px-6 py-8">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-200"
                  >
                    Email
                  </Label>
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
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-700 bg-white pr-10 text-black placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-gray-600 bg-white text-yellow-400 focus:ring-yellow-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-400">
                      Remember me
                    </Label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-yellow-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </CardContent>
              <CardFooter className="relative border-t border-gray-800 px-6 py-8">
                <Button
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
            </Card>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-black text-center">
              Enter OTP
            </h2>
            <p className="text-black text-center">
              Weve sent a one-time password to your email.
            </p>
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-black">
                One-Time Password
              </Label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    ref={(el) => {
                      otpInputRefs.current[index] = el; // Correctly assigning the ref
                    }}
                    className="w-12 h-12 text-center text-2xl bg-white text-black border-2 border-black rounded-md"
                    required
                  />
                ))}
              </div>
            </div>
            <Button
              onClick={handleOTPSubmit}
              disabled={loading}
              className=" w-full bg-black text-yellow-400 hover:bg-gray-800 "
            >
              {loading ? 'Verifying...' : 'Submit OTP'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

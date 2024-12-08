'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function TwoFactorAuthForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleEmailConfirm = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || 'Failed to send OTP');
        return;
      }

      toast({ variant: 'default', title: 'OTP sent successfully' });
      setStep('otp');
    } catch (error) {
      setLoading(false);
      toast({ variant: 'destructive', title: 'Something went wrong' });
    }
  };

  const handleOTPSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.join(''), type: 'setup' }),
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-yellow-400 rounded-lg shadow-lg p-6 space-y-4">
        {step === 'email' ? (
          <>
            <h2 className="text-2xl font-bold text-black text-center">
              Confirm Your Email
            </h2>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-black border-black"
                placeholder="Enter your email"
                required
              />
            </div>
            <Button
              onClick={handleEmailConfirm}
              disabled={loading}
              className="w-full bg-black text-yellow-400 hover:bg-gray-800"
            >
              {loading ? 'Sending...' : 'Confirm Email'}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-black text-center">
              Enter OTP
            </h2>
            <p className="text-black text-center">
              We've sent a one-time password to your email.
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
              className="w-full bg-black text-yellow-400 hover:bg-gray-800"
            >
              {loading ? 'Verifying...' : 'Submit OTP'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

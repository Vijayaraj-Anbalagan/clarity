'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { CircleX, SquareCheckBig } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';

const VerifyEmailContent = () => {
  const { toast } = useToast();
  const router = useRouter(); // Add the router for navigation

  const [loading, setLoading] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState(false);

  const searchParams = useSearchParams();
  const verifyToken = searchParams.get('verifyToken');
  const id = searchParams.get('id');

  console.log(verifyToken, id);
  const initialized = React.useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      verifyEmail();
    }
  }, []);

  const verifyEmail = async () => {
    if (!verifyToken || !id)
      return toast({ variant: 'destructive', title: 'Invalid URL' });

    setLoading(true);

    try {
      const res = await fetch(
        `/api/verify-email?verifyToken=${verifyToken}&id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.ok) {
        setLoading(false);
        setVerified(true);
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/chat');
        }, 1000);
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  if (loading)
    return (
      <h1 className="flex justify-center items-center h-screen text-white bg-black">
        Verifying your Email address. Please wait...
      </h1>
    );

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-full max-w-md">
        {verified && (
          <Alert variant="default" className="mb-5 bg-yellow-400 text-white">
            <SquareCheckBig color="white" />
            <AlertTitle>Email Verified!</AlertTitle>
            <AlertDescription>
              Your email has been verified successfully. Redirecting to chat...
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-5 bg-red-600 text-white">
            <CircleX color="white" />
            <AlertTitle>Email Verification Failed!</AlertTitle>
            <AlertDescription>
              Your verification token is invalid or expired.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <Suspense
      fallback={
        <h1 className="flex justify-center items-center h-screen text-white bg-black">
          Loading...
        </h1>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmail;

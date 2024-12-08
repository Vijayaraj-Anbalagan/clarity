"use client";

import React from "react";

const CheckYourEmail = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
          Check Your Email
        </h1>
        <p className="text-gray-400 mb-6">
          A verification link has been sent to your email address. Please check
          your inbox and click on the link to verify your account.
        </p>
        <div className="text-center">
          <img
            src="/email-illustration.png"
            alt="Check Email"
            className="mx-auto mb-6 max-w-full h-auto"
          />
        </div>
        <p className="text-gray-500">
          Didn’t receive the email? <br />
          <span className="text-yellow-400 cursor-pointer hover:underline">
            Resend Verification Email
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckYourEmail;

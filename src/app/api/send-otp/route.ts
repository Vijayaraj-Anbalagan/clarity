import { dbConnect } from '@/config/dbConnect';
import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_FROM_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const otpHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #ffd700;
      color: #000000;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .email-body {
      padding: 20px;
      text-align: center;
      color: #333333;
    }
    .otp-box {
      display: inline-block;
      background-color: #000000;
      color: #ffd700;
      font-size: 28px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .email-footer {
      background-color: #ffd700;
      color: #000000;
      text-align: center;
      padding: 15px;
      font-size: 14px;
    }
    a {
      color: #ffd700;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Two-Factor Authentication (2FA) Code
    </div>
    <div class="email-body">
      <p>Hello,</p>
      <p>We received a request for 2FA verification. Use the OTP below to complete your process:</p>
      <div class="otp-box">{{OTP}}</div>
      <p>The OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <p>If you did not request this, please contact our support immediately.</p>
    </div>
    <div class="email-footer">
      © 2024 Your Company Name. All rights reserved.
      <br>
      <a href="https://yourcompany.com">Visit our website</a>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    console.log(email);
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Generate OTP
    const otp = user.getOTP();
    await user.save();

    await transporter.sendMail({
      from: process.env.SMTP_FROM_USER,
      to: email,
      subject: 'Your OTP for 2FA Verification',
      html: otpHtml.replace('{{OTP}}', otp),
    });

    return NextResponse.json(
      { message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

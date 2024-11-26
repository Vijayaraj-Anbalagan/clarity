import { dbConnect } from '@/config/dbConnect';
import User from '@/models/user.model';
import crypto from 'crypto';
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Hash the received OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Check OTP validity
    if (
      user.otpVerifyToken !== hashedOtp ||
      user.otpVerifyTokenExpire < new Date()
    ) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark the user as verified
    user.isOtpVerified = true;
    user.otpVerifyToken = undefined;
    user.otpVerifyTokenExpire = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'OTP verified successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

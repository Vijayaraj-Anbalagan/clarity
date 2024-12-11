import { NextRequest, NextResponse } from 'next/server';
import userModel from '@/models/user.model';
import Token from '@/models/token.model';
import { dbConnect } from '@/config/dbConnect';
const crypto = require('crypto');
import { sendCookies } from '@/utils/cookies';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const { email, password }: { email: string; password: string } =
      await request.json();

    await dbConnect();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Must provide both email and password',
        },
        {
          status: 400,
        }
      );
    }

    // Find user in the database
    const user = await userModel
      .findOne({ email })
      .select('_id name email password isOtpVerified');
    if (!user) {
      throw Error('User not found');
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a unique refresh token
    console.log('user', user);
    console.log('Otp', user.isOtpVerified);
    if (user.isOtpVerified) {
      return NextResponse.json({ otpReq: true }, { status: 200 });
    }
    const cryptoRefToken = crypto.randomBytes(40).toString('hex');
    // Create a refresh token in the database
    const refToken = await Token.create({
      refreshToken: cryptoRefToken,
      user: user._id,
    });

    // Destructure refreshToken and userId for cookies
    const refreshTokenUser = {
      refreshToken: refToken.refreshToken,
      user: refToken.user.toString(),
    };

    // Send cookies
    sendCookies(user, refreshTokenUser);

    // Respond with the user details
    return NextResponse.json(
      { otpReq: true, userId: user._id },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle errors appropriately
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

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
      throw Error('Must provide both email and password');
    }

    // Find user in the database
    const user = await userModel.findOne({ email }).select(
      '_id name email password'
    );
    if (!user) {
      throw Error('User not found');
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate a unique refresh token
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
    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    // Handle errors appropriately
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }
}

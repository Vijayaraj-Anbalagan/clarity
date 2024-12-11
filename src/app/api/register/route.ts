import bcrypt from 'bcryptjs';
import User from '@/models/user.model';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/config/dbConnect';
import { sendEmail } from '@/utils/sendEmail';
import { verificationEmailTemplate } from '@/utils/verificationEmailTemplate';
const crypto = require('crypto');
import Token from '../../../models/token.model';
import { sendCookies } from '@/utils/cookies';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log(body);

    const isEmail = await User.findOne({ email: body.email });
    if (isEmail) {
      return NextResponse.json(
        { message: 'Email Already Exists' },
        { status: 401 }
      );
    }

    // Create a new user
    const newUser = await User.create(body);

    const accessTokenUser = {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    const cryptoRefToken = crypto.randomBytes(40).toString('hex');
    const refToken = await Token.create({
      refreshToken: cryptoRefToken,
      user: newUser._id,
    });

    const refreshTokenUser = {
      refreshToken: refToken.refreshToken,
      user: refToken.user,
    };

    sendCookies(accessTokenUser, refreshTokenUser);

    const verificationToken = newUser.getVerificationToken();
    await newUser.save();

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verify-email?verifyToken=${verificationToken}&id=${newUser?._id}`;
    const message = verificationEmailTemplate(verificationLink);
    // Send verification email
    await sendEmail(newUser?.email, 'Email Verification', message);

    return NextResponse.json(
      { accessTokenUser, userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: 'Something went wrong' + error },
      { status: 500 }
    );
  }
}

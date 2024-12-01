const { cookies } = require('next/headers');
import { NextRequest, NextResponse } from 'next/server';
import Token from '@/models/token.model';
import { dbConnect } from '@/config/dbConnect';
import { cookiesParse } from '@/utils/cookies';

export async function GET(request: NextRequest) {
  const user = await cookiesParse(request);
  console.log(user);

  dbConnect();
  const tokenDelete = await Token.findOneAndDelete({ user: user._id });
  cookies().delete('refreshToken');
  cookies().delete('accessToken');
  return NextResponse.json({ msg: 'SuccessFully Logged Out' }, { status: 200 });
}

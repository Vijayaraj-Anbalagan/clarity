'use server';
import { cookies } from 'next/headers';
import Token from '@/models/token.model';
import userModel from '@/models/user.model';
import { createJWT, verifyJWT } from './jwt';
import { dbConnect } from '@/config/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const sendCookies = (
  accessTokenUser: Object,
  refreshTokenUser: Object
) => {
  const accessToken = createJWT(accessTokenUser);
  const refreshToken = createJWT(refreshTokenUser);
  cookies().set('accessToken', accessToken, {
    expires: new Date(Date.now() + 1000 * 20),
  });

  cookies().set('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
};

export const cookiesParse = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;
  console.log('access', accessToken);
  const refreshToken = request.cookies.get('refreshToken')?.value;
  console.log('Ref', refreshToken);

  try {
    await dbConnect();

    if (accessToken) {
      const { payload } = verifyJWT(accessToken);
      console.log('Normal', payload);
      return payload;
    }
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'refreshToken not found' },
        { status: 400 }
      );
    }
    const decodedRefToken = verifyJWT(refreshToken);
    const existingToken = await Token.findOne({
      user: decodedRefToken.payload.user,
    }).select('refreshToken isValid user');
    if (!existingToken || !existingToken?.isValid) {
      return NextResponse.json(
        { message: 'Unauthorized User' },
        { status: 401 }
      );
    }

    const tokenUser = await userModel
      .findOne({ _id: existingToken.user })
      .select('_id name email role');
    console.log('TokenUser', tokenUser);
    if (tokenUser) {
      sendCookies(tokenUser, existingToken);
    }
    return tokenUser;
  } catch (error) {
    console.log('Send COok', error);
    return false;
  }
};
